import { useState, useEffect, useRef } from "react";
import { X, Loader2, Pencil, AlertCircle, BriefcaseBusiness } from "lucide-react";
import api from "../../services/api";

const INITIAL_FORM = { title: "", company: "", salary: "" };
const INITIAL_ERRORS = { title: "", company: "", salary: "" };

function validate(form) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!form.title.trim()) {
    errors.title = "Title is required.";
    valid = false;
  }

  if (!form.company.trim()) {
    errors.company = "Company is required.";
    valid = false;
  }

  const salary = parseFloat(form.salary);
  if (form.salary === "" || form.salary === null) {
    errors.salary = "Salary is required.";
    valid = false;
  } else if (isNaN(salary) || salary <= 0) {
    errors.salary = "Salary must be greater than 0.";
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

export default function AddJobModal({ onClose, onSuccess, job }) {
  const isEdit = Boolean(job);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const firstInputRef = useRef(null);

  /* Prefill form when editing */
  useEffect(() => {
    if (isEdit) {
      setForm({
        title: job.title ?? "",
        company: job.company ?? "",
        salary: job.salary !== null && job.salary !== undefined ? String(job.salary) : "",
      });
    }
  }, [job]);

  /* Focus first field on open */
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

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
    const { errors: validationErrors, valid } = validate(form);
    if (!valid) { setErrors(validationErrors); return; }

    setSubmitting(true);
    setServerError(null);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        salary: parseFloat(form.salary),
      };

      if (isEdit) {
        await api.put(`/jobs/${job.id}`, payload);
      } else {
        await api.post("/jobs", payload);
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

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-300 bg-white
     outline-none transition-all duration-150
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
                : <BriefcaseBusiness size={18} className="text-indigo-600" strokeWidth={1.8} />
              }
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-none">
                {isEdit ? "Edit Job" : "Add Job"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit ? "Update the job details" : "Fill in the details below"}
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

          <Field label="Title" id="title" error={errors.title}>
            <input
              ref={firstInputRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              disabled={submitting}
              className={inputClass("title")}
            />
          </Field>

          <Field label="Company" id="company" error={errors.company}>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              disabled={submitting}
              className={inputClass("company")}
            />
          </Field>

          <Field label="Salary (₹)" id="salary" error={errors.salary}>
            <input
              id="salary"
              name="salary"
              type="number"
              min="1"
              step="1000"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 700000"
              disabled={submitting}
              className={inputClass("salary")}
            />
          </Field>
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
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              <>
                {isEdit
                  ? <Pencil size={15} />
                  : <BriefcaseBusiness size={15} />
                }
                {isEdit ? "Update Job" : "Add Job"}
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
