package com.payroll.platform.controller;

import com.payroll.platform.dto.CompanyRequestDTO;
import com.payroll.platform.dto.CompanyResponseDTO;
import com.payroll.platform.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.payroll.platform.payload.ApiResponse;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://laocalhost:5173")
@Tag(
        name = "Company Management",
        description = "CRUD APIs for Company Management"
)
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @Operation(summary = "Create a new company")
    @PostMapping
    public ResponseEntity<ApiResponse<CompanyResponseDTO>> createCompany(
            @Valid @RequestBody CompanyRequestDTO requestDTO) {

        CompanyResponseDTO company = companyService.createCompany(requestDTO);
        ApiResponse<CompanyResponseDTO> response =
                new ApiResponse<>(
                        true,
        "company created successfully",
        company);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all companies")
    @GetMapping
    public ResponseEntity<List<CompanyResponseDTO>> getAllCompanies() {

        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @Operation(summary = "Get company by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> getCompanyById(
            @PathVariable Long id) {

        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @Operation(summary = "Update company")
    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequestDTO requestDTO) {

        return ResponseEntity.ok(
                companyService.updateCompany(id, requestDTO)
        );
    }

    @Operation(summary = "Delete company")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompany(
            @PathVariable Long id) {

        companyService.deleteCompany(id);

        return ResponseEntity.ok("Company deleted successfully");
    }

    @Operation(summary = "Search companies by keyword")
    @GetMapping("/search")
    public ResponseEntity<List<CompanyResponseDTO>> searchCompanies(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                companyService.searchCompanies(keyword)
        );
    }

    @Operation(summary = "Get companies with pagination and sorting")
    @GetMapping("/paged")
    public ResponseEntity<Page<CompanyResponseDTO>> getCompaniesWithPagination(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sortBy

    ) {

        return ResponseEntity.ok(
                companyService.getCompaniesWithPagination(
                        page,
                        size,
                        sortBy
                )
        );
    }
}