import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  GraduationCap,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Students", to: "/students", icon: Users },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
  { label: "Applications", to: "/applications", icon: ClipboardList },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:z-auto lg:shadow-none
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200">
            <GraduationCap className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">PlaceIQ</p>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              Placement Portal
            </p>
          </div>
        </div>

        {/* Mobile close */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Main Menu
        </p>

        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-[inset_3px_0_0_0] shadow-indigo-500"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Admin User</p>
            <p className="text-[10px] text-slate-400 truncate">admin@college.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
