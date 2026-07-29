import { useEffect, useState } from "react";
import { ClipboardList, FilePlus, Loader2, AlertCircle, Pencil, Trash2, Search } from "lucide-react";
import { getApplications, deleteApplication } from "../services/applicationService";
import AddApplicationModal from "../components/applications/AddApplicationModal";

const val = (v) => (v !== null && v !== undefined && v !== "" ? v : "—");

const STATUS_STYLES = {
  Applied: "bg-blue-50 text-blue-600",
  Shortlisted: "bg-amber-50 text-amber-600",
  Interview: "bg-purple-50 text-purple-600",
  Selected: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-600",
};

const statusClass = (status) =>
  STATUS_STYLES[status] ?? "bg-slate-100 text-slate-500";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const filteredApplications = applications.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.student?.name ?? "").toLowerCase().includes(q) ||
      (a.job?.title ?? "").toLowerCase().includes(q) ||
      (a.job?.company ?? "").toLowerCase().includes(q)
    );
  });

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplications();
      setApplications(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (application) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;
    try {
      await deleteApplication(application.id);
      fetchApplications();
    } catch {
      alert("Failed to delete application");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading applications…</p>
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Applications</h1>
          <p className="text-sm text-slate-400 mt-1">
            Total Applications:{" "}
            <span className="font-semibold text-slate-600">{applications.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
            <ClipboardList size={15} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600">
              {applications.length} {applications.length === 1 ? "Application" : "Applications"}
            </span>
          </div>

          {/* Add Application button */}
          <button
            onClick={() => { setSelectedApplication(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <FilePlus size={14} strokeWidth={2.2} />
            Add Application
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
          placeholder="Search by student, job title or company..."
          className="w-full sm:w-80 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 bg-white border border-slate-200 rounded-xl outline-none transition-all hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

        {applications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50">
              <ClipboardList size={26} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500">No applications yet</p>
              <p className="text-xs text-slate-400 mt-1">Applications will appear here once added.</p>
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
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-36">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={22} className="text-slate-300" />
                        <p className="text-sm font-semibold text-slate-500">No matching applications found</p>
                        <p className="text-xs text-slate-400">Try a different student, title or company.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredApplications.map((application, idx) => (
                  <tr
                    key={application.id ?? idx}
                    className="hover:bg-slate-50/60 transition-colors duration-100"
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                        {val(application.id)}
                      </span>
                    </td>

                    {/* Student */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 select-none">
                          {application.student?.name
                            ? application.student.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <span className="font-medium text-slate-700">
                          {val(application.student?.name)}
                        </span>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {val(application.job?.title)}
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4 text-slate-500">
                      {val(application.job?.company)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {application.status ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(application.status)}`}>
                          {application.status}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {application.appliedDate
                        ? new Date(application.appliedDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedApplication(application); setShowModal(true); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit application"
                        >
                          <Pencil size={15} strokeWidth={1.8} />
                        </button>
                        <button
                          onClick={() => handleDelete(application)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete application"
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
        {applications.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-500">{filteredApplications.length}</span>
              {search && (
                <> of <span className="font-semibold text-slate-500">{applications.length}</span></>
              )}{" "}
              {filteredApplications.length === 1 ? "record" : "records"}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <AddApplicationModal
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
          onSuccess={fetchApplications}
          application={selectedApplication}
        />
      )}
    </div>
  );
}
