import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBuilding,
    FaUsers,
    FaMoneyCheckAlt,
    FaCog,
    FaSitemap,
} from "react-icons/fa";

const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Company", path: "/company", icon: <FaBuilding /> },
    { name: "Department", path: "/department", icon: <FaSitemap /> },
    { name: "Employee", path: "/employee", icon: <FaUsers /> },
    { name: "Payroll", path: "/payroll", icon: <FaMoneyCheckAlt /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
];

function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen shadow-lg">

            <div className="text-center py-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-blue-400">
                    Payroll
                </h1>
                <p className="text-sm text-slate-400">
                    Management System
                </p>
            </div>

            <nav className="mt-6">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-4 transition duration-300 ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-800 text-slate-300"
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.name}
                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}

export default Sidebar;