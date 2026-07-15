package com.payroll.platform.repository;

import com.payroll.platform.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    // JpaRepository gives us save(), findAll(), findById(), and deleteById() out of the box!
}
