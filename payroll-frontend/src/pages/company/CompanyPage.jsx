import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function CompanyPage() {
    const userRole = localStorage.getItem("userRole");
    const canManageCompanies = userRole === "PAYROLL_ADMIN";

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        registrationNumber: "",
        email: "",
    });

    const fetchCompanies = () => {
        setLoading(true);
        setLoadError(null);
        const token = localStorage.getItem("token");

        fetch(`${API_BASE}/api/companies`, {
            headers: {
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load companies from the server");
                return res.json();
            })
            .then((res) => {
                const list = res.data ? res.data : res;
                setCompanies(Array.isArray(list) ? list : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                // No fake fallback data — a real failure should look like a
                // failure, not a hardcoded company that quietly masks it.
                setLoadError(err.message || "Could not reach the backend.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const token = localStorage.getItem("token");

        fetch(`${API_BASE}/api/companies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(formData),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.message || "Failed to create company");
                }
                return res.json();
            })
            .then(() => {
                setSubmitting(false);
                setIsModalOpen(false);
                setFormData({ name: "", registrationNumber: "", email: "" });
                fetchCompanies(); // re-pull the real list — never trust an echoed local object as truth
            })
            .catch((err) => {
                console.error("Create Company Error:", err);
                // A real rejection (duplicate name/registration number, bad
                // email, etc.) now actually shows up — it no longer gets
                // added to the list anyway.
                setError(err.message || "Something went wrong. Please try again.");
                setSubmitting(false);
            });
    };

    const handleDelete = (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const token = localStorage.getItem("token");

        fetch(`${API_BASE}/api/companies/${id}`, {
            method: "DELETE",
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete company");
                fetchCompanies();
            })
            .catch((err) => {
                console.error("Delete Error:", err);
                setLoadError(err.message);
            });
    };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark">
                        Company management
                    </h1>
                    <p className="text-sm text-muted dark:text-muted-dark mt-1">
                        Register and oversee corporate entities in your payroll directory.
                    </p>
                </div>

                {canManageCompanies && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2.5 rounded-control text-sm transition-colors"
                    >
                        + Add company
                    </button>
                )}
            </div>

            {!canManageCompanies && (
                <div className="mb-4 p-3 bg-warning-soft text-warning text-sm rounded-control">
                    Your role ({userRole || "unknown"}) has read-only access to company records.
                </div>
            )}

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6">
                <h2 className="text-sm font-semibold text-ink dark:text-ink-dark mb-4">
                    Registered companies
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-border dark:border-border-dark text-muted dark:text-muted-dark text-xs font-semibold uppercase tracking-wide">
                            <th className="py-3 px-2">Name</th>
                            <th className="py-3 px-2">Registration no.</th>
                            <th className="py-3 px-2">Email</th>
                            <th className="py-3 px-2">Employees</th>
                            {canManageCompanies && <th className="py-3 px-2 text-right">Actions</th>}
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-border dark:divide-border-dark text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={canManageCompanies ? 5 : 4} className="py-8 text-center text-muted dark:text-muted-dark">
                                    Loading companies…
                                </td>
                            </tr>
                        ) : loadError ? (
                            <tr>
                                <td colSpan={canManageCompanies ? 5 : 4} className="py-8 text-center text-danger text-sm">
                                    {loadError} — check that the backend is running.
                                </td>
                            </tr>
                        ) : companies.length === 0 ? (
                            <tr>
                                <td colSpan={canManageCompanies ? 5 : 4} className="py-8 text-center text-muted dark:text-muted-dark">
                                    No companies found. Click "+ Add company" to create one.
                                </td>
                            </tr>
                        ) : (
                            companies.map((comp) => (
                                <tr key={comp.id} className="hover:bg-canvas dark:hover:bg-canvas-dark transition-colors">
                                    <td className="py-4 px-2 font-medium text-ink dark:text-ink-dark">{comp.name}</td>
                                    <td className="py-4 px-2 font-mono text-xs text-accent">{comp.registrationNumber || "N/A"}</td>
                                    <td className="py-4 px-2 text-muted dark:text-muted-dark">{comp.email || "—"}</td>
                                    <td className="py-4 px-2">
                                            <span className="px-2.5 py-1 rounded-control text-xs font-semibold bg-accent-soft dark:bg-accent-soft-dark text-accent">
                                                {comp.totalEmployees ?? 0}
                                            </span>
                                    </td>
                                    {canManageCompanies && (
                                        <td className="py-4 px-2 text-right">
                                            <button
                                                onClick={() => handleDelete(comp.id, comp.name)}
                                                className="text-muted dark:text-muted-dark hover:text-danger transition-colors"
                                                title="Delete company"
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
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
                    <div className="bg-surface dark:bg-surface-dark rounded-card w-full max-w-md p-6 border border-border dark:border-border-dark">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Add new company</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-danger-soft text-danger text-sm rounded-control">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">
                                    Company name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Acme Corp"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">
                                    GSTIN (Registration number)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 27AAPFU0939F1ZV"
                                    maxLength={15}
                                    value={formData.registrationNumber}
                                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                                    className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent font-mono"
                                />
                                <p className="text-[11px] text-muted dark:text-muted-dark mt-1">
                                    Must be a valid 15-character GSTIN — placeholders like "N/A" are no longer accepted.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted dark:text-muted-dark mb-1.5">
                                    Corporate email
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. contact@acme.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-control text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
                                />
                            </div>

                            <p className="text-xs text-muted dark:text-muted-dark">
                                Employee count is calculated automatically from real employee records — it's not entered manually.
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-control border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:bg-canvas dark:hover:bg-canvas-dark text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-control bg-accent hover:bg-accent-hover text-white text-sm font-medium disabled:opacity-50"
                                >
                                    {submitting ? "Saving…" : "Save company"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompanyPage;
