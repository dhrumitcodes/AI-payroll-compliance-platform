package com.payroll.platform.service.impl;

import com.payroll.platform.dto.DepartmentRequestDTO;
import com.payroll.platform.dto.DepartmentResponseDTO;
import com.payroll.platform.exception.DepartmentNotFoundException;
import com.payroll.platform.model.Company;
import com.payroll.platform.model.Department;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.DepartmentRepository;
import com.payroll.platform.service.DepartmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository; // Needed to fetch & map parent reference

    public DepartmentServiceImpl(DepartmentRepository departmentRepository, CompanyRepository companyRepository) {
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto) {
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
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DepartmentResponseDTO> getAllDepartmentsByCompany(Long companyId, String search, Pageable pageable) {
        Page<Department> departments;
        if (search != null && !search.trim().isEmpty()) {
            departments = departmentRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, search, pageable);
        } else {
            departments = departmentRepository.findByCompanyId(companyId, pageable);
        }
        return departments.map(this::mapToResponseDTO);
    }

    @Override
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with ID: " + id));

        if (!department.getName().equalsIgnoreCase(dto.getName()) &&
                departmentRepository.existsByCompanyIdAndNameIgnoreCase(department.getCompany().getId(), dto.getName())) {
            throw new IllegalArgumentException("Department name already exists in this company context.");
        }

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        return mapToResponseDTO(departmentRepository.save(department));
    }

    @Override
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new DepartmentNotFoundException("Cannot delete. Department not found with ID: " + id);
        }
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
}