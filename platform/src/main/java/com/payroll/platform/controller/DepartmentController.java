package com.payroll.platform.controller;

import com.payroll.platform.payload.ApiResponse;
import com.payroll.platform.dto.DepartmentRequestDTO;
import com.payroll.platform.dto.DepartmentResponseDTO;
import com.payroll.platform.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/departments")
@CrossOrigin(origins = "http://localhost:5173") // Bridges right over to your Vite UI port!
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>> createDepartment(@Valid @RequestBody DepartmentRequestDTO request) {
        DepartmentResponseDTO response = departmentService.createDepartment(request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Department managed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>> getDepartmentById(@PathVariable Long id) {
        DepartmentResponseDTO response = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Department fetched successfully", response));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<Page<DepartmentResponseDTO>>> getAllDepartmentsByCompany(
            @PathVariable Long companyId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        Page<DepartmentResponseDTO> response = departmentService.getAllDepartmentsByCompany(companyId, search, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Departments array synchronized successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDTO request) {
        DepartmentResponseDTO response = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Department modified and pushed", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Department purged from compliance context", null));
    }
}