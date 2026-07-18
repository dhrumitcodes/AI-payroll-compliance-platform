package com.payroll.platform.service.impl;

import com.payroll.platform.dto.*;
import com.payroll.platform.model.*;
import com.payroll.platform.repository.*;
import com.payroll.platform.service.PayrollService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PayrollServiceImpl implements PayrollService {

    private final SalaryStructureRepository salaryRepository;
    private final PaySlipRepository paySlipRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollServiceImpl(SalaryStructureRepository salaryRepository, PaySlipRepository paySlipRepository, EmployeeRepository employeeRepository) {
        this.salaryRepository = salaryRepository;
        this.paySlipRepository = paySlipRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public SalaryResponseDTO setSalaryStructure(SalaryRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found with ID: " + dto.getEmployeeId()));

        SalaryStructure structure = salaryRepository.findByEmployeeId(dto.getEmployeeId())
                .orElse(new SalaryStructure());

        structure.setEmployee(employee);
        structure.setBaseSalary(dto.getBaseSalary());
        structure.setAllowances(dto.getAllowances());
        structure.setDeductions(dto.getDeductions());

        return mapToSalaryResponse(salaryRepository.save(structure));
    }

    @Override
    @Transactional(readOnly = true)
    public SalaryResponseDTO getSalaryStructureByEmployee(Long employeeId) {
        SalaryStructure structure = salaryRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Salary profile configuration missing for Employee ID: " + employeeId));
        return mapToSalaryResponse(structure);
    }

    @Override
    public PaySlipResponseDTO processMonthlyPayroll(ProcessPayrollRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found with ID: " + dto.getEmployeeId()));

        if (paySlipRepository.existsByEmployeeIdAndPayPeriod(dto.getEmployeeId(), dto.getPayPeriod())) {
            throw new IllegalArgumentException("Payroll cycle execution already locked for period: " + dto.getPayPeriod());
        }

        SalaryStructure salary = salaryRepository.findByEmployeeId(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Cannot process payroll. Salary structure not configured yet."));


        BigDecimal grossPay = salary.getBaseSalary().add(salary.getAllowances());
        BigDecimal netPay = grossPay.subtract(salary.getDeductions());

        if (netPay.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Payroll processing aborted: Net payment results in a negative balancing state.");
        }

        PaySlip paySlip = new PaySlip(employee, dto.getPayPeriod(), grossPay, salary.getDeductions(), netPay);
        return mapToPaySlipResponse(paySlipRepository.save(paySlip));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaySlipResponseDTO> getEmployeePaySlips(Long employeeId) {
        return paySlipRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToPaySlipResponse)
                .collect(Collectors.toList());
    }

    private SalaryResponseDTO mapToSalaryResponse(SalaryStructure s) {
        SalaryResponseDTO dto = new SalaryResponseDTO();
        dto.setId(s.getId());
        dto.setEmployeeId(s.getEmployee().getId());
        dto.setEmployeeName(s.getEmployee().getFirstName() + " " + s.getEmployee().getLastName());
        dto.setBaseSalary(s.getBaseSalary());
        dto.setAllowances(s.getAllowances());
        dto.setDeductions(s.getDeductions());
        return dto;
    }

    private PaySlipResponseDTO mapToPaySlipResponse(PaySlip p) {
        PaySlipResponseDTO dto = new PaySlipResponseDTO();
        dto.setId(p.getId());
        dto.setEmployeeId(p.getEmployee().getId());
        dto.setEmployeeName(p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName());
        dto.setPayPeriod(p.getPayPeriod());
        dto.setGrossPay(p.getGrossPay());
        dto.setTotalDeductions(p.getTotalDeductions());
        dto.setNetPay(p.getNetPay());
        dto.setProcessedAt(p.getProcessedAt());
        return dto;
    }
}