# ⚡ QuantumPay - Enterprise Payroll & AI Compliance Engine

**QuantumPay** is an enterprise-grade payroll management system built to automate tax compliance, statutory deductions, employee directory management, and workforce analytics. Powered by a Spring Boot REST API, PostgreSQL, and a modern React frontend.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
* **Backend:** Java 17, Spring Boot, Spring Security, JWT Authentication
* **Database:** PostgreSQL
* **DevOps & Infrastructure:** Docker, Docker Compose, Environment Variable Configuration

---

## ✨ Key Features

1. **AI Statutory Compliance Engine**
   * Real-time automated audit evaluations for tax and Provident Fund (PF) rules.
   * Dynamic risk scoring and statutory liability breakdowns.
   * Quick-fix auto-adjustment tools for non-compliant employee salary structures.

2. **Command Center Dashboard**
   * Workforce metrics, compliance coverage progress meters, and operational health feeds.
   * PostgreSQL database connection indicators and audit logging.

3. **Company & Employee Management**
   * Multi-company management with dynamic registration modal flows.
   * Employee roster integration and automated directory loading.

4. **Production-Ready Security & Config**
   * Bearer JWT token authentication headers on protected endpoints.
   * Strict `.env` environment variable isolation with zero hardcoded credentials.

---

## 🚀 Quick Start (Docker Compose)

Run the entire stack (PostgreSQL, Spring Boot Backend, React Frontend) in one command:

```bash
docker-compose up --build -d
