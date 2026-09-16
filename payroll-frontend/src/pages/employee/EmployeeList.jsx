import React from "react";
import { Trash2 } from "lucide-react";

export default function EmployeeList({ employees, canManageEmployees, onDelete }) {
    return (
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
                    <th className="px-2">Department</th>
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
                            <td className="px-2 text-xs text-muted dark:text-muted-dark">{emp.departmentName || "—"}</td>
                            <td className="px-2 text-xs text-muted dark:text-muted-dark">{emp.hireDate}</td>
                            {canManageEmployees && (
                                <td className="px-2 text-right">
                                    <button
                                        onClick={() => onDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
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
    );
}