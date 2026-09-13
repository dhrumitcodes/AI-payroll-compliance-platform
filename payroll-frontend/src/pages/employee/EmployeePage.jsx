import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, X, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function EmployeesPage() {
    const userRole = localStorage.getItem("userRole");
    const canManageEmployees = userRole === "ROLE_COMPANY_ADMIN" || userRole === "ROLE_SUPER_ADMIN";

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        panNumber: "",
        aadhaarNumber: "",
        hireDate: new Date().toISOString().split("T")[0],
        companyId: 1,
        departmentId: 1,
    });

    const fetchEmployees = () => {
        setLoading(true);
        setLoadError(null);
        fetch(`${API_BASE}/api/employees/company/1`, { headers: { ...authHeaders() } })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load employee directory");
                return res.json();
            })
            .then((res) => {
                if (res.success && res.data) {
                    const list = res.data.content ? res.data.content : res.data;
                    setEmployees(Array.isArray(list) ? list : []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                setLoadError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccessMsg("");

        try {
            const response = await fetch(`${API_BASE}/api/employees`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders() },
                body: JSON.stringify({
                    ...formData,
                    companyId: Number(formData.companyId),
                    departmentId: Number(formData.departmentId),
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to register employee record.");
            }

            setSuccessMsg("Employee registered successfully.");
            setShowModal(false);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                position: "",
                panNumber: "",
                aadhaarNumber: "",
                hireDate: new Date().toISOString().split("T")[0],
                companyId: 1,
                departmentId: 1,
            });
            fetchEmployees();
        } catch (err) {
            console.error("Submission Error:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id, fullName) => {
        if (!window.confirm(`Delete "${fullName}"? This cannot be undone.`)) return;

        fetch(`${API_BASE}/api/employees/${id}`, {
            method: "DELETE",
            headers: { ...authHeaders() },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete employee");
                fetchEmployees();
            })
            .catch((err) => {
                console.error("Delete Error:", err);
                setLoadError(err.message);
            });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark">
                        Employee directory
                    </h1>
                    <p className="text-sm text-muted dark:text-muted-dark mt-1">
                        Manage workplace personnel and onboarding profiles.
                    </p>
                </div>
                {canManageEmployees && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2.5 rounded-control text-sm transition-colors"
                    >
                        + Add employee
                    </button>
                )}
            </div>

            {!canManageEmployees && (
                <div className="mb-4 p-3 bg-warning-soft text-warning text-sm rounded-control">
                    Your role ({userRole || "unknown"}) has read-only access to the employee directory.
                </div>
            )}

            {successMsg && (
                <div className="mb-4 p-3 bg-success-soft text-success rounded-control text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {successMsg}
                </div>
            )}

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                {loading ? (
                    <div className="text-center py-10 text-muted dark:text-muted-dark text-sm">
                        Loading directory…
                    </div>
                ) : loadError ? (
                    <div className="text-center py-10 text-danger text-sm">
                        {loadError} — check that the backend is running.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-border dark:border-border-dark text-muted dark:text-muted-dark text-xs font-semibold uppercase tracking-wide">
                                <th className="py-3 px-2">ID</th>
                                <th className="px-2">Name</th>
                                <th className="px-2">Email</th>
                                <th className="px-2">PAN</th>
                                <th className="px-2">Aadhaar</th>
                                <th className="px-2">Position</th>
                                <th className="px-2">Hire date</th>
                                {canManageEmployees && <th className="px-2 text-right">Actions</th>}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border dark:divide-border-dark text-sm">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan={canManageEmployees ? 8 : 7} className="text-center py-10 text-muted dark:text-muted-dark">
                                        No employee records found. Click "+ Add employee" to create one.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-canvas dark:hover:bg-canvas-dark transition-colors">
                                        <td className="py-4 px-2 font-mono text-xs text-muted dark:text-muted-dark">#{emp.id}</td>
                                        <td className="px-2 font-medium text-ink dark:text-ink-dark">
                                            {emp.firstName} {emp.lastName}
                                        </td>
                                        <td className="px-2 text-muted dark:text-muted-dark">{emp.email}</td>
                                        <td className="px-2 font-mono text-xs text-muted dark:text-muted-dark">{emp.panNumber || "—"}</td>
                                        <td className="px-2 font-mono text-xs text-muted dark:text-muted-dark">{emp.aadhaarNumber || "—"}</td>
                                        <td className="px-2">
                                                <span className="bg-accent-soft dark:bg-accent-soft-dark text-accent px-2.5 py-1 rounded-control text-xs font-medium">
                                                    {emp.position}
                                                </span>
                                        </td>
                                        <td className="px-2 text-xs text-muted dark:text-muted-dark">{emp.hireDate}</td>
                                        {canManageEmployees && (
                                            <td className="px-2 text-right">
                                                <button
                                                    onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                                    className="text-muted dark:text-muted-dark hover:text-danger transition-colors"
                                                    title="Delete employee"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-ink/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-surface dark:bg-surface-dark rounded-card w-full max-w-lg p-6 border border-border dark:border-border-dark">
                        <div className="flex justify-between items-start mb-1">
                            <h2 className="text-lg font-semibold text-ink dark:text-ink-dark">
                                New employee registration
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-muted dark:text-muted-dark mb-5">
                            PAN and Aadhaar are checked against existing records — duplicates on either are rejected.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-danger-soft text-danger rounded-control text-sm flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">First name</label>
                                    <input
                                        type="text" name="firstName" required
                                        value={formData.firstName} onChange={handleChange}
                                        placeholder="e.g. John"
                                        className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">Last name</label>
                                    <input
                                        type="text" name="lastName" required
                                        value={formData.lastName} onChange={handleChange}
                                        placeholder="e.g. Doe"
                                        className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">Email address</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    placeholder="john.doe@techcorp.com"
                                    className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">PAN number</label>
                                    <input
                                        type="text" name="panNumber" required
                                        value={formData.panNumber}
                                        onChange={(e) => setFormData((p) => ({ ...p, panNumber: e.target.value.toUpperCase() }))}
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                        className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">Aadhaar number</label>
                                    <input
                                        type="text" name="aadhaarNumber" required
                                        value={formData.aadhaarNumber}
                                        onChange={(e) => setFormData((p) => ({ ...p, aadhaarNumber: e.target.value.replace(/\D/g, "") }))}
                                        placeholder="123456789012"
                                        maxLength={12}
                                        className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">Position / title</label>
                                <input
                                    type="text" name="position" required
                                    value={formData.position} onChange={handleChange}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">Hire date</label>
                                <input
                                    type="date" name="hireDate" required
                                    value={formData.hireDate} onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-border dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 text-ink dark:text-ink-dark hover:bg-canvas dark:hover:bg-canvas-dark rounded-control font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-control font-medium text-sm transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "Saving…" : "Save employee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeesPage;