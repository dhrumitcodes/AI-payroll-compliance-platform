package com.payroll.platform.controller;

import com.payroll.platform.dto.DashboardSummaryDTO;
import com.payroll.platform.payload.ApiResponse;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;

    public DashboardController(EmployeeRepository employeeRepository, CompanyRepository companyRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
    }

    // Real counts pulled straight from the database — not a hardcoded
    // placeholder. Payroll totals / compliance score / pending flags are
    // NOT covered here yet (no real aggregation logic exists for those
    // yet) — they remain a known gap, not silently "fixed" alongside this.
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getSummary() {
        long totalEmployees = employeeRepository.count();
        long totalCompanies = companyRepository.count();
        DashboardSummaryDTO summary = new DashboardSummaryDTO(totalEmployees, totalCompanies);
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard summary computed", summary));
    }
}
