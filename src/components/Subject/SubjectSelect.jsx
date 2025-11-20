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
<<<<<<< HEAD
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
=======
    <label className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-bold mb-1">
      {label}
    </label>
    <select
      className="border border-violet-400/30 rounded-xl px-4 py-3 text-white bg-[#18163a]/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition shadow placeholder-violet-400 font-medium"
      value={selected}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      required={required}
    >
      <option className="text-violet-300" value="">
        -- Select --
      </option>
      {subjects.map((subj, idx) => (
        <option
          key={subj._id || subj.name || idx}
          value={subj._id || subj.name}
          className="text-white bg-[#18163a]/90"
        >
          {subj.name}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
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
