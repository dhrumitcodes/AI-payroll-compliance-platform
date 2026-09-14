package com.payroll.platform.service.impl;

import com.payroll.platform.dto.AiInsightsResponseDTO;
import com.payroll.platform.exception.ResourceNotFoundException;
import com.payroll.platform.model.Company;
import com.payroll.platform.model.Employee;
import com.payroll.platform.model.SalaryStructure;
import com.payroll.platform.model.User;
import com.payroll.platform.repository.CompanyRepository;
import com.payroll.platform.repository.EmployeeRepository;
import com.payroll.platform.repository.SalaryStructureRepository;
import com.payroll.platform.repository.UserRepository;
import com.payroll.platform.service.AiInsightsService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AiInsightsServiceImpl implements AiInsightsService {

    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.model}")
    private String geminiModel;

    public AiInsightsServiceImpl(
            CompanyRepository companyRepository,
            EmployeeRepository employeeRepository,
            SalaryStructureRepository salaryStructureRepository,
            UserRepository userRepository
    ) {
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
    }

    @Override
    public AiInsightsResponseDTO generateCompanyInsights(Long companyId) {

        ensureCompanyAccess(companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Company not found with ID: " + companyId));

        Page<Employee> employeePage =
                employeeRepository.findByCompanyId(companyId, Pageable.unpaged());
        List<Employee> employees = employeePage.getContent();

        String dataSummary = buildDataSummary(company, employees);
        String prompt = buildPrompt(dataSummary);

        List<String> insights = callGemini(prompt);

        return new AiInsightsResponseDTO(
                company.getId(),
                company.getName(),
                insights,
                LocalDateTime.now()
        );
    }

    private String buildDataSummary(Company company, List<Employee> employees) {

        int totalEmployees = employees.size();
        int missingPan = 0;
        int missingAadhaar = 0;
        int missingSalaryStructure = 0;
        BigDecimal totalBaseSalary = BigDecimal.ZERO;
        int employeesWithSalary = 0;
        int hiredLast30Days = 0;

        Map<String, Integer> departmentCounts = new HashMap<>();
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);

        for (Employee emp : employees) {

            if (emp.getPanNumber() == null || emp.getPanNumber().isBlank()) {
                missingPan++;
            }
            if (emp.getAadhaarNumber() == null || emp.getAadhaarNumber().isBlank()) {
                missingAadhaar++;
            }
            if (emp.getHireDate() != null && !emp.getHireDate().isBefore(thirtyDaysAgo)) {
                hiredLast30Days++;
            }

            String deptName = emp.getDepartment() != null
                    ? emp.getDepartment().getName()
                    : "Unassigned";
            departmentCounts.merge(deptName, 1, Integer::sum);

            Optional<SalaryStructure> salary =
                    salaryStructureRepository.findByEmployeeId(emp.getId());

            if (salary.isPresent()) {
                employeesWithSalary++;
                totalBaseSalary = totalBaseSalary.add(salary.get().getBaseSalary());
            } else {
                missingSalaryStructure++;
            }
        }

        BigDecimal averageBaseSalary = employeesWithSalary > 0
                ? totalBaseSalary.divide(BigDecimal.valueOf(employeesWithSalary), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        StringBuilder sb = new StringBuilder();
        sb.append("Company: ").append(company.getName()).append("\n");
        sb.append("Total employees: ").append(totalEmployees).append("\n");
        sb.append("Employees missing PAN number: ").append(missingPan).append("\n");
        sb.append("Employees missing Aadhaar number: ").append(missingAadhaar).append("\n");
        sb.append("Employees with no salary structure configured: ").append(missingSalaryStructure).append("\n");
        sb.append("Employees hired in the last 30 days: ").append(hiredLast30Days).append("\n");
        sb.append("Average base salary (of employees with a salary structure): ").append(averageBaseSalary).append("\n");
        sb.append("Department headcount breakdown:\n");

        for (Map.Entry<String, Integer> entry : departmentCounts.entrySet()) {
            sb.append("  - ").append(entry.getKey()).append(": ").append(entry.getValue()).append(" employees\n");
        }

        return sb.toString();
    }

    private String buildPrompt(String dataSummary) {
        return "You are a payroll compliance analyst reviewing real company data below.\n\n"
                + dataSummary
                + "\nBased ONLY on the data above, write 3 to 6 short, specific, actionable insights "
                + "or compliance risks. Each insight must be a single plain-text line starting with a dash (-). "
                + "Do not use markdown formatting, bold text, or headings. Do not invent numbers that are not "
                + "in the data above. If a metric indicates zero risk, you can skip mentioning it.";
    }

    @SuppressWarnings("unchecked")
    private List<String> callGemini(String prompt) {

        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new RuntimeException(
                    "Gemini API key is not configured. Set the GEMINI_API_KEY environment variable."
            );
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + geminiModel + ":generateContent?key=" + geminiApiKey;

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        Map<String, Object> response;

        try {
            ResponseEntity<Map> responseEntity =
                    restTemplate.postForEntity(url, requestEntity, Map.class);
            response = responseEntity.getBody();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to reach Gemini API: " + e.getMessage()
            );
        }

        if (response == null || !response.containsKey("candidates")) {
            throw new RuntimeException(
                    "Gemini API returned no candidates. Response: " + response
            );
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> firstCandidate = candidates.get(0);
        Map<String, Object> candidateContent = (Map<String, Object>) firstCandidate.get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
        String rawText = (String) parts.get(0).get("text");

        List<String> insights = new ArrayList<>();
        for (String line : rawText.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.startsWith("-")) {
                trimmed = trimmed.substring(1).trim();
            }
            if (!trimmed.isEmpty()) {
                insights.add(trimmed);
            }
        }

        return insights;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    private void ensureCompanyAccess(Long targetCompanyId) {

        User user = getCurrentUser();

        if ("ROLE_SUPER_ADMIN".equals(user.getRole())) {
            return;
        }

        if (user.getCompanyId() == null || !user.getCompanyId().equals(targetCompanyId)) {
            throw new AccessDeniedException("You do not have access to this company's data");
        }
    }
}