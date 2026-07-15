import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Building2, Users, CreditCard, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Layout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode, toggleTheme } = useTheme();

    const navigation = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Company', icon: Building2, href: '/company' },
        { name: 'Employees', icon: Users, href: '/employee' },
        { name: 'Payroll', icon: CreditCard, href: '/payroll' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">

            {/* Mobile Top Bar */}
            <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 dark:bg-slate-950 dark:border-slate-900">
                <span className="text-xl font-black text-indigo-600 tracking-tight dark:text-indigo-400">QuantumPay</span>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg">
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-200 transform p-4 flex flex-col justify-between
        md:relative md:transform-none transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                <div className="space-y-6">
                    <div className="px-3 py-2 flex items-center justify-between">
                        <span className="text-2xl font-black text-white tracking-tight">QuantumPay</span>
                        <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded font-mono">v1.0</span>
                    </div>

                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <item.icon className="h-5 w-5 stroke-[2]" />
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                    {/* Theme Mode Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-400 hover:bg-white/5 transition-all"
                    >
                        {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
                        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>

                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}