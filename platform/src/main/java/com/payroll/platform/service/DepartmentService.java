package com.payroll.platform.service;

import com.payroll.platform.dto.DepartmentRequestDTO;
import com.payroll.platform.dto.DepartmentResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepartmentService {
    DepartmentResponseDTO createDepartment(DepartmentRequestDTO requestDTO);
    DepartmentResponseDTO getDepartmentById(Long id);
    Page<DepartmentResponseDTO> getAllDepartmentsByCompany(Long companyId, String search, Pageable pageable);
    DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO requestDTO);
    void deleteDepartment(Long id);
}