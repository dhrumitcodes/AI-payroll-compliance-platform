package com.payroll.platform.repository;

import com.payroll.platform.model.PaySlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaySlipRepository extends JpaRepository<PaySlip, Long> {
    boolean existsByEmployeeIdAndPayPeriod(Long employeeId, String payPeriod);
    List<PaySlip> findByEmployeeId(Long employeeId);
}