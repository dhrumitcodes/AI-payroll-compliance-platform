package com.payroll.platform.repository;

import com.payroll.platform.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByCompanyId(Long companyId);
    Optional<Department> findByNameAndCompanyId(String name, Long companyId);
}