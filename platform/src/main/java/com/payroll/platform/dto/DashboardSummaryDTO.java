package com.payroll.platform.dto;

public class DashboardSummaryDTO {
    private long totalEmployees;
    private long totalCompanies;

    public DashboardSummaryDTO() {
    }

    public DashboardSummaryDTO(long totalEmployees, long totalCompanies) {
        this.totalEmployees = totalEmployees;
        this.totalCompanies = totalCompanies;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }
}
