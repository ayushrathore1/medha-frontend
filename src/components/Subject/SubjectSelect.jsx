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
        </option>
      ))}
    </select>
  </div>
);

export default SubjectSelect;
