import React, { useState } from "react";
import { Users, DollarSign, ShieldCheck, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
    const [stats] = useState({
        totalEmployees: 128,
        payrollStatus: "Active",
        complianceRating: "98.5%",
        monthlyPayroll: "$142,500",
        pendingActions: 3
    });

    const payrollTrends = [
        { month: "Jan", amount: 110000 },
        { month: "Feb", amount: 115000 },
        { month: "Mar", amount: 125000 },
        { month: "Apr", amount: 130000 },
        { month: "May", amount: 138000 },
        { month: "Jun", amount: 142500 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Welcome back! Here is a real-time summary of your organization's payroll & compliance status.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Employees</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.totalEmployees}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Payroll</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stats.monthlyPayroll}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Score</p>
                        <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.complianceRating}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Flags</p>
                        <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{stats.pendingActions} Items</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payroll Growth & Disbursements</h3>
                            <p className="text-xs text-slate-400">Past 6 months payout trajectory</p>
                        </div>
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +8.4% YoY
                        </span>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-700">
                        {payrollTrends.map((item, idx) => {
                            const heightPercent = Math.round((item.amount / 150000) * 100);
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-t-lg relative flex items-end justify-center overflow-hidden h-36">
                                        <div
                                            style={{ height: `${heightPercent}%` }}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all duration-300"
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{item.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            System Alerts & Audits
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/40 flex items-start gap-3">
                                <span className="p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-xs font-bold">OK</span>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Statutory Tax Calculation</h4>
                                    <p className="text-[11px] text-slate-400">All employee brackets verified for Q2.</p>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/40 flex items-start gap-3">
                                <span className="p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-lg text-xs font-bold">WARN</span>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Missing Tax Exemption File</h4>
                                    <p className="text-[11px] text-slate-400">1 employee requires document upload.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1">
                        Run Diagnostics <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    );
}