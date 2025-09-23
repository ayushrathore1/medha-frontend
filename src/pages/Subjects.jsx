import React, { useState, useEffect } from "react";
import SubjectSelect from "../components/Subject/SubjectSelect";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selected, setSelected] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const token = localStorage.getItem("token");

  // Fetch subjects on mount
  useEffect(() => {
    async function fetchSubjects() {
      setErrorMsg("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.message || "Failed to fetch subjects.");
          return;
        }
        setSubjects(data.subjects);
      } catch (err) {
        console.error(err);
        setErrorMsg("Server error.");
      }
    }
    fetchSubjects();
  }, [token]);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    const value = newSubject.trim();
    if (!value) {
      setErrorMsg("Enter a subject name.");
      return;
    }
    if (subjects.some((s) => s.name === value)) {
      setErrorMsg("Subject already exists.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: value }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Could not add subject.");
        return;
      }
      setSubjects((prev) => [...prev, data.subject]);
      setSuccessMsg(`Added "${data.subject.name}"`);
      setNewSubject("");
      setTimeout(() => setSuccessMsg(""), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error.");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects/${subjectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Could not delete subject.");
        return;
      }
      setSubjects(subjects.filter((subj) => subj._id !== subjectId));
      setSuccessMsg("Subject deleted!");
      setTimeout(() => setSuccessMsg(""), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20 pb-10 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-2xl p-10 mt-10">
          <h1 className="text-4xl font-bold text-blue-700 text-center mb-5">
            Subjects
          </h1>
          <p className="text-lg text-blue-900 text-center mb-8">
            Manage all your subjects here. Add new subjects, or select one to
            see its details.
          </p>
          <form className="flex gap-4 mb-5" onSubmit={handleAddSubject}>
            <input
              type="text"
              className="border border-blue-300 rounded-lg px-4 py-3 w-full text-blue-900 bg-blue-50/60 shadow-inner focus:outline-none focus:border-blue-400 text-lg transition"
              placeholder="Add new subject (e.g., Computer Networks)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition"
              type="submit"
            >
              Add
            </button>
          </form>
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 mb-3 rounded text-center font-semibold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 mb-3 rounded text-center font-semibold">
              {successMsg}
            </div>
          )}
          <div className="mb-8 mt-6">
            <SubjectSelect
              subjects={subjects.map((s) => s.name)}
              selected={selected}
              onChange={setSelected}
              label="Select a subject"
            />
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 shadow-inner">
            <h2 className="text-xl text-blue-800 font-bold mb-3">
              All Subjects:
            </h2>
            <ul className="list-disc pl-8 text-blue-900 text-lg">
              {subjects.length === 0 && <li>No subjects yet.</li>}
              {subjects.map((subj) => (
                <li
                  key={subj._id}
                  className="flex items-center justify-between pr-2"
                >
                  <span
                    className={
                      selected === subj.name
                        ? "font-bold text-blue-700 underline underline-offset-4"
                        : ""
                    }
                  >
                    {subj.name}
                  </span>
                  <button
                    className="ml-4 bg-red-500 text-white font-bold px-4 py-1 rounded transition hover:bg-red-600"
                    onClick={() => handleDeleteSubject(subj._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
