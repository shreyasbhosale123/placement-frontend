import { useEffect, useState } from "react";
import { Briefcase, BriefcaseBusiness, Loader2, AlertCircle, Pencil, Trash2, Search } from "lucide-react";
import api from "../services/api";
import AddJobModal from "../components/jobs/AddJobModal";

const val = (v) => (v !== null && v !== undefined && v !== "" ? v : "—");

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      (j.title ?? "").toLowerCase().includes(q) ||
      (j.company ?? "").toLowerCase().includes(q)
    );
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmed) return;
    try {
      await api.delete(`/jobs/${job.id}`);
      fetchJobs();
    } catch {
      alert("Failed to delete job");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading jobs…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <div className="text-center max-w-sm">
          <p className="text-sm font-semibold text-slate-700 mb-1">Something went wrong</p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ── Page ── */
  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Jobs</h1>
          <p className="text-sm text-slate-400 mt-1">
            Total Jobs:{" "}
            <span className="font-semibold text-slate-600">{jobs.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
            <Briefcase size={15} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600">
              {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
            </span>
          </div>

          {/* Add Job button */}
          <button
            onClick={() => { setSelectedJob(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <BriefcaseBusiness size={14} strokeWidth={2.2} />
            Add Job
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or company..."
          className="w-full sm:w-80 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 bg-white border border-slate-200 rounded-xl outline-none transition-all hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

        {jobs.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50">
              <Briefcase size={26} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500">No jobs yet</p>
              <p className="text-xs text-slate-400 mt-1">Jobs will appear here once added.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-36">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={22} className="text-slate-300" />
                        <p className="text-sm font-semibold text-slate-500">No matching jobs found</p>
                        <p className="text-xs text-slate-400">Try a different title or company.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredJobs.map((job, idx) => (
                  <tr
                    key={job.id ?? idx}
                    className="hover:bg-slate-50/60 transition-colors duration-100"
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                        {val(job.id)}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 select-none">
                          {job.title ? job.title.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span className="font-medium text-slate-700">
                          {val(job.title)}
                        </span>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4 text-slate-500">
                      {val(job.company)}
                    </td>

                    {/* Salary */}
                    <td className="px-6 py-4">
                      {job.salary !== null && job.salary !== undefined ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          ₹{Number(job.salary).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedJob(job); setShowModal(true); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit job"
                        >
                          <Pencil size={15} strokeWidth={1.8} />
                        </button>
                        <button
                          onClick={() => handleDelete(job)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete job"
                        >
                          <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {jobs.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-500">{filteredJobs.length}</span>
              {search && (
                <> of <span className="font-semibold text-slate-500">{jobs.length}</span></>
              )}{" "}
              {filteredJobs.length === 1 ? "record" : "records"}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <AddJobModal
          onClose={() => {
            setShowModal(false);
            setSelectedJob(null);
          }}
          onSuccess={fetchJobs}
          job={selectedJob}
        />
      )}
    </div>
  );
}
