import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    ShieldCheck,
    Server,
    CheckCircle2,
    XCircle,
    Sun,
    Moon,
    LogOut,
    Info,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const roleLabels = {
    ROLE_SUPER_ADMIN: "Super Admin",
    ROLE_COMPANY_ADMIN: "Company Admin",
    ROLE_AUDITOR: "Auditor",
    ROLE_EMPLOYEE: "Employee",
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useTheme();

    const userEmail = localStorage.getItem("userEmail") || "Unknown";
    const userRole = localStorage.getItem("userRole") || "Unknown";
    const companyId = localStorage.getItem("companyId");

    const [healthStatus, setHealthStatus] = useState("checking");

    useEffect(() => {
        fetch(`${API_BASE}/api/auth/health`)
            .then((res) => {
                if (!res.ok) throw new Error("Health check failed");
                return res.text();
            })
            .then(() => setHealthStatus("online"))
            .catch(() => setHealthStatus("offline"));
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark">Settings</h1>
                <p className="text-sm text-muted dark:text-muted-dark mt-1">
                    Your account, appearance, and system status.
                </p>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">Account</h3>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                        <dt className="text-xs text-muted dark:text-muted-dark mb-1">Email</dt>
                        <dd className="text-ink dark:text-ink-dark font-medium">{userEmail}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-muted dark:text-muted-dark mb-1">Role</dt>
                        <dd className="text-ink dark:text-ink-dark font-medium">
                            {roleLabels[userRole] || userRole}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs text-muted dark:text-muted-dark mb-1">Company ID</dt>
                        <dd className="text-ink dark:text-ink-dark font-medium">
                            {companyId && companyId !== "0" ? `#${companyId}` : "Platform-wide (Super Admin)"}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    {darkMode ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
                    <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">Appearance</h3>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted dark:text-muted-dark">
                        Currently using {darkMode ? "dark" : "light"} mode.
                    </p>
                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2 rounded-control border border-border dark:border-border-dark text-sm font-medium text-ink dark:text-ink-dark hover:bg-canvas dark:hover:bg-canvas-dark transition-colors"
                    >
                        Switch to {darkMode ? "light" : "dark"} mode
                    </button>
                </div>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Server className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">Backend status</h3>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    {healthStatus === "checking" && (
                        <span className="text-muted dark:text-muted-dark">Checking connection…</span>
                    )}
                    {healthStatus === "online" && (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span className="text-ink dark:text-ink-dark">Spring Boot API reachable and responding</span>
                        </>
                    )}
                    {healthStatus === "offline" && (
                        <>
                            <XCircle className="w-4 h-4 text-danger" />
                            <span className="text-ink dark:text-ink-dark">Backend unreachable — check API status</span>
                        </>
                    )}
                </div>
                <p className="text-[11px] text-muted dark:text-muted-dark mt-2">
                    This checks a real endpoint (<code className="font-mono">GET /api/auth/health</code>) — it isn't a static indicator.
                </p>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">How access control works here</h3>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted dark:text-muted-dark">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>
                        Every request carries a signed JWT identifying your role and company. Multi-tenant
                        separation is enforced in the application layer — each service checks that the company
                        you're requesting data for matches your own account's company (or that you're a Super
                        Admin) before returning anything. This is Spring Security method-level authorization
                        plus explicit checks in each service, not database-level row security.
                    </p>
                </div>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-control bg-danger-soft text-danger hover:opacity-90 text-sm font-medium transition-opacity"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </div>
    );
}