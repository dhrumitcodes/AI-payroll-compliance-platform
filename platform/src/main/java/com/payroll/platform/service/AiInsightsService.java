package com.payroll.platform.service;

import com.payroll.platform.dto.AiInsightsResponseDTO;

public interface AiInsightsService {
    AiInsightsResponseDTO generateCompanyInsights(Long companyId);
}