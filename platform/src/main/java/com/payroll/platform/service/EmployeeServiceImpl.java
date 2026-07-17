package com.payroll.platform.service.impl;

import com.payroll.platform.dto.EmployeeRequestDTO;
import com.payroll.platform.dto.EmployeeResponseDTO;
import com.payroll.platform.exception.EmployeeNotFoundException;
import com.payroll.platform.model.Company;
import com.payroll.platform.model.Department;
import com.payroll.platform.model.Employee;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.DepartmentRepository;
import com.payroll.platform.repository.EmployeeRepository;
import com.payroll.platform.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, CompanyRepository companyRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + dto.getCompanyId()));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + dto.getDepartmentId()));

        // Cross-validation: Check if the department actually belongs to the given company
        if (!department.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("The specified department does not belong to this company context.");
        }

        if (employeeRepository.existsByCompanyIdAndEmailIgnoreCase(dto.getCompanyId(), dto.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + dto.getEmail() + "' already exists in this company.");
        }

        Employee employee = new Employee(
                dto.getFirstName(), dto.getLastName(), dto.getEmail(),
                dto.getPosition(), dto.getHireDate(), company, department
        );
        return mapToResponseDTO(employeeRepository.save(employee));
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee record not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getEmployeesByCompany(Long companyId, String searchLastName, Pageable pageable) {
        Page<Employee> employees;
        if (searchLastName != null && !searchLastName.trim().isEmpty()) {
            employees = employeeRepository.findByCompanyIdAndLastNameContainingIgnoreCase(companyId, searchLastName, pageable);
        } else {
            employees = employeeRepository.findByCompanyId(companyId, pageable);
        }
        return employees.map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getEmployeesByDepartment(Long departmentId, Pageable pageable) {
        return employeeRepository.findByDepartmentId(departmentId, pageable).map(this::mapToResponseDTO);
    }

    @Override
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee record not found with ID: " + id));

        if (!employee.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                employeeRepository.existsByCompanyIdAndEmailIgnoreCase(employee.getCompany().getId(), dto.getEmail())) {
            throw new IllegalArgumentException("Email record already registered within this corporate context.");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + dto.getDepartmentId()));

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPosition(dto.getPosition());
        employee.setHireDate(dto.getHireDate());
        employee.setDepartment(department);

        return mapToResponseDTO(employeeRepository.save(employee));
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException("Cannot delete. Employee record not found with ID: " + id);
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeResponseDTO mapToResponseDTO(Employee emp) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(emp.getId());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getEmail());
        dto.setPosition(emp.getPosition());
        dto.setHireDate(emp.getHireDate());
        dto.setCompanyId(emp.getCompany().getId());
        dto.setCompanyName(emp.getCompany().getName());
        dto.setDepartmentId(emp.getDepartment().getId());
        dto.setDepartmentName(emp.getDepartment().getName());
        dto.setCreatedAt(emp.getCreatedAt());
        return dto;
    }
}