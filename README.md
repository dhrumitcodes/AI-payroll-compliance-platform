# 💼 AI-Powered Payroll Platform

A modern, full-stack payroll application built to streamline salary processing, user authentication, and employee management.

---

## 🌐 Live Deployments

* **Frontend App:** [https://ai-payroll.vercel.app](https://ai-payroll-compliance-platform.vercel.app/)
* **Backend API:** [https://ai-payroll-backend.onrender.com](https://ai-payroll-backend.onrender.com)
* **Database:** PostgreSQL (Cloud hosted on Neon.tech)

---

## 🚀 Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **Deployment:** Vercel

### **Backend**
* **Framework:** Java / Spring Boot
* **Security:** Spring Security & JWT Authentication
* **Data Access:** Spring Data JPA / Hibernate
* **Deployment:** Render

### **Database**
* **Engine:** PostgreSQL (Serverless Cloud DB on Neon)

---

## ✨ Features

* **Authentication & Authorization:** Secure user login and role-based access control (`/api/auth/login`).
* **Payroll Processing:** Automated salary calculations, structure management, and tracking.
* **Persistent Storage:** Cloud PostgreSQL integration ensuring zero data loss.
* **CORS & Web Security:** Configured cross-origin communication between Vercel and Render.
* **Health Endpoint:** Public `/api/auth/health` route for system status monitoring.

---

## 🛠️ Production Configuration

The backend relies on the following environment variables configured on Render:

| Variable | Description |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<neon-host>/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Neon DB Username |
| `SPRING_DATASOURCE_PASSWORD` | Neon DB Password |

---

## ⚡ Local Setup

### **1. Clone Repositories**
```bash
git clone [https://github.com/your-username/ai-payroll-backend.git](https://github.com/your-username/ai-payroll-backend.git)
git clone [https://github.com/your-username/ai-payroll-frontend.git](https://github.com/your-username/ai-payroll-frontend.git)
