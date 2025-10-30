import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://medha-backend.onrender.com";

function SelectDropdown({
  label,
  options,
  value,
  onChange,
  optionLabel = "name",
  optionValue = "_id",
  disabled = false,
}) {
  return (
    <div className="mb-7">
      <label className="block mb-2 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-bold">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-violet-400/20 rounded-xl px-5 py-3 w-full text-white font-medium bg-[#18163a]/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition shadow placeholder-violet-400"
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option
            key={opt[optionValue]}
            value={opt[optionValue]}
            className="text-white bg-[#18163a]/90"
          >
            {opt[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
}

function QuizItem({ questionObj, questionNumber, total, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      onAnswer(idx);
      setSelected(null);
    }, 400);
  };

  return (
    <div className="bg-[#18163a]/90 backdrop-blur-2xl border border-violet-500/15 max-w-xl w-full mx-auto rounded-3xl shadow-2xl p-9 mb-6 transition font-inter">
      <div className="mb-3 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-bold tracking-wide text-base uppercase">
        Question {questionNumber + 1}{" "}
        <span className="text-violet-200">of</span> {total}
      </div>
      <h3 className="text-xl font-bold text-white mb-6">
        {questionObj.question}
      </h3>
      <div className="flex flex-col gap-4">
        {["A", "B", "C", "D"].map((opt, idx) => (
          <button
            key={opt}
            className={`border px-5 py-3 rounded-xl font-semibold shadow transition text-left text-base relative
              ${
                selected !== null
                  ? idx === selected
                    ? opt === questionObj.answer
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-lg animate-pulse"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-lg animate-pulse"
                    : "bg-white/10 text-violet-300 border-violet-400/30 opacity-70"
                  : "bg-white/10 text-white border-violet-400/20 hover:scale-[1.03] hover:bg-gradient-to-r hover:from-violet-600/10 hover:to-blue-400/10 shadow hover:text-blue-200"
              }`}
            disabled={selected !== null}
            onClick={() => handleSelect(idx)}
          >
            <b className="mr-3 text-xl">{opt}.</b>
            <span>{questionObj.options[opt]}</span>
            {selected !== null && idx === selected && (
              <span
                className={`absolute left-0 right-0 bottom-1 h-1 rounded-xl ${
                  opt === questionObj.answer
                    ? "bg-gradient-to-r from-emerald-400 to-blue-400"
                    : "bg-gradient-to-r from-red-400 to-pink-400"
                } opacity-90`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizResult({ score, total, onRestart }) {
  return (
    <div className="bg-[#18163a]/90 backdrop-blur-2xl max-w-xl w-full mx-auto mt-16 rounded-3xl shadow-2xl border border-violet-500/15 p-12 text-center font-inter">
      <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
        Quiz Completed!
      </h2>
      <div className="text-white text-xl mb-6">
        <span className="font-bold text-emerald-400 text-3xl">{score}</span> /{" "}
        <span className="text-blue-300">{total}</span>
      </div>
      <div className="w-full bg-violet-400/10 rounded-full h-5 mb-12 shadow-lg relative overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 h-5 rounded-full transition-all duration-700"
          style={{ width: `${(score / total) * 100}%` }}
        ></div>
      </div>
      <button
        className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:scale-[1.04] transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
        onClick={onRestart}
      >
        Try Another Quiz
      </button>
    </div>
  );
}

const Quiz = ({ token }) => {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedNote, setSelectedNote] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data);
      } catch {
        setError("Failed to load subjects");
      }
    };
    fetchSubjects();
  }, [token]);

  useEffect(() => {
    setNotes([]);
    setSelectedNote("");
    if (!selectedSubject) return;
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/notes?subject=${selectedSubject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(res.data);
      } catch {
        setError("Failed to load notes");
      }
    };
    fetchNotes();
  }, [selectedSubject, token]);

  const handleGenerateQuiz = async () => {
    setQuestions([]);
    setScore(0);
    setLoading(true);
    setError("");
    setCurrent(0);
    setQuizCompleted(false);
    try {
      const noteObj = notes.find((n) => n._id === selectedNote);
      const subjectName = noteObj?.subject?.name || noteObj?.subject || "";
      const res = await axios.post(
        `${BACKEND_URL}/api/quizzes/generate-ai`,
        { noteId: selectedNote, subject: subjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(res.data.quiz.questions);
      setCurrent(0);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate quiz");
    }
    setLoading(false);
  };

  const handleAnswer = (selectedIdx) => {
    const correctIdx = ["A", "B", "C", "D"].indexOf(questions[current].answer);
    if (selectedIdx === correctIdx) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(current + 1);
      else setQuizCompleted(true);
    }, 500);
  };

  const handleRestart = () => {
    setScore(0);
    setCurrent(0);
    setQuestions([]);
    setSelectedSubject("");
    setSelectedNote("");
    setError("");
    setNotes([]);
    setQuizCompleted(false);
  };

  // Begin/choose quiz
  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative font-inter overflow-hidden">
        {/* Glassy blobs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-5 left-1/4 w-72 h-64 bg-gradient-to-tr from-violet-400/21 to-blue-400/12 rounded-full blur-2xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-16 right-1/3 w-60 h-44 bg-gradient-to-r from-blue-400/12 to-purple-400/9 rounded-full blur-2xl opacity-18 animate-blob animation-delay-2000"></div>
          <style>{`
            @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.08) translate(21px,-21px);} 66% {transform: scale(0.93) translate(-18px,22px);} 100% {transform: scale(1) translate(0,0);} }
            .animate-blob { animation: blob 14s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
          `}</style>
        </div>
        <div className="p-12 bg-[#18163a]/95 rounded-3xl shadow-2xl border border-violet-400/15 w-full max-w-lg relative z-10">
          <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight text-center">
            AI Quiz Generator
          </h1>
          <SelectDropdown
            label="Subject"
            options={subjects}
            value={selectedSubject}
            onChange={setSelectedSubject}
            optionLabel="name"
            optionValue="_id"
          />
          <SelectDropdown
            label="Note"
            options={notes}
            value={selectedNote}
            onChange={setSelectedNote}
            optionLabel="title"
            optionValue="_id"
            disabled={!selectedSubject || !notes.length}
          />
          <button
            onClick={handleGenerateQuiz}
            className="bg-gradient-to-r from-violet-600 to-blue-600 w-full py-3 rounded-xl text-white font-bold text-lg shadow-xl hover:scale-[1.04] transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !selectedSubject || !selectedNote}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
          {error && <div className="text-red-400 font-bold mt-5">{error}</div>}
        </div>
      </div>
    );

  if (quizCompleted)
    return (
      <QuizResult
        score={score}
        total={questions.length}
        onRestart={handleRestart}
      />
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative font-inter overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-5 left-1/4 w-60 h-44 bg-gradient-to-tr from-violet-400/16 to-blue-400/10 rounded-full blur-2xl opacity-18 animate-blob"></div>
        <div className="absolute bottom-8 right-1/4 w-56 h-36 bg-gradient-to-r from-blue-400/13 to-purple-400/10 rounded-full blur-2xl opacity-14 animate-blob animation-delay-2000"></div>
      </div>
      <QuizItem
        questionObj={questions[current]}
        questionNumber={current}
        total={questions.length}
        onAnswer={handleAnswer}
      />
      <div className="flex gap-6 mt-10">
        <button
          className="bg-gradient-to-r from-violet-400/20 to-blue-400/10 border border-violet-400/25 rounded-xl px-6 py-2 font-bold text-violet-200 hover:bg-violet-400/25 transition shadow focus:outline-none"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Previous
        </button>
        <button
          className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-9 py-2.5 rounded-xl font-bold shadow-xl hover:scale-[1.06] transition-all focus:outline-none"
          onClick={handleRestart}
        >
          Restart
        </button>
        {current < questions.length - 1 && (
          <button
            className="bg-gradient-to-r from-blue-600 to-violet-500 text-white px-9 py-2.5 rounded-xl font-bold shadow-xl hover:scale-[1.06] transition-all focus:outline-none"
            onClick={() => setCurrent(current + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
