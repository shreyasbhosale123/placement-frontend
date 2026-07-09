import { Menu, Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/jobs": "Jobs",
  "/applications": "Applications",
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "Overview";

  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-slate-100 shrink-0">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-slate-400">Portal</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{title}</span>
        </div>
      </div>

      {/* Right: search + notification + avatar */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-600 transition-all">
          <Search size={15} />
          <span className="hidden md:inline text-xs">Search…</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold select-none cursor-pointer">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
