package com.payroll.platform.controller;

import com.payroll.platform.dto.AiInsightsResponseDTO;
import com.payroll.platform.payload.ApiResponse;
import com.payroll.platform.service.AiInsightsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
public class AiInsightsController {

    private final AiInsightsService aiInsightsService;

    public AiInsightsController(AiInsightsService aiInsightsService) {
        this.aiInsightsService = aiInsightsService;
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<AiInsightsResponseDTO>> getCompanyInsights(
            @PathVariable Long companyId) {

        AiInsightsResponseDTO insights = aiInsightsService.generateCompanyInsights(companyId);
        return ResponseEntity.ok(new ApiResponse<>(true, "AI insights generated", insights));
    }
}