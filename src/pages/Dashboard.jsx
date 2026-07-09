import { useEffect, useState } from "react";
import { GraduationCap, Briefcase, FileText, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import api from "../services/api";

const STATS_CONFIG = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: GraduationCap,
    accent: "indigo",
    description: "Registered on portal",
  },
  {
    key: "totalJobs",
    label: "Total Jobs",
    icon: Briefcase,
    accent: "violet",
    description: "Active listings",
  },
  {
    key: "totalApplications",
    label: "Total Applications",
    icon: FileText,
    accent: "sky",
    description: "Submitted so far",
  },
];

const ACCENT_CLASSES = {
  indigo: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "hover:border-indigo-200",
    badge: "bg-indigo-50 text-indigo-600",
    glow: "group-hover:shadow-indigo-100",
  },
  violet: {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "hover:border-violet-200",
    badge: "bg-violet-50 text-violet-600",
    glow: "group-hover:shadow-violet-100",
  },
  sky: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    border: "hover:border-sky-200",
    badge: "bg-sky-50 text-sky-600",
    glow: "group-hover:shadow-sky-100",
  },
};

function StatCard({ label, description, icon: Icon, accent, value, loading }) {
  const cls = ACCENT_CLASSES[accent];

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition-all duration-200 ${cls.border} hover:shadow-lg ${cls.glow}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${cls.iconBg}`}>
          <Icon size={20} className={cls.iconColor} strokeWidth={1.8} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cls.badge}`}>
          <TrendingUp size={11} strokeWidth={2.5} />
          Live
        </span>
      </div>

      {/* Value */}
      <div className="mb-1">
        {loading ? (
          <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <p className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
            {value ?? "—"}
          </p>
        )}
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-slate-600 mt-2">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/dashboard");
        if (!cancelled) setData(response.data);
      } catch (err) {
        if (!cancelled)
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load dashboard data. Please try again."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  /* ── Full-page loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
        <Loader2 size={32} className="text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading dashboard…</p>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <div className="text-center max-w-sm">
          <p className="text-sm font-semibold text-slate-700 mb-1">Something went wrong</p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          A live snapshot of your placement portal activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STATS_CONFIG.map(({ key, label, description, icon, accent }) => (
          <StatCard
            key={key}
            label={label}
            description={description}
            icon={icon}
            accent={accent}
            value={data?.[key]}
            loading={false}
          />
        ))}
      </div>
    </div>
  );
}

