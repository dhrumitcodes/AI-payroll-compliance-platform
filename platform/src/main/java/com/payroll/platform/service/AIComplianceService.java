package com.payroll.platform.service;

import java.util.Map;

public interface AIComplianceService {
    Map<String, Object> evaluateEmployeeCompliance(Long employeeId);
}