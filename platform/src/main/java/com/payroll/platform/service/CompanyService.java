package com.payroll.platform.service;

import com.payroll.platform.dto.CompanyRequestDTO;
import com.payroll.platform.dto.CompanyResponseDTO;
import com.payroll.platform.exception.ResourceNotFoundException;
import com.payroll.platform.model.Company;
import com.payroll.platform.model.User;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(
            CompanyRepository companyRepository,
            UserRepository userRepository
    ) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public CompanyResponseDTO createCompany(
            CompanyRequestDTO requestDTO
    ) {

        if (companyRepository.existsByRegistrationNumber(
                requestDTO.getRegistrationNumber()
        )) {
            throw new RuntimeException(
                    "Registration Number already exists"
            );
        }

        if (companyRepository.existsByNameIgnoreCase(
                requestDTO.getName()
        )) {
            throw new RuntimeException(
                    "A company with this name is already registered"
            );
        }

        Company company = new Company();

        company.setName(requestDTO.getName());
        company.setRegistrationNumber(
                requestDTO.getRegistrationNumber()
        );
        company.setEmail(requestDTO.getEmail());

        Company savedCompany =
                companyRepository.save(company);

        return mapToDTO(savedCompany);
    }


    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR')"
    )
    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getAllCompanies() {

        if (isSuperAdmin()) {

            return companyRepository.findAll()
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        Long companyId = getCurrentUserCompanyId();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id : "
                                        + companyId
                        )
                );

        return List.of(mapToDTO(company));
    }

    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR')"
    )
    @Transactional(readOnly = true)
    public Page<CompanyResponseDTO> getCompaniesWithPagination(
            int page,
            int size,
            String sortBy
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).ascending()
        );

        if (isSuperAdmin()) {

            return companyRepository
                    .findAll(pageable)
                    .map(this::mapToDTO);
        }

        Long companyId = getCurrentUserCompanyId();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id : "
                                        + companyId
                        )
                );

        List<CompanyResponseDTO> result =
                List.of(mapToDTO(company));

        int start =
                Math.min(page * size, result.size());

        int end =
                Math.min(start + size, result.size());

        List<CompanyResponseDTO> pageContent =
                result.subList(start, end);

        return new PageImpl<>(
                pageContent,
                pageable,
                result.size()
        );
    }

    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR')"
    )
    @Transactional(readOnly = true)
    public CompanyResponseDTO getCompanyById(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id : " + id
                        )
                );

        ensureCompanyAccess(company.getId());

        return mapToDTO(company);
    }

    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')"
    )
    public CompanyResponseDTO updateCompany(
            Long id,
            CompanyRequestDTO requestDTO
    ) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id : " + id
                        )
                );

        ensureCompanyAccess(company.getId());

        company.setName(requestDTO.getName());
        company.setRegistrationNumber(
                requestDTO.getRegistrationNumber()
        );
        company.setEmail(requestDTO.getEmail());

        Company updatedCompany =
                companyRepository.save(company);

        return mapToDTO(updatedCompany);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteCompany(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id : " + id
                        )
                );

        companyRepository.delete(company);
    }

    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR')"
    )
    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> searchCompanies(
            String keyword
    ) {

        if (isSuperAdmin()) {

            return companyRepository
                    .findByNameContainingIgnoreCase(keyword)
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        Long companyId = getCurrentUserCompanyId();

        return companyRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .filter(company ->
                        company.getId().equals(companyId)
                )
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "Authentication required"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "Authenticated user not found"
                        )
                );
    }

    private boolean isSuperAdmin() {

        return getCurrentUser()
                .getRole()
                .equals("ROLE_SUPER_ADMIN");
    }

    private Long getCurrentUserCompanyId() {

        User user = getCurrentUser();

        if (user.getCompanyId() == null) {

            throw new AccessDeniedException(
                    "User is not associated with a company"
            );
        }

        return user.getCompanyId();
    }

    private void ensureCompanyAccess(Long targetCompanyId) {

        if (isSuperAdmin()) {
            return;
        }

        Long currentCompanyId =
                getCurrentUserCompanyId();

        if (!currentCompanyId.equals(targetCompanyId)) {

            throw new AccessDeniedException(
                    "You do not have access to this company"
            );
        }
    }

    private CompanyResponseDTO mapToDTO(
            Company company
    ) {

        return new CompanyResponseDTO(
                company.getId(),
                company.getName(),
                company.getRegistrationNumber(),
                company.getEmail(),
                company.getEmployees() != null
                        ? company.getEmployees().size()
                        : 0
        );
    }
}