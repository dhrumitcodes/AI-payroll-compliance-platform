package com.payroll.platform.service.impl;

import com.payroll.platform.model.PayrollCompliance;
import com.payroll.platform.model.SalaryStructure;
import com.payroll.platform.repository.PayrollComplianceRepository;
import com.payroll.platform.repository.SalaryStructureRepository;
import com.payroll.platform.service.AIComplianceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AIComplianceServiceImpl implements AIComplianceService {

    private final SalaryStructureRepository salaryRepository;
    private final PayrollComplianceRepository complianceRepository;

    public AIComplianceServiceImpl(SalaryStructureRepository salaryRepository,
                                   PayrollComplianceRepository complianceRepository) {
        this.salaryRepository = salaryRepository;
        this.complianceRepository = complianceRepository;
    }

    @Override
    @Transactional
    public Map<String, Object> evaluateEmployeeCompliance(Long employeeId) {
        SalaryStructure salary = salaryRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Compliance check aborted. Salary structure not configured for Employee ID: " + employeeId));

        BigDecimal base = salary.getBaseSalary();
        BigDecimal allowance = salary.getAllowances();
        BigDecimal grossMonthly = base.add(allowance);
        BigDecimal projectedAnnualGross = grossMonthly.multiply(BigDecimal.valueOf(12));
        BigDecimal currentDeductions = salary.getDeductions();

        BigDecimal expectedPF = base.multiply(BigDecimal.valueOf(0.12)).setScale(2, RoundingMode.HALF_UP);

        BigDecimal calculatedAnnualTax = BigDecimal.ZERO;

        if (projectedAnnualGross.compareTo(BigDecimal.valueOf(1500000)) > 0) {
            calculatedAnnualTax = projectedAnnualGross.multiply(BigDecimal.valueOf(0.30));
        } else if (projectedAnnualGross.compareTo(BigDecimal.valueOf(1000000)) > 0) {
            calculatedAnnualTax = projectedAnnualGross.multiply(BigDecimal.valueOf(0.20));
        } else if (projectedAnnualGross.compareTo(BigDecimal.valueOf(700000)) > 0) {
            calculatedAnnualTax = projectedAnnualGross.multiply(BigDecimal.valueOf(0.10));
        } else {
            calculatedAnnualTax = BigDecimal.ZERO;
        }

        BigDecimal expectedMonthlyTax = calculatedAnnualTax.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        BigDecimal totalExpectedStatutoryDeductions = expectedPF.add(expectedMonthlyTax);

        String complianceStatus = "COMPLIANT";
        String riskAssessmentMessage = "All statutory calculations track cleanly within standard federal tolerances.";

        if (currentDeductions.compareTo(totalExpectedStatutoryDeductions) < 0) {
            complianceStatus = "NON_COMPLIANT";
            riskAssessmentMessage = "Warning: The employee's monthly deduction profile falls short of expected statutory liabilities (PF + estimated income tax). Check for tax withholding variances.";
        }


        PayrollCompliance complianceRecord = new PayrollCompliance(
                salary.getEmployee(),
                projectedAnnualGross,
                expectedPF,
                expectedMonthlyTax,
                totalExpectedStatutoryDeductions,
                currentDeductions,
                complianceStatus,
                riskAssessmentMessage
        );
        complianceRepository.save(complianceRecord);


        Map<String, Object> report = new HashMap<>();
        report.put("employeeId", employeeId);
        report.put("employeeName", salary.getEmployee().getFirstName() + " " + salary.getEmployee().getLastName());
        report.put("projectedAnnualGross", projectedAnnualGross);
        report.put("monthlyStatutoryPFEstimate", expectedPF);
        report.put("monthlyStatutoryTaxEstimate", expectedMonthlyTax);
        report.put("totalExpectedDeductions", totalExpectedStatutoryDeductions);
        report.put("actualConfiguredDeductions", currentDeductions);
        report.put("complianceStatus", complianceStatus);
        report.put("aiRiskAssessment", riskAssessmentMessage);

        return report;
    }
}