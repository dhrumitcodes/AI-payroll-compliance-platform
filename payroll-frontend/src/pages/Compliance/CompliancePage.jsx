import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function CompliancePage() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [auditData, setAuditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_BASE}/api/employees/company/1`, {
            headers: {
                "Accept": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load employee roster");
                return res.json();
            })
            .then((res) => {
                if (res.success && res.data) {
                    const list = res.data.content ? res.data.content : res.data;
                    setEmployees(Array.isArray(list) ? list : []);
                    if (list.length > 0) {
                        setSelectedEmployeeId(list[0].id);
                    }
                }
                setFetchingEmployees(false);
            })
            .catch((err) => {
                console.error("Error fetching employees:", err);
                setFetchingEmployees(false);
            });
    }, []);

    const handleRunAudit = () => {
        if (!selectedEmployeeId) return;

        setLoading(true);
        setError(null);
        setAuditData(null);

        const token = localStorage.getItem("token");

        fetch(`${API_BASE}/api/compliance/evaluate/employee/${selectedEmployeeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `Server returned HTTP status ${res.status}`);
                }
                return data;
            })
            .then((res) => {
                if (res.success && res.data) {
                    setAuditData(res.data);
                } else {
                    setAuditData(res.data || res);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Audit API Error:", err);
                setError(err.message || "Failed to fetch evaluation details.");
                setLoading(false);
            });
    };

    const isCompliant = auditData?.complianceStatus === "COMPLIANT";

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    AI Statutory Compliance Engine
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Automated tax compliance audits, document completeness verification, and payroll policy flags.
                </p>
            </div>

            {/* Employee Audit Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 mb-8 transition-colors">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Run Compliance Evaluation
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                            Select Employee Profile
                        </label>
                        {fetchingEmployees ? (
                            <div className="text-sm text-slate-400">Loading directory...</div>
                        ) : (
                            <select
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {employees.length === 0 ? (
                                    <option value="">No employees available</option>
                                ) : (
                                    employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            #{emp.id} - {emp.firstName} {emp.lastName} ({emp.position})
                                        </option>
                                    ))
                                )}
                            </select>
                        )}
                    </div>

                    <button
                        onClick={handleRunAudit}
                        disabled={loading || !selectedEmployeeId}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span>Analyzing Rules...</span>
                        ) : (
                            <span>⚡ Evaluate Compliance</span>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded-xl text-sm font-medium">
                    ⚠️ {error}
                </div>
            )}

            {auditData && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                                Compliance Status
                            </span>
                            <div className="mt-2 flex items-center gap-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                    isCompliant
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                                        : "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300"
                                }`}>
                                    {isCompliant ? "✓ COMPLIANT" : "⚠️ NON COMPLIANT"}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                                Policy Risk Score
                            </span>
                            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                                {isCompliant ? "0.0" : "7.5"}
                                <span className="text-xs font-normal text-slate-400 ml-1">
                                    {isCompliant ? "/ Low Risk" : "/ Action Required"}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                                Last Evaluated
                            </span>
                            <div className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                {new Date().toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {auditData.aiRiskAssessment && (
                        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 text-amber-800 dark:text-amber-300 text-sm font-medium flex items-start gap-3">
                            <span className="text-lg">💡</span>
                            <div>
                                <strong className="font-semibold block mb-0.5">AI Audit Insight</strong>
                                <span>{auditData.aiRiskAssessment}</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                            Statutory Check Summary
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                            <pre>{JSON.stringify(auditData, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default CompliancePage;