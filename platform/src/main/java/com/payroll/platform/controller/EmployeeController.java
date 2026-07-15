package com.payroll.platform.controller;

import com.payroll.platform.dto.EmployeeRequestDTO;
import com.payroll.platform.dto.EmployeeResponseDTO;
import com.payroll.platform.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> createEmployee(
            @PathVariable Long companyId,
            @Valid @RequestBody EmployeeRequestDTO dto) {
        EmployeeResponseDTO created = employeeService.createEmployee(companyId, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesByCompany(@PathVariable Long companyId) {
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesByCompany(companyId);
        return ResponseEntity.ok(employees);
    }
}