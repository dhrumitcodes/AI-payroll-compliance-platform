package com.payroll.platform.repository;

import com.payroll.platform.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);

    // This is the missing method that EmployeeService is looking for!
    List<Employee> findByCompanyId(Long companyId);
}