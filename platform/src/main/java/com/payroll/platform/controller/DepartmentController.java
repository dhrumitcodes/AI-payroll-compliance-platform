package com.payroll.platform.controller;

import com.payroll.platform.dto.DepartmentRequestDTO;
import com.payroll.platform.dto.DepartmentResponseDTO;
import com.payroll.platform.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> createDepartment(
            @PathVariable Long companyId,
            @Valid @RequestBody DepartmentRequestDTO dto) {
        return new ResponseEntity<>(departmentService.createDepartment(companyId, dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponseDTO>> getDepartmentsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(departmentService.getDepartmentsByCompany(companyId));
    }
}