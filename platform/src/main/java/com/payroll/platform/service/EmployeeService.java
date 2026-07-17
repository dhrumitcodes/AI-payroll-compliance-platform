package com.payroll.platform.service;

import com.payroll.platform.dto.EmployeeRequestDTO;
import com.payroll.platform.dto.EmployeeResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {
    EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO);
    EmployeeResponseDTO getEmployeeById(Long id);
    Page<EmployeeResponseDTO> getEmployeesByCompany(Long companyId, String searchLastName, Pageable pageable);
    Page<EmployeeResponseDTO> getEmployeesByDepartment(Long departmentId, Pageable pageable);
    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO);
    void deleteEmployee(Long id);
}