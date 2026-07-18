package com.payroll.platform.controller;

import com.payroll.platform.dto.*;
import com.payroll.platform.payload.ApiResponse;
import com.payroll.platform.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping("/salary-structures")
    public ResponseEntity<ApiResponse<SalaryResponseDTO>> configureSalary(@Valid @RequestBody SalaryRequestDTO request) {
        SalaryResponseDTO response = payrollService.setSalaryStructure(request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Salary layout configured successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/salary-structures/employee/{employeeId}")
    public ResponseEntity<ApiResponse<SalaryResponseDTO>> getSalaryByEmployee(@PathVariable Long employeeId) {
        SalaryResponseDTO response = payrollService.getSalaryStructureByEmployee(employeeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Salary structure record pulled", response));
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaySlipResponseDTO>> processPayroll(@Valid @RequestBody ProcessPayrollRequestDTO request) {
        PaySlipResponseDTO response = payrollService.processMonthlyPayroll(request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Monthly payroll run executed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/slips/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<PaySlipResponseDTO>>> getEmployeeSlips(@PathVariable Long employeeId) {
        List<PaySlipResponseDTO> response = payrollService.getEmployeePaySlips(employeeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pay slips chronological roster fetched", response));
    }
}