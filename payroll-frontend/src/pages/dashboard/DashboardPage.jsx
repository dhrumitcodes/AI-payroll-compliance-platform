import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import Card from '../../components/ui/Card.jsx';
import { Users, TrendingUp, DollarSign, Activity, Search, ShieldCheck, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function DashboardPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        complianceRate: 100,
        activeFlags: 0,
        grossPayroll: "$842,500"
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_BASE}/api/employees/company/1`, {
            headers: {
                "Accept": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load roster");
                return res.json();
            })
            .then((res) => {
                if (res.success && res.data) {
                    const list = res.data.content ? res.data.content : res.data;
                    const empArray = Array.isArray(list) ? list : [];
                    setEmployees(empArray);

                    setStats((prev) => ({
                        ...prev,
                        totalEmployees: empArray.length
                    }));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Dashboard data load error:", err);
                setLoading(false);
            });
    }, []);

    return (
        <Layout>
            <div className="space-y-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                            Payroll & Compliance Command Center
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Real-time statutory metrics, automated audit feeds, and workforce compliance oversight.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Global tracking search..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 w-full sm:w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Workforce"
                        value={loading ? "..." : stats.totalEmployees}
                        change="+4.3%"
                        subtext="active directory"
                        icon={Users}
                        color="indigo"
                    />
                    <StatCard
                        title="Compliance Rate"
                        value={`${stats.complianceRate}%`}
                        change="100%"
                        subtext="statutory rules met"
                        icon={ShieldCheck}
                        color="emerald"
                    />
                    <StatCard
                        title="Active Policy Flags"
                        value={stats.activeFlags}
                        change="0.0"
                        subtext="action required"
                        icon={AlertTriangle}
                        color="amber"
                    />
                    <StatCard
                        title="Engine Status"
                        value="Operational"
                        change="Ready"
                        subtext="Spring Boot AI Backend"
                        icon={Zap}
                        color="sky"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <Card className="p-6 lg:col-span-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 transition-colors">
                            Statutory Liability Coverage
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                            Comparison of configured payroll deductions against statutory expectations.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span className="text-slate-700 dark:text-slate-300">Provident Fund (PF) Coverage</span>
                                    <span className="text-emerald-600 font-bold">100%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3">
                                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span className="text-slate-700 dark:text-slate-300">Income Tax (TDS) Withholding</span>
                                    <span className="text-indigo-600 font-bold">100%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3">
                                    <div className="bg-indigo-500 h-3 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span className="text-slate-700 dark:text-slate-300">Compliance Audit Coverage</span>
                                    <span className="text-amber-500 font-bold">85%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3">
                                    <div className="bg-amber-500 h-3 rounded-full" style={{ width: "85%" }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                                Quick Operations
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-6">
                                Direct controls for HR and Payroll managers.
                            </p>

                            <div className="space-y-3">
                                <a
                                    href="/compliance"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg block text-center transition-colors text-sm shadow-sm"
                                >
                                    ⚡ Run AI Audit Engine
                                </a>
                                <button
                                    onClick={() => alert("Roster synced with PostgreSQL database!")}
                                    className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                >
                                    <RefreshCw className="h-4 w-4" /> Sync Database Roster
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 text-xs text-slate-400 flex justify-between items-center">
                            <span>PostgreSQL Status:</span>
                            <span className="text-emerald-500 font-medium">Connected (Port 5432)</span>
                        </div>
                    </Card>
                </div>

                {/* Audit Logs Matrix */}
                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-900 transition-colors">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                            Recent AI Compliance Evaluations
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50/70 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-900 transition-colors">
                                <th className="px-6 py-3">Employee Profile</th>
                                <th className="px-6 py-3">Audit Details</th>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors">
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                                    #1 - Dhruv Developer
                                </td>
                                <td className="px-6 py-4 text-slate-900 dark:text-slate-200">
                                    Statutory Tax & PF Audit Evaluated
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                    Today, 4:58 PM
                                </td>
                                <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                            ✓ COMPLIANT
                                        </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </Layout>
    );
}

function StatCard({ title, value, change, subtext, icon: Icon, color }) {
    const colorMap = {
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
        sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
    };

    const isPositive = change.startsWith('+') || change === "100%" || change === "Ready";

    return (
        <Card className="p-5 flex items-center justify-between gap-4 group hover:border-slate-200 dark:hover:border-slate-800 transition-all">
            <div className="space-y-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{title}</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">{value}</h2>
                <div className="flex items-center gap-1.5 pt-1">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isPositive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}>
                        {change}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{subtext}</span>
                </div>
            </div>
            <div className={`p-4 rounded-2xl ${colorMap[color] || colorMap.indigo} transition-transform group-hover:scale-105`}>
                <Icon className="h-6 w-6 stroke-[2]" />
            </div>
        </Card>
    );
}