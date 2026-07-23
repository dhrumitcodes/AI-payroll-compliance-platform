import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/layout/ProtectedRoute";
import Layout from "../components/layout/Layout";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CompanyPage from "../pages/company/CompanyPage";
import EmployeePage from "../pages/employee/EmployeePage";
import CompliancePage from "../pages/Compliance/CompliancePage";
import PayrollPage from "../pages/payroll/PayrollPage";
import SettingsPage from "../pages/settings-page/SettingsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public / Auth Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Dashboard App Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/company" element={<CompanyPage />} />
                        <Route path="/employee" element={<EmployeePage />} />
                        <Route path="/compliance" element={<CompliancePage />} />
                        <Route path="/payroll" element={<PayrollPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                </Route>

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}