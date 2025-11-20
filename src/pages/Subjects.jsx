import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, BookOpen } from "lucide-react";
import SubjectSelect from "../components/Subject/SubjectSelect";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selected, setSelected] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
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
<<<<<<< HEAD
      } catch {
=======
      } catch (err) {
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        setErrorMsg("Server error.");
      } finally {
        setLoading(false);
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
<<<<<<< HEAD
    } catch {
=======
    } catch (err) {
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
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
<<<<<<< HEAD
    } catch {
=======
    } catch (err) {
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
      setErrorMsg("Server error.");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
<<<<<<< HEAD
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center relative overflow-hidden px-4">
      <div className="max-w-2xl w-full z-10">
        <Card className="p-8 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--action-primary)]/10 text-[var(--action-primary)] mb-4">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Manage Subjects
            </h1>
            <p className="text-[var(--text-secondary)] mt-2">
              Add new subjects or manage existing ones.
            </p>
          </div>

          <form className="flex gap-3 mb-8" onSubmit={handleAddSubject}>
            <input
              type="text"
              className="flex-1 border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 bg-white/50 text-[var(--text-primary)] placeholder-gray-400 font-medium focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--action-primary)] focus:outline-none transition shadow-sm"
              placeholder="Add new subject (e.g., DSA, DBMS)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <Button
=======
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
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              type="submit"
              variant="primary"
              className="shadow-lg hover:shadow-xl"
              icon={<Plus size={20} />}
            >
              Add
            </Button>
          </form>

          {errorMsg && (
<<<<<<< HEAD
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 px-5 py-3 mb-6 rounded-xl border border-red-100 text-center font-medium"
            >
=======
            <div className="bg-gradient-to-r from-red-700/40 to-pink-400/15 font-bold text-red-300 px-5 py-2 mb-3 rounded-xl shadow text-center animate-pulse">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              {errorMsg}
            </motion.div>
          )}
          {successMsg && (
<<<<<<< HEAD
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 text-emerald-600 px-5 py-3 mb-6 rounded-xl border border-emerald-100 text-center font-medium"
            >
=======
            <div className="bg-gradient-to-r from-emerald-700/15 to-blue-400/10 font-bold text-emerald-400 px-5 py-2 mb-3 rounded-xl shadow text-center animate-jump">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              {successMsg}
            </motion.div>
          )}
<<<<<<< HEAD

          <div className="mb-8">
=======
          <div className="mb-8 mt-8">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            <SubjectSelect
              subjects={subjects}
              selected={selected}
              onChange={setSelected}
              label="Select a subject to filter (optional)"
            />
          </div>
<<<<<<< HEAD

          <div className="bg-[var(--bg-secondary)]/50 border border-[var(--accent-secondary)]/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              All Subjects <span className="text-xs font-normal text-[var(--text-secondary)] bg-[var(--accent-secondary)]/10 px-2 py-0.5 rounded-full">{subjects.length}</span>
            </h2>
            <ul className="space-y-2">
              {subjects.length === 0 && (
                <li className="text-[var(--text-secondary)] text-center py-4 italic">No subjects yet. Add one above!</li>
=======
          <div className="bg-gradient-to-r from-violet-400/10 to-blue-400/10 border border-violet-400/15 rounded-2xl p-7 shadow-inner">
            <h2 className="text-2xl text-blue-200 font-bold mb-3">
              All Subjects:
            </h2>
            <ul className="list-disc pl-8 text-white text-lg">
              {subjects.length === 0 && (
                <li className="text-violet-300">No subjects yet.</li>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              )}
              {subjects.map((subj) => (
                <motion.li
                  layout
                  key={subj._id}
<<<<<<< HEAD
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-[var(--accent-secondary)]/10 shadow-sm hover:shadow-md transition-all"
=======
                  className="flex items-center justify-between pr-2 font-medium mt-1"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                >
                  <span
                    className={`font-medium ${
                      selected === subj.name
<<<<<<< HEAD
                        ? "text-[var(--action-primary)] font-bold"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {subj.name}
                  </span>
                  <Button
                    variant="danger"
                    size="small"
                    className="!p-2 opacity-80 hover:opacity-100"
=======
                        ? "font-bold text-blue-200 underline underline-offset-4"
                        : "text-white"
                    }
                  >
                    {subj.name}
                  </span>
                  <button
                    className="ml-5 bg-gradient-to-r from-red-600 to-pink-500 text-white font-bold px-4 py-1.5 rounded-lg shadow-sm hover:scale-[1.07] hover:bg-red-600 transition"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                    onClick={() => handleDeleteSubject(subj._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
      <style>{`
        @keyframes animate-jump { 0% { transform: scale(.9);} 60% { transform: scale(1.12);} 100% { transform: scale(1);} }
        .animate-jump { animation: animate-jump .35s cubic-bezier(.33,1.5,.7,1) both;}
      `}</style>
    </div>
  );
};

export default Subjects;
