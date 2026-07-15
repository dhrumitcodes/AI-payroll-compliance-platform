package com.payroll.platform.service;

import com.payroll.platform.model.Company;
import com.payroll.platform.model.Department;
import com.payroll.platform.model.Employee;
import com.payroll.platform.dto.EmployeeRequestDTO;
import com.payroll.platform.dto.EmployeeResponseDTO;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.DepartmentRepository;
import com.payroll.platform.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository, CompanyRepository companyRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public EmployeeResponseDTO createEmployee(Long companyId, EmployeeRequestDTO dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with ID: " + companyId));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        if (!department.getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Department does not belong to the specified company.");
        }

        if (employeeRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Employee with email '" + dto.getEmail() + "' already exists.");
        }

        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setCompany(company);
        employee.setDepartment(department);

        Employee saved = employeeRepository.save(employee);
        return mapToResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesByCompany(Long companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new EntityNotFoundException("Company not found with ID: " + companyId);
        }

        List<Employee> employees = employeeRepository.findByCompanyId(companyId);
        List<EmployeeResponseDTO> dtos = new ArrayList<>();
        for (Employee emp : employees) {
            dtos.add(mapToResponseDTO(emp));
        }
        return dtos;
    }

    private EmployeeResponseDTO mapToResponseDTO(Employee employee) {
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        response.setId(employee.getId());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setCompanyId(employee.getCompany().getId());
        response.setCompanyName(employee.getCompany().getName());

        if (employee.getDepartment() != null) {
            response.setDepartmentId(employee.getDepartment().getId());
            response.setDepartmentName(employee.getDepartment().getName());
        }
        return response;
    }
}