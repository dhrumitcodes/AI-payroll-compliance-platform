package com.payroll.platform.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDTO {

    private long totalEmployees;
    private long totalCompanies;
    private BigDecimal totalMonthlyPayroll;
    private String complianceScore;
    private long pendingActions;
    private List<PayrollTrendPointDTO> payrollTrend;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(long totalEmployees, long totalCompanies, BigDecimal totalMonthlyPayroll,
                               String complianceScore, long pendingActions, List<PayrollTrendPointDTO> payrollTrend) {
        this.totalEmployees = totalEmployees;
        this.totalCompanies = totalCompanies;
        this.totalMonthlyPayroll = totalMonthlyPayroll;
        this.complianceScore = complianceScore;
        this.pendingActions = pendingActions;
        this.payrollTrend = payrollTrend;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public BigDecimal getTotalMonthlyPayroll() { return totalMonthlyPayroll; }
    public void setTotalMonthlyPayroll(BigDecimal totalMonthlyPayroll) { this.totalMonthlyPayroll = totalMonthlyPayroll; }

    public String getComplianceScore() { return complianceScore; }
    public void setComplianceScore(String complianceScore) { this.complianceScore = complianceScore; }

    public long getPendingActions() { return pendingActions; }
    public void setPendingActions(long pendingActions) { this.pendingActions = pendingActions; }

    public List<PayrollTrendPointDTO> getPayrollTrend() { return payrollTrend; }
    public void setPayrollTrend(List<PayrollTrendPointDTO> payrollTrend) { this.payrollTrend = payrollTrend; }
}