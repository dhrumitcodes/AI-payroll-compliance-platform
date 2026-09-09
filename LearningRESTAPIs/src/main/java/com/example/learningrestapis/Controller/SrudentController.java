package com.example.learningrestapis.Controller;

import com.example.learningrestapis.DTO.StudentDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentController {

@GetMapping("/student")
    public StudentDto getStudent(){
    return new StudentDto(id:4L , name:"dhrumit" , email:"dc123@gmail.com");
  }

}

