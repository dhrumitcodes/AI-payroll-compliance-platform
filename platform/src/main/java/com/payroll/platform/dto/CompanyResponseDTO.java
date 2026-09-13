package com.payroll.platform.dto;

public class CompanyResponseDTO {

    private Long id;
    private String name;
    private String registrationNumber;
    private String email;
    private int totalEmployees;

    public CompanyResponseDTO() {
    }

    public CompanyResponseDTO(Long id, String name, String registrationNumber, String email, int totalEmployees) {
        this.id = id;
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.email = email;
        this.totalEmployees = totalEmployees;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(int totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
