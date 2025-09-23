import React, { useState } from "react";

const SubjectAddForm = ({ onAdd }) => {
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }
    onAdd(subject.trim());
    setSubject("");
    setError("");
  };

  return (
    <form className="flex gap-3 items-center mb-5" onSubmit={handleAdd}>
      <input
        className="border border-blue-200 rounded-lg px-3 py-2 w-64"
        type="text"
        placeholder="Add new subject (e.g., DSA, DBMS)"
        value={subject}
        onChange={e => setSubject(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold" type="submit">
        Add Subject
      </button>
      {error && <span className="ml-3 text-red-500 text-sm">{error}</span>}
    </form>
  );
};

export default SubjectAddForm;
