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
      } catch {
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
    } catch {
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
    } catch {
      setErrorMsg("Server error.");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
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
              type="submit"
              variant="primary"
              className="shadow-lg hover:shadow-xl"
              icon={<Plus size={20} />}
            >
              Add
            </Button>
          </form>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 px-5 py-3 mb-6 rounded-xl border border-red-100 text-center font-medium"
            >
              {errorMsg}
            </motion.div>
          )}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 text-emerald-600 px-5 py-3 mb-6 rounded-xl border border-emerald-100 text-center font-medium"
            >
              {successMsg}
            </motion.div>
          )}

          <div className="mb-8">
            <SubjectSelect
              subjects={subjects}
              selected={selected}
              onChange={setSelected}
              label="Select a subject to filter (optional)"
            />
          </div>

          <div className="bg-[var(--bg-secondary)]/50 border border-[var(--accent-secondary)]/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              All Subjects <span className="text-xs font-normal text-[var(--text-secondary)] bg-[var(--accent-secondary)]/10 px-2 py-0.5 rounded-full">{subjects.length}</span>
            </h2>
            <ul className="space-y-2">
              {subjects.length === 0 && (
                <li className="text-[var(--text-secondary)] text-center py-4 italic">No subjects yet. Add one above!</li>
              )}
              {subjects.map((subj) => (
                <motion.li
                  layout
                  key={subj._id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-[var(--accent-secondary)]/10 shadow-sm hover:shadow-md transition-all"
                >
                  <span
                    className={`font-medium ${
                      selected === subj.name
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
    </div>
  );
};

export default Subjects;
