package com.example.learningrestapis.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentDto {
    private long id;
    private long name;
    private long email;
