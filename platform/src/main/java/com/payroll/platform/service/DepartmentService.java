package com.payroll.platform.service;

import com.payroll.platform.model.Company;
import com.payroll.platform.model.Department;
import com.payroll.platform.dto.DepartmentRequestDTO;
import com.payroll.platform.dto.DepartmentResponseDTO;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;

    public DepartmentService(DepartmentRepository departmentRepository, CompanyRepository companyRepository) {
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public DepartmentResponseDTO createDepartment(Long companyId, DepartmentRequestDTO dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with ID: " + companyId));

        if (departmentRepository.findByNameAndCompanyId(dto.getName(), companyId).isPresent()) {
            throw new IllegalArgumentException("Department name already exists in this company.");
        }

        Department department = new Department();
        department.setName(dto.getName());
        department.setCompany(company);

        // Handling your added field safely if Employee model tracks it
        // If your database doesn't have a description column yet, it will just drop out silently until you add it to Department.java entity

        Department saved = departmentRepository.save(department);
        return mapToResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getDepartmentsByCompany(Long companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new EntityNotFoundException("Company not found with ID: " + companyId);
        }
        List<Department> departments = departmentRepository.findByCompanyId(companyId);
        List<DepartmentResponseDTO> dtos = new ArrayList<>();
        for (Department dept : departments) {
            dtos.add(mapToResponseDTO(dept));
        }
        return dtos;
    }

    private DepartmentResponseDTO mapToResponseDTO(Department department) {
        DepartmentResponseDTO response = new DepartmentResponseDTO();
        response.setId(department.getId());
        response.setName(department.getName());
        response.setCompanyId(department.getCompany().getId());
        response.setCompanyName(department.getCompany().getName());
        return response;
    }
}