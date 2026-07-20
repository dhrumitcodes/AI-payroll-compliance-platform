import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";

function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        hireDate: new Date().toISOString().split("T")[0],
        companyId: 1,
        departmentId: 1
    });

    const fetchEmployees = () => {
        setLoading(true);
        fetch("http://localhost:8080/api/employees/company/1")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load employee directory");
                return res.json();
            })
            .then((res) => {
                if (res.success && res.data) {
                    // Handles both paginated Page object or direct array
                    const list = res.data.content ? res.data.content : res.data;
                    setEmployees(Array.isArray(list) ? list : []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccessMsg("");

        try {
            const response = await fetch("http://localhost:8080/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    companyId: Number(formData.companyId),
                    departmentId: Number(formData.departmentId)
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to register employee record.");
            }

            setSuccessMsg("Employee registered successfully!");
            setShowModal(false);

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                position: "",
                hireDate: new Date().toISOString().split("T")[0],
                companyId: 1,
                departmentId: 1
            });

            fetchEmployees();

        } catch (err) {
            console.error("Submission Error:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Employee Directory
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage workplace personnel and onboarding profiles.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    + Add Employee
                </button>
            </div>

            {successMsg && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    ✅ {successMsg}
                </div>
            )}


            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading directory...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Hire Date</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm text-slate-600 dark:text-slate-300">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">
                                        No employee records found. Click '+ Add Employee' to create one!
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                        <td className="py-4 px-4 font-mono text-xs text-slate-400">#{emp.id}</td>
                                        <td className="font-semibold text-slate-900 dark:text-slate-100">
                                            {emp.firstName} {emp.lastName}
                                        </td>
                                        <td>{emp.email}</td>
                                        <td>
                                                <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs font-medium">
                                                    {emp.position}
                                                </span>
                                        </td>
                                        <td className="text-slate-500">{emp.hireDate}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            New Employee Registration
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">Enter candidate details to publish record into payroll database.</p>

                        {error && (
                            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="e.g. John"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g. Doe"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john.doe@techcorp.com"
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Position / Title</label>
                                <input
                                    type="text"
                                    name="position"
                                    required
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Hire Date</label>
                                <input
                                    type="date"
                                    name="hireDate"
                                    required
                                    value={formData.hireDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:bg-blue-400"
                                >
                                    {submitting ? "Saving..." : "Save Employee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default EmployeesPage;