import { useState, useEffect, useRef } from "react";
import { X, Loader2, Pencil, AlertCircle, FilePlus } from "lucide-react";
import api from "../../services/api";
import { createApplication, updateApplication } from "../../services/applicationService";

const STATUSES = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

const INITIAL_FORM = { studentId: "", jobId: "", status: "Applied" };
const INITIAL_ERRORS = { studentId: "", jobId: "", status: "" };

function validate(form, isEdit) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!form.studentId) {
    errors.studentId = "Please select a student.";
    valid = false;
  }

  if (!form.jobId) {
    errors.jobId = "Please select a job.";
    valid = false;
  }

  if (isEdit && !form.status) {
    errors.status = "Please select a status.";
    valid = false;
  }

  return { errors, valid };
}

function Field({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-600 tracking-wide">
        {label} <span className="text-red-400">*</span>
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} strokeWidth={2.5} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function AddApplicationModal({ onClose, onSuccess, application }) {
  const isEdit = Boolean(application);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const firstSelectRef = useRef(null);

  /* Fetch students and jobs for dropdowns */
  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdowns(true);
      try {
        const [studentsRes, jobsRes] = await Promise.all([
          api.get("/students"),
          api.get("/jobs"),
        ]);
        setStudents(studentsRes.data);
        setJobs(jobsRes.data);
      } catch {
        setServerError("Failed to load students or jobs. Please close and try again.");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  /* Prefill form when editing */
  useEffect(() => {
    if (isEdit) {
      setForm({
        studentId: application.student?.id ? String(application.student.id) : "",
        jobId: application.job?.id ? String(application.job.id) : "",
        status: application.status ?? "Applied",
      });
    }
  }, [application]);

  /* Focus first field on open */
  useEffect(() => {
    if (!loadingDropdowns) firstSelectRef.current?.focus();
  }, [loadingDropdowns]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError(null);
  };

  const handleSubmit = async () => {
    const { errors: validationErrors, valid } = validate(form, isEdit);
    if (!valid) { setErrors(validationErrors); return; }

    setSubmitting(true);
    setServerError(null);
    try {
      if (isEdit) {
        await updateApplication(application.id, form.status);
      } else {
        const payload = {
          student: { id: Number(form.studentId) },
          job: { id: Number(form.jobId) },
        };
        await createApplication(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-700 bg-white
     outline-none transition-all duration-150 cursor-pointer
     focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
     ${errors[field] ? "border-red-300 bg-red-50/30" : "border-slate-200 hover:border-slate-300"}`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 animate-[fadeSlideUp_0.18s_ease-out]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50">
              {isEdit
                ? <Pencil size={18} className="text-indigo-600" strokeWidth={1.8} />
                : <FilePlus size={18} className="text-indigo-600" strokeWidth={1.8} />
              }
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-none">
                {isEdit ? "Edit Application" : "Add Application"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit ? "Update the application status" : "Fill in the details below"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 leading-relaxed">{serverError}</p>
            </div>
          )}

          {/* Dropdown loading skeleton */}
          {loadingDropdowns ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Student dropdown — hidden in edit mode */}
              {!isEdit && (
                <Field label="Student" id="studentId" error={errors.studentId}>
                  <select
                    ref={firstSelectRef}
                    id="studentId"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    disabled={submitting}
                    className={selectClass("studentId")}
                  >
                    <option value="">Select a student…</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.email}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Job dropdown — hidden in edit mode */}
              {!isEdit && (
                <Field label="Job" id="jobId" error={errors.jobId}>
                  <select
                    id="jobId"
                    name="jobId"
                    value={form.jobId}
                    onChange={handleChange}
                    disabled={submitting}
                    className={selectClass("jobId")}
                  >
                    <option value="">Select a job…</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} — {j.company}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Status dropdown — edit mode only */}
              {isEdit && (
                <Field label="Status" id="status" error={errors.status}>
                  <select
                    ref={firstSelectRef}
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={submitting}
                    className={selectClass("status")}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Read-only info banner in edit mode */}
              {isEdit && (
                <div className="flex flex-col gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Student</span>
                    <span className="text-slate-600 font-semibold">{application.student?.name ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Job</span>
                    <span className="text-slate-600 font-semibold">
                      {application.job?.title ?? "—"} — {application.job?.company ?? "—"}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loadingDropdowns}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              <>
                {isEdit ? <Pencil size={15} /> : <FilePlus size={15} />}
                {isEdit ? "Update Status" : "Add Application"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Keyframe — defined inline so no CSS file is needed */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
