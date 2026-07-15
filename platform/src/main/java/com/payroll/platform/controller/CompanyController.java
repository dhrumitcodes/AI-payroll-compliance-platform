package com.payroll.platform.controller;

import com.payroll.platform.dto.CompanyRequestDTO;
import com.payroll.platform.dto.CompanyResponseDTO;
import com.payroll.platform.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public CompanyResponseDTO createCompany(@Valid @RequestBody CompanyRequestDTO requestDTO) {
        return companyService.createCompany(requestDTO);
    }

    @GetMapping
    public List<CompanyResponseDTO> getAllCompanies() {
        return companyService.getAllCompanies();
    }
}