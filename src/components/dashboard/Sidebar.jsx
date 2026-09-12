import {
  LayoutDashboard,
  CalendarDays,
  DoorOpen,
  UtensilsCrossed,
  Package,
  Users,
  UserCog,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const mainNavigation = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Reservations",
    path: "/dashboard/reservations",
    icon: CalendarDays,
  },
  {
    name: "Rooms",
    path: "/dashboard/rooms",
    icon: DoorOpen,
  },
];

const restaurantNavigation = [
  {
    name: "Menu",
    path: "/dashboard/menu",
  },
  {
    name: "Tables",
    path: "/dashboard/tables",
  },
  {
    name: "Orders",
    path: "/dashboard/orders",
  },
  {
    name: "Kitchen",
    path: "/dashboard/kitchen",
  },
];

const managementNavigation = [
  {
    name: "Inventory",
    path: "/dashboard/inventory",
    icon: Package,
  },
  {
    name: "Customers",
    path: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Employees",
    path: "/dashboard/employees",
    icon: UserCog,
  },
  {
    name: "Expenses",
    path: "/dashboard/expenses",
    icon: Receipt,
  },
  {
    name: "Payments",
    path: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    name: "Reports",
    path: "/dashboard/reports",
    icon: BarChart3,
  },
];

function Sidebar({ isOpen, onClose }) {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-[#C89B3C] text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#102A43] text-white flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/10">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="text-2xl font-bold tracking-wide"
          >
            Hostivo
          </NavLink>

          <span className="ml-3 text-xs uppercase tracking-wider text-white/40">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          {/* Main */}
          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  end={item.path === "/dashboard"}
                  className={linkClasses}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Restaurant */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-4 mb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed
                  size={16}
                  className="text-[#C89B3C]"
                />

                <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">
                  Restaurant
                </span>
              </div>

              <ChevronDown
                size={15}
                className="text-white/30"
              />
            </div>

            <div className="space-y-1">
              {restaurantNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block pl-11 pr-4 py-2.5 rounded-xl text-sm transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Management */}
          <div className="mt-8">
            <p className="px-4 mb-3 text-xs uppercase tracking-wider text-white/40 font-semibold">
              Management
            </p>

            <div className="space-y-1">
              {managementNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={linkClasses}
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-white/10">
          <NavLink
            to="/dashboard/settings"
            onClick={onClose}
            className={linkClasses}
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;