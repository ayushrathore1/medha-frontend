import React from "react";

const SubjectSelect = ({
  subjects = [],
  selected = "",
  onChange,
  label = "Choose Subject:",
  disabled = false,
  required = false,
}) => (
  <div className="flex flex-col gap-1 mb-3">
    <label className="text-blue-800 font-medium mb-1">{label}</label>
    <select
      className="border border-blue-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={selected}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      required={required}
    >
      <option value="">-- Select --</option>
      {subjects.map((subj, idx) => (
        <option
          key={subj._id || subj.name || idx}
          value={subj._id || subj.name}
        >
          {subj.name}
        </option>
      ))}
    </select>
  </div>
);

export default SubjectSelect;
