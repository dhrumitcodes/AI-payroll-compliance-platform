package com.payroll.platform.repository;

import com.payroll.platform.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByRegistrationNumber(String registrationNumber);

    List<Company> findByNameContainingIgnoreCase(String name);

    boolean existsByRegistrationNumber(String registrationNumber);
}