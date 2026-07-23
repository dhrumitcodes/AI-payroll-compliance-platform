import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Sun,
    Moon,
    ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Layout() {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const navigation = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Company", icon: Building2, href: "/company" },
        { name: "Employees", icon: Users, href: "/employee" },
        { name: "Payroll", icon: CreditCard, href: "/payroll" },
        { name: "AI Compliance", icon: ShieldCheck, href: "/compliance" },
        { name: "Settings", icon: Settings, href: "/settings" },
    ];

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.clear();
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">

            {/* Mobile Header */}
            <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    QuantumPay
                </span>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    {isOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed md:relative inset-y-0 left-0 z-50
                    w-64 bg-slate-950 text-white
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    flex flex-col justify-between
                `}
            >
                <div>
                    <div className="px-6 py-5 border-b border-slate-800">
                        <h1 className="text-2xl font-black">QuantumPay</h1>
                        <p className="text-xs text-slate-400 mt-1">v1.0</p>
                    </div>

                    <nav className="mt-5 px-3 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-slate-800 p-3 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        {darkMode ? (
                            <>
                                <Sun className="w-5 h-5 text-yellow-400" />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-5 h-5 text-indigo-400" />
                                <span>Dark Mode</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden p-6 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}