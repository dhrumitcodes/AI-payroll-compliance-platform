import React, { useState } from "react";
import { X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AddCompany({ onClose, onCreated }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        registrationNumber: "",
        email: "",
    });

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
                onCreated();
            })
            .catch((err) => {
                console.error("Create Company Error:", err);
                setError(err.message || "Something went wrong. Please try again.");
                setSubmitting(false);
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
            <div className="bg-surface dark:bg-surface-dark rounded-card w-full max-w-md p-6 border border-border dark:border-border-dark">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Add new company</h3>
                    <button
                        onClick={onClose}
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
                            onClick={onClose}
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
    );
}