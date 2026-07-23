import React from "react";

function DepartmentPage() {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                Department Management
            </h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                        Departments
                    </h2>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                        + Add Department
                    </button>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold uppercase">
                        <th className="py-3">Department</th>
                        <th>Manager</th>
                        <th>Employees</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200 text-sm">
                    <tr>
                        <td className="py-4 font-semibold">IT</td>
                        <td>John</td>
                        <td>32</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DepartmentPage;