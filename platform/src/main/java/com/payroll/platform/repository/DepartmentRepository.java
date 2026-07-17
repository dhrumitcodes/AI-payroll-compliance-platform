package com.payroll.platform.repository;

import com.payroll.platform.model.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByCompanyIdAndNameIgnoreCase(Long companyId, String name);
    Page<Department> findByCompanyId(Long companyId, Pageable pageable);
    Page<Department> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name, Pageable pageable);
}