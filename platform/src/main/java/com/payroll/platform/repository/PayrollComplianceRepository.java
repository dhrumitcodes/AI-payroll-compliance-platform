package com.payroll.platform.repository;

import com.payroll.platform.model.PayrollCompliance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PayrollComplianceRepository extends JpaRepository<PayrollCompliance, Long> {

    List<PayrollCompliance> findByEmployeeIdOrderByEvaluatedAtDesc(Long employeeId);
}