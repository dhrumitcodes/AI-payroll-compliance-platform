package com.payroll.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CompanyRequestDTO {

    @NotBlank(message = "Company name cannot be empty")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Registration Number cannot be empty")
    @Pattern(regexp = "^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}Z[A-Z\\d]{1}$", message = "Must be a valid 15-character GSTIN (e.g. 27AAPFU0939F1ZV)")
    private String registrationNumber;

    @NotBlank(message = "Corporate email cannot be empty")
    @Email(message = "Must be a valid email address")
    private String email;

    public CompanyRequestDTO() {
    }

    public CompanyRequestDTO(String name, String registrationNumber, String email) {
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
}