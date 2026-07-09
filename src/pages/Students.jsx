import { useEffect, useState } from "react";
import { Users, Loader2, AlertCircle, GraduationCap, UserPlus, Pencil, Trash2, Search } from "lucide-react";
import api from "../services/api";
import AddStudentModal from "../components/students/AddStudentModal";

const val = (v) => (v !== null && v !== undefined && v !== "" ? v : "—");

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.name ?? "").toLowerCase().includes(q) ||
      (s.email ?? "").toLowerCase().includes(q)
    );
  });

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmed) return;
    try {
      await api.delete(`/students/${student.id}`);
      fetchStudents();
    } catch {
      alert("Failed to delete student");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading students…</p>
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Students</h1>
          <p className="text-sm text-slate-400 mt-1">
            Total Students:{" "}
            <span className="font-semibold text-slate-600">{students.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
            <Users size={15} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600">
              {students.length} {students.length === 1 ? "Student" : "Students"}
            </span>
          </div>

          {/* Add Student button */}
          <button
            onClick={() => { setEditingStudent(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <UserPlus size={14} strokeWidth={2.2} />
            Add Student
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
          placeholder="Search by name or email..."
          className="w-full sm:w-80 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 bg-white border border-slate-200 rounded-xl outline-none transition-all hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

        {students.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50">
              <GraduationCap size={26} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500">No students yet</p>
              <p className="text-xs text-slate-400 mt-1">Students will appear here once added.</p>
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
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">
                    CGPA
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={22} className="text-slate-300" />
                        <p className="text-sm font-semibold text-slate-500">No matching students found</p>
                        <p className="text-xs text-slate-400">Try a different name or email.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id ?? idx}
                    className="hover:bg-slate-50/60 transition-colors duration-100"
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                        {val(student.id)}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 select-none">
                          {student.name ? student.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span className="font-medium text-slate-700">
                          {val(student.name)}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-500">
                      {val(student.email)}
                    </td>

                    {/* CGPA */}
                    <td className="px-6 py-4">
                      {student.cgpa !== null && student.cgpa !== undefined ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            student.cgpa >= 8
                              ? "bg-emerald-50 text-emerald-700"
                              : student.cgpa >= 6
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {student.cgpa}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingStudent(student); setShowModal(true); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit student"
                        >
                          <Pencil size={15} strokeWidth={1.8} />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete student"
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
        {students.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-500">{filteredStudents.length}</span>
              {search && (
                <> of <span className="font-semibold text-slate-500">{students.length}</span></>
              )}{" "}
              {filteredStudents.length === 1 ? "record" : "records"}
            </p>
          </div>
        )}
      </div>
      {showModal && (
        <AddStudentModal
          onClose={() => { setShowModal(false); setEditingStudent(null); }}
          onSuccess={fetchStudents}
          student={editingStudent}
        />
      )}
    </div>
  );
}
