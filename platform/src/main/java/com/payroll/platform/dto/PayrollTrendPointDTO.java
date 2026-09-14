package com.payroll.platform.dto;

import java.math.BigDecimal;

public class PayrollTrendPointDTO {

    private String payPeriod;
    private BigDecimal totalNetPay;

    public PayrollTrendPointDTO() {}

    public PayrollTrendPointDTO(String payPeriod, BigDecimal totalNetPay) {
        this.payPeriod = payPeriod;
        this.totalNetPay = totalNetPay;
    }

    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }

    public BigDecimal getTotalNetPay() { return totalNetPay; }
    public void setTotalNetPay(BigDecimal totalNetPay) { this.totalNetPay = totalNetPay; }
}