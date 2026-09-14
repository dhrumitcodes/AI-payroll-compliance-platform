package com.payroll.platform.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AiInsightsResponseDTO {

    private Long companyId;
    private String companyName;
    private List<String> insights;
    private LocalDateTime generatedAt;

    public AiInsightsResponseDTO() {}

    public AiInsightsResponseDTO(Long companyId, String companyName, List<String> insights, LocalDateTime generatedAt) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.insights = insights;
        this.generatedAt = generatedAt;
    }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public List<String> getInsights() { return insights; }
    public void setInsights(List<String> insights) { this.insights = insights; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}