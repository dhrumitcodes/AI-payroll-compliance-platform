# AI Payroll & Compliance Platform

An enterprise-grade payroll, statutory compliance, and workforce management platform built using Java Spring Boot.

## 🚀 Vision

To build a production-ready SaaS platform for payroll outsourcing firms that automates payroll processing, compliance management, employee workflows, and AI-powered business insights.

## 🛠️ Tech Stack

### Backend
- **Java 21** & **Spring Boot 3.x**
- **Spring Security** (Role-Based Access Control)
- **Spring Data JPA** & **Hibernate**

### Database
- **PostgreSQL**

### Frontend (Planned)
- **React** + **TypeScript**
- **Tailwind CSS**

### Infrastructure & AI
- **Docker** & **Docker Compose**
- **Gemini / OpenAI API** (AI Compliance Assistant)

---

## 📌 Project Status & Current Progress

🚧 **Under Active Development**

The core backend evaluation architecture is up and running. The **Statutory Compliance Engine** successfully calculates monthly tax/PF liabilities, compares them to actual configured employee profiles, and generates AI-driven risk mitigation alerts.

### 🤖 Verified Endpoint: AI Compliance & Statutory Tax Evaluation

- **Endpoint:** `/api/v1/payroll/evaluate-compliance` *(Update if route changes)*
- **Method:** `POST`
- **Description:** Evaluates an employee's deduction profile against calculated statutory liabilities (`monthlyStatutoryPFEstimate` + `monthlyStatutoryTaxEstimate`).

#### Sample Response (Non-Compliant Risk Flagged)
```json
{
  "success": true,
  "message": "AI Compliance and Statutory Tax evaluation completed",
  "data": {
    "employeeId": 4,
    "employeeName": "Aryan Thakur",
    "projectedAnnualGross": 1200000.00,
    "monthlyStatutoryPFEstimate": 10200.00,
    "monthlyStatutoryTaxEstimate": 20000.00,
    "totalExpectedDeductions": 30200.00,
    "actualConfiguredDeductions": 7500.00,
    "complianceStatus": "NON_COMPLIANT",
    "aiRiskAssessment": "Warning: The employee's monthly deduction profile falls short of expected statutory liabilities (PF + estimated income tax). Check for tax withholding variances."
  }
}
