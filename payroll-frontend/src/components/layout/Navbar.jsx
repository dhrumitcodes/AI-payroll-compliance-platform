import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
    return (
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">

            <div>
                <h2 className="text-2xl font-bold text-slate-700">
                    AI Payroll Platform
                </h2>
            </div>

            <div className="flex items-center gap-6">

                <FaBell
                    className="text-2xl text-slate-600 cursor-pointer"
                />

                <div className="flex items-center gap-2">

                    <FaUserCircle className="text-3xl text-blue-600" />

                    <div>

                        <p className="font-semibold">
                            Admin
                        </p>

                        <p className="text-sm text-gray-500">
                            Administrator
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Navbar;