package com.payroll.platform.controller;

import com.payroll.platform.payload.ApiResponse;
import com.payroll.platform.service.AIComplianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/compliance")
@CrossOrigin(origins = "http://localhost:5173")
public class AIComplianceController {

    private final AIComplianceService complianceService;

    public AIComplianceController(AIComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping("/evaluate/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runEmployeeAudit(@PathVariable Long employeeId) {
        Map<String, Object> analysisReport = complianceService.evaluateEmployeeCompliance(employeeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "AI Compliance and Statutory Tax evaluation completed", analysisReport));
    }
}