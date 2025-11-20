import React from "react";

const SubjectSelect = ({
  subjects = [],
  selected = "",
  onChange,
  label = "Choose Subject:",
  disabled = false,
  required = false,
}) => (
  <div className="flex flex-col gap-2 mb-3">
    <label className="text-[var(--text-primary)] font-bold mb-1 text-sm uppercase tracking-wider opacity-80">
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 text-[var(--text-primary)] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)] transition shadow-sm appearance-none cursor-pointer"
        value={selected}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        <option className="text-gray-500" value="">
          -- Select --
        </option>
        {subjects.map((subj, idx) => (
          <option
            key={subj._id || subj.name || idx}
            value={subj._id || subj.name}
            className="text-gray-800"
          >
            {subj.name}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </div>
  </div>
);

export default SubjectSelect;
