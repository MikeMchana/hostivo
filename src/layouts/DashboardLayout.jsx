import { useState } from "react";
import {
  Menu,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="lg:ml-72 min-h-screen">

        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">

          {/* Mobile Menu */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Open dashboard menu"
          >
            <Menu
              size={24}
              className="text-[#102A43]"
            />
          </button>

          {/* Desktop Title */}
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Hostivo Management
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5 ml-auto">

            {/* Notifications */}
            <button
              className="relative p-2 rounded-full hover:bg-slate-100 transition"
              aria-label="Notifications"
            >
              <Bell
                size={21}
                className="text-slate-600"
              />

              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C89B3C] rounded-full" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-[#102A43]">
                  {user?.username || "Admin"}
                </p>

                <p className="text-xs text-slate-500">
                  {user?.role || "Administrator"}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#102A43] text-white flex items-center justify-center">
                <UserCircle size={22} />
              </div>

            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600 transition"
              aria-label="Log out"
            >
              <LogOut size={18} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;