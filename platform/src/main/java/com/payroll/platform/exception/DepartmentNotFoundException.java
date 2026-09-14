package com.payroll.platform.exception;

public class DepartmentNotFoundException extends ResourceNotFoundException {
    public DepartmentNotFoundException(String message) {
        super(message);
    }
}