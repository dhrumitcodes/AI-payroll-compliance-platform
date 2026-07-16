package com.payroll.platform.service;

import com.payroll.platform.dto.CompanyRequestDTO;
import com.payroll.platform.dto.CompanyResponseDTO;
import com.payroll.platform.exception.ResourceNotFoundException;
import com.payroll.platform.model.Company;
import com.payroll.platform.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyResponseDTO createCompany(CompanyRequestDTO requestDTO) {

        if (companyRepository.existsByRegistrationNumber(requestDTO.getRegistrationNumber())) {
            throw new RuntimeException("Registration Number already exists");
        }

        Company company = new Company();
        company.setName(requestDTO.getName());
        company.setRegistrationNumber(requestDTO.getRegistrationNumber());

        Company savedCompany = companyRepository.save(company);

        return mapToDTO(savedCompany);
    }


    public List<CompanyResponseDTO> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<CompanyResponseDTO> getCompaniesWithPagination(
            int page,
            int size,
            String sortBy) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).ascending()
        );

        return companyRepository
                .findAll(pageable)
                .map(this::mapToDTO);
    }

    public CompanyResponseDTO getCompanyById(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Company not found with id : " + id));

        return mapToDTO(company);
    }
    public CompanyResponseDTO updateCompany(Long id, CompanyRequestDTO requestDTO) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Company not found with id : " + id));

        company.setName(requestDTO.getName());
        company.setRegistrationNumber(requestDTO.getRegistrationNumber());

        Company updatedCompany = companyRepository.save(company);

        return mapToDTO(updatedCompany);
    }

    public void deleteCompany(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Company not found with id : " + id));

        companyRepository.delete(company);
    }

    public List<CompanyResponseDTO> searchCompanies(String keyword) {

        return companyRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    private CompanyResponseDTO mapToDTO(Company company) {

        return new CompanyResponseDTO(
                company.getId(),
                company.getName(),
                company.getRegistrationNumber()
        );
    }

}