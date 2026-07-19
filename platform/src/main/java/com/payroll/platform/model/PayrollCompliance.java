package com.payroll.platform.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll_compliance_evaluations")
public class PayrollCompliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "projected_annual_gross", nullable = false, precision = 12, scale = 2)
    private BigDecimal projectedAnnualGross;

    @Column(name = "monthly_pf_estimate", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyStatutoryPFEstimate;

    @Column(name = "monthly_tax_estimate", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyStatutoryTaxEstimate;

    @Column(name = "total_expected_deductions", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalExpectedDeductions;

    @Column(name = "actual_configured_deductions", nullable = false, precision = 12, scale = 2)
    private BigDecimal actualConfiguredDeductions;

    @Column(name = "compliance_status", nullable = false)
    private String complianceStatus; // e.g., "COMPLIANT" or "NON_COMPLIANT"

    @Column(name = "ai_risk_assessment", columnDefinition = "TEXT")
    private String aiRiskAssessment;

    @Column(name = "evaluated_at", nullable = false, updatable = false)
    private LocalDateTime evaluatedAt;

    @PrePersist
    protected void onCreate() {
        this.evaluatedAt = LocalDateTime.now();
    }


    public PayrollCompliance() {}

    public PayrollCompliance(Employee employee, BigDecimal projectedAnnualGross,
                             BigDecimal monthlyStatutoryPFEstimate, BigDecimal monthlyStatutoryTaxEstimate,
                             BigDecimal totalExpectedDeductions, BigDecimal actualConfiguredDeductions,
                             String complianceStatus, String aiRiskAssessment) {
        this.employee = employee;
        this.projectedAnnualGross = projectedAnnualGross;
        this.monthlyStatutoryPFEstimate = monthlyStatutoryPFEstimate;
        this.monthlyStatutoryTaxEstimate = monthlyStatutoryTaxEstimate;
        this.totalExpectedDeductions = totalExpectedDeductions;
        this.actualConfiguredDeductions = actualConfiguredDeductions;
        this.complianceStatus = complianceStatus;
        this.aiRiskAssessment = aiRiskAssessment;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public BigDecimal getProjectedAnnualGross() { return projectedAnnualGross; }
    public void setProjectedAnnualGross(BigDecimal projectedAnnualGross) { this.projectedAnnualGross = projectedAnnualGross; }

    public BigDecimal getMonthlyStatutoryPFEstimate() { return monthlyStatutoryPFEstimate; }
    public void setMonthlyStatutoryPFEstimate(BigDecimal monthlyStatutoryPFEstimate) { this.monthlyStatutoryPFEstimate = monthlyStatutoryPFEstimate; }

    public BigDecimal getMonthlyStatutoryTaxEstimate() { return monthlyStatutoryTaxEstimate; }
    public void setMonthlyStatutoryTaxEstimate(BigDecimal monthlyStatutoryTaxEstimate) { this.monthlyStatutoryTaxEstimate = monthlyStatutoryTaxEstimate; }

    public BigDecimal getTotalExpectedDeductions() { return totalExpectedDeductions; }
    public void setTotalExpectedDeductions(BigDecimal totalExpectedDeductions) { this.totalExpectedDeductions = totalExpectedDeductions; }

    public BigDecimal getActualConfiguredDeductions() { return actualConfiguredDeductions; }
    public void setActualConfiguredDeductions(BigDecimal actualConfiguredDeductions) { this.actualConfiguredDeductions = actualConfiguredDeductions; }

    public String getComplianceStatus() { return complianceStatus; }
    public void setComplianceStatus(String complianceStatus) { this.complianceStatus = complianceStatus; }

    public String getAiRiskAssessment() { return aiRiskAssessment; }
    public void setAiRiskAssessment(String aiRiskAssessment) { this.aiRiskAssessment = aiRiskAssessment; }

    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
}