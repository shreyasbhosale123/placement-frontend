
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login", { replace: true });
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">

                {/* Navbar and Logout */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <Navbar onMenuClick={() => setSidebarOpen(true)} />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="m-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}
