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
      setTimeout(() => setSuccessMsg(""), 1700);
    } catch (err) {
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
      setTimeout(() => setSuccessMsg(""), 1300);
    } catch (err) {
      setErrorMsg("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-10 flex flex-col items-center font-inter relative overflow-hidden">
      {/* Glassy blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-10 left-1/4 w-96 h-60 bg-gradient-to-tr from-violet-400/20 to-blue-400/12 rounded-full blur-2xl opacity-24 animate-blob"></div>
        <div className="absolute bottom-5 right-1/3 w-72 h-44 bg-gradient-to-r from-blue-400/16 to-purple-400/12 rounded-full blur-2xl opacity-18 animate-blob animation-delay-2000"></div>
        <style>{`
          @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.08) translate(20px,-17px);} 66% {transform: scale(0.95) translate(-13px,12px);} 100% {transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 14s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
      <div className="max-w-2xl w-full z-10">
        <div className="bg-[#18163a]/90 border border-violet-400/15 rounded-3xl shadow-2xl p-10 mt-12">
          <h1 className="text-4xl font-extrabold text-center mb-7 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Subjects
          </h1>
          <p className="text-lg text-violet-300 text-center mb-10">
            Manage all your subjects here. Add new subjects, or select one to
            see its details.
          </p>
          <form className="flex gap-4 mb-6" onSubmit={handleAddSubject}>
            <input
              type="text"
              className="border border-violet-400/20 rounded-xl px-4 py-3 w-full bg-[#18163a]/80 text-white placeholder-violet-400 font-medium focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition text-lg shadow"
              placeholder="Add new subject (e.g., DSA, DBMS, Networking)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-7 py-3 rounded-xl font-bold shadow-xl hover:scale-[1.05] transition focus:outline-none focus:ring-2 focus:ring-violet-400"
              type="submit"
            >
              Add
            </button>
          </form>
          {errorMsg && (
            <div className="bg-gradient-to-r from-red-700/40 to-pink-400/15 font-bold text-red-300 px-5 py-2 mb-3 rounded-xl shadow text-center animate-pulse">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-gradient-to-r from-emerald-700/15 to-blue-400/10 font-bold text-emerald-400 px-5 py-2 mb-3 rounded-xl shadow text-center animate-jump">
              {successMsg}
            </div>
          )}
          <div className="mb-8 mt-8">
            <SubjectSelect
              subjects={subjects}
              selected={selected}
              onChange={setSelected}
              label="Select a subject"
            />
          </div>
          <div className="bg-gradient-to-r from-violet-400/10 to-blue-400/10 border border-violet-400/15 rounded-2xl p-7 shadow-inner">
            <h2 className="text-2xl text-blue-200 font-bold mb-3">
              All Subjects:
            </h2>
            <ul className="list-disc pl-8 text-white text-lg">
              {subjects.length === 0 && (
                <li className="text-violet-300">No subjects yet.</li>
              )}
              {subjects.map((subj) => (
                <li
                  key={subj._id}
                  className="flex items-center justify-between pr-2 font-medium mt-1"
                >
                  <span
                    className={
                      selected === subj.name
                        ? "font-bold text-blue-200 underline underline-offset-4"
                        : "text-white"
                    }
                  >
                    {subj.name}
                  </span>
                  <button
                    className="ml-5 bg-gradient-to-r from-red-600 to-pink-500 text-white font-bold px-4 py-1.5 rounded-lg shadow-sm hover:scale-[1.07] hover:bg-red-600 transition"
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
      <style>{`
        @keyframes animate-jump { 0% { transform: scale(.9);} 60% { transform: scale(1.12);} 100% { transform: scale(1);} }
        .animate-jump { animation: animate-jump .35s cubic-bezier(.33,1.5,.7,1) both;}
      `}</style>
    </div>
  );
};

export default Subjects;
