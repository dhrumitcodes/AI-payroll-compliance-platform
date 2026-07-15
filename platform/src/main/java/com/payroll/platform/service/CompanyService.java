package com.payroll.platform.service;

import com.payroll.platform.dto.CompanyRequestDTO;
import com.payroll.platform.dto.CompanyResponseDTO;
import com.payroll.platform.model.Company;
import com.payroll.platform.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyResponseDTO createCompany(CompanyRequestDTO requestDTO) {

        Company company = new Company();
        company.setName(requestDTO.getName());
        company.setRegistrationNumber(requestDTO.getRegistrationNumber());

        Company savedCompany = companyRepository.save(company);

        return new CompanyResponseDTO(
                savedCompany.getId(),
                savedCompany.getName(),
                savedCompany.getRegistrationNumber()
        );
    }

    public List<CompanyResponseDTO> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(company -> new CompanyResponseDTO(
                        company.getId(),
                        company.getName(),
                        company.getRegistrationNumber()))
                .collect(Collectors.toList());
    }
}