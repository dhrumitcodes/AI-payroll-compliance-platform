import React from 'react';
import Layout from '../../components/layout/Layout.jsx';
import Card from '../../components/ui/Card.jsx';
import { Users, TrendingUp, DollarSign, Activity, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
    // Mock Data Matrix for Charts
    const sparklineData = [30, 45, 35, 60, 49, 70, 90];
    const barChartData = [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 85 },
        { month: 'Mar', value: 120 },
        { month: 'Apr', value: 95 },
        { month: 'May', value: 140 },
        { month: 'Jun', value: 165 },
    ];

    return (
        <Layout>
            <div className="space-y-8">

                {/* Header Block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                            System Overview
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Real-time breakdown of enterprise labor distributions.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Bar Component */}
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

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Headcount" value="1,248" change="+4.3%" subtext="vs last month" icon={Users} color="indigo" />
                    <StatCard title="Gross Payroll" value="$842,500" change="+12.1%" subtext="vs last quarter" icon={DollarSign} color="emerald" />
                    <StatCard title="Avg Efficiency" value="94.2%" change="-0.8%" subtext="system utilization" icon={Activity} color="amber" />
                    <StatCard title="Tax Deductions" value="$64,120" change="+2.4%" subtext="processed batches" icon={TrendingUp} color="sky" />
                </div>

                {/* Data Visualization Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Bar Chart inside Reusable Card */}
                    <Card className="p-6 lg:col-span-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 transition-colors">
                            Monthly Disbursement Volumetric
                        </h3>
                        <div className="h-64 flex items-end justify-between gap-2 pt-4">
                            {barChartData.map((bar, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-t-lg relative h-full flex items-end transition-colors">
                                        <div
                                            style={{ height: `${(bar.value / 165) * 100}%` }}
                                            className="w-full bg-indigo-500 group-hover:bg-indigo-600 dark:bg-indigo-600 dark:group-hover:bg-indigo-500 rounded-t-lg transition-all duration-500 relative cursor-pointer"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-md">
                                                ${bar.value}k
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{bar.month}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Sparkline Analytics inside Reusable Card */}
                    <Card className="p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                                Velocity Run-Rate
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Real-time engine compute cycles.</p>
                        </div>
                        <div className="py-4">
                            <svg viewBox="0 0 100 30" className="w-full h-24 overflow-visible">
                                <polyline
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={sparklineData.map((val, index) => `${(index * 100) / (sparklineData.length - 1)},${30 - (val / 100) * 30}`).join(' ')}
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-2 border-t border-slate-50 dark:border-slate-900 transition-colors">
                            <span>09:00 AM</span>
                            <span>Active Peak</span>
                            <span>05:00 PM</span>
                        </div>
                    </Card>
                </div>

                {/* Data Matrix Table Component */}
                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-900 transition-colors">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                            Recent Computational Transactions
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50/70 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-900 transition-colors">
                                <th className="px-6 py-3">Origin ID</th>
                                <th className="px-6 py-3">Target Node</th>
                                <th className="px-6 py-3">Delta Allocation</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors">
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">TXN-9021-X</td>
                                <td className="px-6 py-4 text-slate-900 dark:text-slate-200">Acme Payroll Clearing</td>
                                <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">+$12,450.00</td>
                                <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Settled
                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">TXN-4412-M</td>
                                <td className="px-6 py-4 text-slate-900 dark:text-slate-200">Global Tech Contractor Corp</td>
                                <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">+$8,120.50</td>
                                <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Settled
                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between transition-colors">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              Showing 1 to 2 of 24 records
            </span>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-30" disabled>
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50">
                                1
                            </button>
                            <button className="px-3 py-1 text-xs font-medium rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                                2
                            </button>
                            <button className="px-3 py-1 text-xs font-medium rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                                3
                            </button>
                            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
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

    const isPositive = change.startsWith('+');

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