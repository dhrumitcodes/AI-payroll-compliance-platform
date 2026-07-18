package com.payroll.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class ProcessPayrollRequestDTO {

    @NotNull(message = "Employee ID is mandatory")
    private Long employeeId;

    @NotBlank(message = "Pay period is mandatory")
    @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "Pay period must match format YYYY-MM")
    private String payPeriod;

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }
}