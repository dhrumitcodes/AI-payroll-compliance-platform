package com.payroll.platform.exception;

import com.payroll.platform.payload.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void resourceNotFoundException_returns404() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Company not found with ID: 99");

        ResponseEntity<ApiResponse<Object>> response = handler.handleResourceNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Company not found with ID: 99", response.getBody().getMessage());
    }

    @Test
    void employeeNotFoundException_isRoutedAs404_becauseItExtendsResourceNotFound() {

        EmployeeNotFoundException ex = new EmployeeNotFoundException("Employee not found with ID: 5");

        ResponseEntity<ApiResponse<Object>> response = handler.handleResourceNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void departmentNotFoundException_isRoutedAs404_becauseItExtendsResourceNotFound() {
        DepartmentNotFoundException ex = new DepartmentNotFoundException("Department not found with ID: 3");

        ResponseEntity<ApiResponse<Object>> response = handler.handleResourceNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void accessDeniedException_returns403() {
        AccessDeniedException ex = new AccessDeniedException("You do not have access to this company's data");

        ResponseEntity<ApiResponse<Object>> response = handler.handleAccessDenied(ex);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void genericRuntimeException_returns409() {
        RuntimeException ex = new RuntimeException("Employee with email 'x@y.com' already exists in this company.");

        ResponseEntity<ApiResponse<Object>> response = handler.handleRuntimeException(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void unexpectedException_returns500AndDoesNotLeakRawMessage() {
        Exception ex = new NullPointerException("some internal field was null at line 42");

        ResponseEntity<ApiResponse<Object>> response = handler.handleException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        assertEquals("Something went wrong on our end. Please try again.", response.getBody().getMessage());
    }
}