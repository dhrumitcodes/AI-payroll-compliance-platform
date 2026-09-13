import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    IndianRupee,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    TrendingUp,
    CreditCard,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function useGreeting() {
    return useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }, []);
}

function toTitleCase(str) {
    return str
        .split(/[.\s_-]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

export default function DashboardPage() {
    const greeting = useGreeting();
    const userEmail = localStorage.getItem("userEmail") || "";
    const rawName = userEmail ? userEmail.split("@")[0] : "";
    const firstName = rawName ? toTitleCase(rawName) : "there";

    const [totalEmployees, setTotalEmployees] = useState(null);
    const [summaryError, setSummaryError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE}/api/dashboard/summary`, {
            headers: {
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load dashboard summary");
                return res.json();
            })
            .then((res) => {
                if (res.success && res.data) {
                    setTotalEmployees(res.data.totalEmployees);
                }
            })
            .catch((err) => {
                console.error("Dashboard summary error:", err);
                setSummaryError(true);
            });
    }, []);

    const stats = {
        monthlyPayroll: 142500,
        complianceRating: "98.5%",
        pendingActions: 3,
    };

    const payrollTrends = [
        { month: "Jan", amount: 110000 },
        { month: "Feb", amount: 115000 },
        { month: "Mar", amount: 125000 },
        { month: "Apr", amount: 130000 },
        { month: "May", amount: 138000 },
        { month: "Jun", amount: 142500 },
    ];

    const chart = useMemo(() => {
        const w = 560, h = 160, pad = 8;
        const max = Math.max(...payrollTrends.map((d) => d.amount));
        const min = Math.min(...payrollTrends.map((d) => d.amount));
        const stepX = (w - pad * 2) / (payrollTrends.length - 1);
        const points = payrollTrends.map((d, i) => {
            const x = pad + i * stepX;
            const y = h - pad - ((d.amount - min) / (max - min || 1)) * (h - pad * 2);
            return [x, y];
        });
        const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
        const areaPath = `${linePath} L ${points[points.length - 1][0]} ${h} L ${points[0][0]} ${h} Z`;
        return { w, h, linePath, areaPath, points };
    }, []);

    const metrics = [
        {
            label: "Total employees",
            value: summaryError ? "—" : totalEmployees === null ? "…" : totalEmployees,
            icon: Users,
            tone: "neutral",
        },
        { label: "Monthly payroll", value: `₹${stats.monthlyPayroll.toLocaleString()}`, icon: IndianRupee, tone: "neutral" },
        { label: "Compliance score", value: stats.complianceRating, icon: ShieldCheck, tone: "success" },
        { label: "Pending flags", value: `${stats.pendingActions} items`, icon: AlertTriangle, tone: "warning" },
    ];

    const toneClasses = {
        neutral: "bg-canvas dark:bg-canvas-dark text-ink dark:text-ink-dark",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
    };

    const quickLinks = [
        { label: "Employees", href: "/employee", icon: Users },
        { label: "Payroll", href: "/payroll", icon: CreditCard },
        { label: "Compliance", href: "/compliance", icon: ShieldCheck },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark">
                    {greeting}{firstName !== "there" ? `, ${firstName}` : ""}
                </h1>
                <p className="text-muted dark:text-muted-dark text-sm mt-1">
                    Here's what's happening across payroll and compliance today.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(({ label, value, icon: Icon, tone }) => (
                    <div
                        key={label}
                        className="bg-surface dark:bg-surface-dark p-5 rounded-card border border-border dark:border-border-dark flex items-center gap-4"
                    >
                        <div className={`p-2.5 rounded-control ${toneClasses[tone]}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted dark:text-muted-dark">{label}</p>
                            <h3 className="text-xl font-semibold text-ink dark:text-ink-dark mt-0.5">{value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-surface dark:bg-surface-dark p-6 rounded-card border border-border dark:border-border-dark">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">Payroll volume</h3>
                            <p className="text-xs text-muted dark:text-muted-dark">Last 6 months</p>
                        </div>
                        <span className="inline-flex items-center text-xs font-medium text-success bg-success-soft px-2 py-1 rounded-control gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +8.4% YoY
                        </span>
                    </div>

                    <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="w-full h-40" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d={chart.areaPath} fill="url(#areaFill)" stroke="none" />
                        <path d={chart.linePath} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
                        {chart.points.map(([x, y], i) => (
                            <circle key={i} cx={x} cy={y} r="2.5" fill="var(--color-accent)" />
                        ))}
                    </svg>
                    <div className="flex justify-between mt-1 px-1">
                        {payrollTrends.map((d) => (
                            <span key={d.month} className="text-xs text-muted dark:text-muted-dark">{d.month}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-surface dark:bg-surface-dark p-6 rounded-card border border-border dark:border-border-dark flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-ink dark:text-ink-dark mb-4">
                            System alerts & audits
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-semibold text-ink dark:text-ink-dark">Statutory tax calculation</h4>
                                    <p className="text-[11px] text-muted dark:text-muted-dark">All employee brackets verified for Q2.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-semibold text-ink dark:text-ink-dark">Missing tax exemption file</h4>
                                    <p className="text-[11px] text-muted dark:text-muted-dark">1 employee requires document upload.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/compliance"
                        className="mt-6 w-full py-2.5 bg-ink dark:bg-accent hover:opacity-90 text-white rounded-control text-xs font-medium transition-opacity flex items-center justify-center gap-1.5"
                    >
                        Run diagnostics <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickLinks.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={label}
                        to={href}
                        className="bg-surface dark:bg-surface-dark p-4 rounded-card border border-border dark:border-border-dark flex items-center justify-between hover:border-accent/40 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-muted dark:text-muted-dark" />
                            <span className="text-sm font-medium text-ink dark:text-ink-dark">{label}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted dark:text-muted-dark" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
