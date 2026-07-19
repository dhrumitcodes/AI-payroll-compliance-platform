import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";

function PayrollPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    const fetchPayrollSlips = () => {
        setLoading(true);
        setError(null);
        fetch("http://localhost:8080/api/payroll/slips/employee/1")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to pull payroll ledger records");
                return response.json();
            })
            .then((res) => {
                if (res.success && res.data && res.data.length > 0) {
                    setRecords(res.data);
                } else {
                    // Fallback empty data layout state
                    setRecords([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("API Fetch Error:", err);
                setRecords([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPayrollSlips();
    }, []);

    const handleGenerateMockPayroll = () => {
        setGenerating(true);

        setTimeout(() => {
            const mockPaySlip = {
                id: Date.now(),
                employeeId: 1,
                employeeName: "Dhruv",
                payPeriod: "2026-07",
                grossPay: 90000.00,
                totalDeductions: 5000.00,
                netPay: 85000.00,
                processedAt: new Date().toISOString()
            };

            setRecords((prev) => [mockPaySlip, ...prev]);
            setGenerating(false);
        }, 800);
    };

    return (
        <Layout>
            <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                Payroll Management
            </h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                        Payroll Ledger
                    </h2>
                    <button
                        onClick={handleGenerateMockPayroll}
                        disabled={generating}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                        {generating ? "Processing..." : "Generate Payroll"}
                    </button>
                </div>

                {loading && (
                    <div className="text-center py-6 text-slate-500">Loading payroll entries...</div>
                )}

                {!loading && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">Employee</th>
                                <th>Pay Period</th>
                                <th>Gross Pay</th>
                                <th>Total Deductions</th>
                                <th>Net Salary</th>
                                <th>Processed Date</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm text-slate-600 dark:text-slate-300">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-400">
                                        No payroll ledger entries found for this employee.
                                    </td>
                                </tr>
                            ) : (
                                records.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 animate-fadeIn">
                                        <td className="py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">
                                            {slip.employeeName}
                                        </td>
                                        <td className="font-medium text-slate-500">{slip.payPeriod}</td>
                                        <td className="text-slate-600">${slip.grossPay?.toLocaleString()}</td>
                                        <td className="text-rose-500">-${slip.totalDeductions?.toLocaleString()}</td>
                                        <td className="text-emerald-600 font-bold">${slip.netPay?.toLocaleString()}</td>
                                        <td className="text-xs text-slate-400">
                                            {slip.processedAt ? new Date(slip.processedAt).toLocaleDateString() : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default PayrollPage;