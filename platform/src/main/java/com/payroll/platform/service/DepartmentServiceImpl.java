package com.payroll.platform.service.impl;

import com.payroll.platform.dto.DepartmentRequestDTO;
import com.payroll.platform.dto.DepartmentResponseDTO;
import com.payroll.platform.exception.DepartmentNotFoundException;
import com.payroll.platform.model.Company;
import com.payroll.platform.model.Department;
import com.payroll.platform.model.User;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.DepartmentRepository;
import com.payroll.platform.repository.UserRepository;
import com.payroll.platform.service.DepartmentService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            CompanyRepository companyRepository,
            UserRepository userRepository
    ) {
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto) {

        ensureCompanyAccess(dto.getCompanyId());

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + dto.getCompanyId()));

        if (departmentRepository.existsByCompanyIdAndNameIgnoreCase(dto.getCompanyId(), dto.getName())) {
            throw new IllegalArgumentException("Department '" + dto.getName() + "' already exists under this company.");
        }

        Department department = new Department(dto.getName(), dto.getDescription(), company);
        Department saved = departmentRepository.save(department);
        return mapToResponseDTO(saved);
    }

    @Override
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR', 'EMPLOYEE')")
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with ID: " + id));

        ensureCompanyAccess(department.getCompany().getId());

        return mapToResponseDTO(department);
    }

    @Override
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR', 'EMPLOYEE')")
    @Transactional(readOnly = true)
    public Page<DepartmentResponseDTO> getAllDepartmentsByCompany(Long companyId, String search, Pageable pageable) {

        ensureCompanyAccess(companyId);

        Page<Department> departments;
        if (search != null && !search.trim().isEmpty()) {
            departments = departmentRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, search, pageable);
        } else {
            departments = departmentRepository.findByCompanyId(companyId, pageable);
        }
        return departments.map(this::mapToResponseDTO);
    }

    @Override
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO dto) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with ID: " + id));

        ensureCompanyAccess(department.getCompany().getId());

        if (!department.getName().equalsIgnoreCase(dto.getName()) &&
                departmentRepository.existsByCompanyIdAndNameIgnoreCase(department.getCompany().getId(), dto.getName())) {
            throw new IllegalArgumentException("Department name already exists in this company context.");
        }

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        return mapToResponseDTO(departmentRepository.save(department));
    }

    @Override
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    public void deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Cannot delete. Department not found with ID: " + id));

        ensureCompanyAccess(department.getCompany().getId());

        departmentRepository.deleteById(id);
    }

    private DepartmentResponseDTO mapToResponseDTO(Department dept) {
        DepartmentResponseDTO dto = new DepartmentResponseDTO();
        dto.setId(dept.getId());
        dto.setName(dept.getName());
        dto.setDescription(dept.getDescription());
        dto.setCompanyId(dept.getCompany().getId());
        dto.setCompanyName(dept.getCompany().getName());
        dto.setCreatedAt(dept.getCreatedAt());
        return dto;
    }

    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    private void ensureCompanyAccess(Long targetCompanyId) {

        User user = getCurrentUser();

        if ("ROLE_SUPER_ADMIN".equals(user.getRole())) {
            return;
        }

        if (user.getCompanyId() == null || !user.getCompanyId().equals(targetCompanyId)) {
            throw new AccessDeniedException("You do not have access to this company's data");
        }
    }
}