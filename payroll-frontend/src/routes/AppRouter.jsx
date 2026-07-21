import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import CompanyPage from "../pages/company/CompanyPage.jsx";
import DepartmentPage from "../pages/department/DepartmentPage.jsx";
import EmployeePage from "../pages/employee/EmployeePage.jsx";
import PayrollPage from "../pages/payroll/PayrollPage.jsx";
import CompliancePage from "../pages/Compliance/CompliancePage.jsx";

const SettingsPage = () => (
    <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <p className="text-slate-500 mt-1">Database Row-Level Tenant Isolation: Active</p>
    </div>
);


function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/department" element={<DepartmentPage />} />
                <Route path="/employee" element={<EmployeePage />} />
                <Route path="/payroll" element={<PayrollPage />} />
                <Route path="/compliance" element={<CompliancePage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;