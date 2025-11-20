import React, { useState, useEffect } from "react";
import axios from "axios";
<<<<<<< HEAD
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
=======
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://medha-backend.onrender.com";

<<<<<<< HEAD
// Select dropdown using design system
=======
// Glassy select dropdown
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
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
<<<<<<< HEAD
    <div className="mb-6">
      <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--accent-secondary)",
          color: "var(--text-primary)",
        }}
=======
    <div className="mb-7">
      <label className="block mb-2 text-blue-200 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3 rounded-xl bg-[#18192f]/80 text-white font-medium placeholder-blue-200 border border-blue-400/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition shadow"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {(Array.isArray(options) ? options : []).map((opt) => (
          <option key={opt[optionValue]} value={opt[optionValue]}>
            {opt[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
}

function QuizItem({ questionObj = {}, questionNumber, total, onAnswer }) {
  const [selected, setSelected] = useState(null);

  // Defensive: handle missing options keys
  const safeOptions =
    questionObj.options && typeof questionObj.options === "object"
      ? ["A", "B", "C", "D"].map((opt) => ({
          key: opt,
          text: questionObj.options[opt] || "",
        }))
      : [];

  const handleSelect = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      onAnswer(idx);
      setSelected(null);
    }, 400);
  };

  return (
<<<<<<< HEAD
    <Card className="max-w-2xl w-full mx-auto mb-6">
      <div className="mb-4 font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--action-primary)" }}>
        Question {questionNumber + 1} <span style={{ color: "var(--text-secondary)" }}>of</span>{" "}
        {total}
      </div>
      <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        {questionObj.question || "Question unavailable."}
      </h3>
      <div className="flex flex-col gap-3">
        {safeOptions.map(({ key, text }, idx) => {
          // Determine button styles
          let btnClass =
            "border-2 px-5 py-3 rounded-xl font-medium text-base text-left transition shadow-sm";
=======
    <div className="bg-[#18192f]/90 backdrop-blur-xl border border-blue-800/10 max-w-xl w-full mx-auto rounded-2xl shadow-2xl p-10 mb-7 transition">
      <div className="mb-4 text-blue-400 font-semibold tracking-wide text-sm uppercase">
        Question {questionNumber + 1} <span className="text-blue-500">of</span>{" "}
        {total}
      </div>
      <h3 className="text-2xl font-bold text-white mb-6">
        {questionObj.question || "Question unavailable."}
      </h3>
      <div className="flex flex-col gap-4">
        {safeOptions.map(({ key, text }, idx) => {
          // Determine button styles
          let btnClass =
            "border px-5 py-3 rounded-xl font-medium text-base text-left transition shadow";
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          if (selected !== null) {
            if (idx === selected) {
              btnClass +=
                key === questionObj.answer
<<<<<<< HEAD
                  ? " bg-emerald-100 text-emerald-700 border-emerald-400 font-bold"
                  : " bg-red-100 text-red-700 border-red-400 font-bold";
            } else {
              btnClass +=
                " bg-gray-100 text-gray-400 border-gray-200 opacity-60";
            }
          } else {
            btnClass +=
              " border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700";
=======
                  ? " bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400"
                  : " bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500";
            } else {
              btnClass +=
                " bg-[#0f0e2a] text-gray-300 border-blue-400/10 opacity-75";
            }
          } else {
            btnClass +=
              " bg-[#1e1c42] text-white border-blue-400/30 hover:bg-gradient-to-r hover:from-blue-600/40 hover:to-purple-600/40 hover:border-blue-400/50";
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          }
          return (
            <button
              key={key}
              className={btnClass}
<<<<<<< HEAD
              style={{ 
                backgroundColor: selected === null ? "var(--bg-primary)" : undefined,
                color: selected === null ? "var(--text-primary)" : undefined 
              }}
=======
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
            >
              <b className="mr-3">{key}.</b>
              {text}
            </button>
          );
        })}
      </div>
<<<<<<< HEAD
    </Card>
=======
    </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
  );
}

function QuizResult({ score, total, onRestart }) {
<<<<<<< HEAD
  const percentage = (score / total) * 100;
  
  return (
    <Card className="max-w-xl w-full mx-auto mt-16 text-center">
      <h2 className="text-3xl font-extrabold mb-6" style={{ color: "var(--action-primary)" }}>
        Quiz Completed! 🎉
      </h2>
      <div className="text-xl mb-6" style={{ color: "var(--text-primary)" }}>
        <span className="font-bold text-4xl" style={{ color: "var(--accent-primary)" }}>
          {score}
        </span>{" "}
        / <span style={{ color: "var(--text-secondary)" }}>{total}</span>
      </div>
      <div 
        className="w-full rounded-full h-6 mb-10 shadow-inner relative overflow-hidden"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="h-6 rounded-full transition-all duration-700"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))` 
          }}
        ></div>
      </div>
      <p className="mb-8 text-lg" style={{ color: "var(--text-secondary)" }}>
        You scored {percentage.toFixed(0)}%!
      </p>
      <Button onClick={onRestart} size="large">
        Try Another Quiz
      </Button>
    </Card>
=======
  return (
    <div className="bg-[#18192f]/95 max-w-xl w-full mx-auto mt-16 rounded-2xl shadow-2xl border border-blue-800/10 p-12 text-center backdrop-blur-xl">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-6">
        Quiz Completed!
      </h2>
      <div className="text-white text-xl mb-6">
        <span className="font-bold text-emerald-400 text-3xl">{score}</span> /{" "}
        <span className="text-blue-200">{total}</span>
      </div>
      <div className="w-full bg-blue-800/10 rounded-full h-6 mb-10 shadow-inner relative overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-400 via-blue-400 to-blue-500 h-6 rounded-full transition-all duration-700"
          style={{ width: `${(score / total) * 100}%` }}
        ></div>
      </div>
      <button
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-9 py-3 rounded-xl font-bold shadow-xl hover:scale-[1.04] transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onRestart}
      >
        Try Another Quiz
      </button>
    </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
  );
}

const Quiz = () => {
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
<<<<<<< HEAD
  const [topicName, setTopicName] = useState(""); // For topic-based quiz
=======
  const [topicName, setTopicName] = useState(""); // NEW: For topic-based quiz
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to take a quiz.");
      return;
    }
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const subjectsData = res.data.subjects || res.data;
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (err) {
        setSubjects([]);
        setError("Failed to load subjects");
        console.error("Subjects error:", err?.response?.data || err.message);
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
        const notesData = res.data.notes || res.data;
        setNotes(Array.isArray(notesData) ? notesData : []);
      } catch (err) {
        setNotes([]);
        setError("Failed to load notes");
        console.error("Notes error:", err?.response?.data || err.message);
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
      const quizQuestions = res.data?.quiz?.questions;
      setQuestions(Array.isArray(quizQuestions) ? quizQuestions : []);
      setCurrent(0);
    } catch (err) {
      setQuestions([]);
      setError(err.response?.data?.message || "Could not generate quiz");
      console.error("Quiz error:", err?.response?.data || err.message);
    }
    setLoading(false);
  };

<<<<<<< HEAD
  // Handler for quiz by topic
=======
  // NEW: Handler for quiz by topic
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
  const handleGenerateQuizByTopic = async () => {
    setQuestions([]);
    setScore(0);
    setLoading(true);
    setError("");
    setCurrent(0);
    setQuizCompleted(false);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/quizzes/generate-topic-ai`,
        { topic: topicName, subject: selectedSubject },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const quizQuestions = res.data?.quiz?.questions;
      setQuestions(Array.isArray(quizQuestions) ? quizQuestions : []);
      setCurrent(0);
    } catch (err) {
      setQuestions([]);
      setError(
        err.response?.data?.message || "Could not generate quiz for topic"
      );
      console.error("Quiz topic error:", err?.response?.data || err.message);
    }
    setLoading(false);
  };

  const handleAnswer = (selectedIdx) => {
    if (!questions[current]) return;
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
    setTopicName("");
    setError("");
    setNotes([]);
    setQuizCompleted(false);
  };

<<<<<<< HEAD
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <Card className="w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--action-primary)" }}>
            🧠 AI Quiz Generator
          </h1>
          <div className="text-red-500 font-bold">
            You must be logged in to take a quiz.
          </div>
        </Card>
      </div>
    );
  }

  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <Card className="w-full max-w-lg">
          <h1 className="text-3xl font-extrabold mb-8" style={{ color: "var(--action-primary)" }}>
            🧠 AI Quiz Generator
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
          
          {/* Topic-based Quiz Generator */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Or Enter Topic
            </label>
            <input
              type="text"
              placeholder="e.g., Binary Trees, React Hooks"
              className="w-full px-4 py-3 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              maxLength={64}
              autoComplete="off"
            />
          </div>

          <Button
            onClick={handleGenerateQuizByTopic}
            disabled={loading || !topicName}
            loading={loading}
            fullWidth
            className="mb-3"
            variant="success"
          >
            Generate Quiz by Topic
          </Button>
          
          <Button
            onClick={handleGenerateQuiz}
            disabled={loading || !selectedSubject || !selectedNote}
            loading={loading}
            fullWidth
            variant="primary"
          >
            Generate Quiz from Note
          </Button>
          
          {error && (
            <div className="mt-6 p-4 rounded-xl border-2" style={{ 
              backgroundColor: "#fef2f2", 
              borderColor: "#fca5a5",
              color: "#dc2626" 
            }}>
              <p className="font-bold">{error}</p>
            </div>
          )}
        </Card>
=======
  // BLUR + GLASS
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10101a] pt-20">
        <div className="p-12 bg-[#18192f]/95 rounded-2xl shadow-2xl border border-blue-800/10 w-full max-w-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-8">
            AI Quiz Generator
          </h1>
          <div className="text-red-300 mt-4 font-bold">
            You must be logged in to take a quiz.
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10101a] pt-20 relative">
        {/* Subtle glass blob */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-2/5 h-40 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-2xl opacity-10"></div>
        <div className="p-12 bg-[#18192f]/95 rounded-2xl shadow-2xl border border-blue-800/10 w-full max-w-lg z-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-8">
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
          {/* --- Topic-based Quiz Generator UI --- */}
          <input
            type="text"
            placeholder="Or enter topic (e.g. Binary Trees)"
            className="w-full px-5 py-3 mb-4 rounded-xl bg-[#18192f]/80 text-white font-medium placeholder-blue-200 border border-blue-400/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition shadow"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            maxLength={64}
            autoComplete="off"
          />
          <button
            onClick={handleGenerateQuizByTopic}
            className="bg-gradient-to-r from-emerald-500 via-blue-400 to-indigo-500 w-full py-3 rounded-xl text-white font-bold text-lg shadow-xl hover:scale-[1.03] transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed mb-2"
            disabled={loading || !topicName}
          >
            {loading ? "Generating..." : "Generate Quiz by Topic"}
          </button>
          <button
            onClick={handleGenerateQuiz}
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 w-full py-3 rounded-xl text-white font-bold text-lg shadow-xl hover:scale-[1.03] transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || !selectedSubject || !selectedNote}
          >
            {loading ? "Generating..." : "Generate Quiz from Note"}
          </button>
          {error && <div className="text-red-400 mt-4 font-bold">{error}</div>}
        </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
      </div>
    );

  if (quizCompleted)
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <QuizResult
          score={score}
          total={questions.length}
          onRestart={handleRestart}
        />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 pb-10">
=======
      <QuizResult
        score={score}
        total={questions.length}
        onRestart={handleRestart}
      />
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#10101a] pt-20 relative">
      {/* Subtle glass blobs on left/right */}
      <div className="absolute left-0 top-1/4 w-64 h-[180px] bg-gradient-to-tr from-blue-300/16 to-transparent rounded-full blur-2xl opacity-8"></div>
      <div className="absolute right-0 bottom-10 w-72 h-36 bg-gradient-to-l from-blue-400/12 to-fuchsia-400/8 rounded-full blur-2xl opacity-7"></div>

>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
      <QuizItem
        questionObj={questions[current]}
        questionNumber={current}
        total={questions.length}
        onAnswer={handleAnswer}
      />
<<<<<<< HEAD
      <div className="flex gap-4 mt-6">
        <Button
          variant="ghost"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          ← Previous
        </Button>
        <Button
          variant="secondary"
          onClick={handleRestart}
        >
          🔄 Restart
        </Button>
        {current < questions.length - 1 && (
          <Button
            variant="primary"
            onClick={() => setCurrent(current + 1)}
          >
            Next →
          </Button>
=======
      <div className="flex gap-7 mt-8">
        <button
          className="bg-blue-800/20 border border-blue-400/20 rounded-lg px-6 py-2 font-bold text-blue-100 hover:bg-blue-800/40 transition"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Previous
        </button>
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-2.5 rounded-xl font-bold shadow-xl hover:scale-[1.05] transition focus:outline-none"
          onClick={handleRestart}
        >
          Restart
        </button>
        {current < questions.length - 1 && (
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-10 py-2.5 rounded-xl font-bold shadow-xl hover:scale-[1.05] transition focus:outline-none"
            onClick={() => setCurrent(current + 1)}
          >
            Next
          </button>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        )}
      </div>
    </div>
  );
};

export default Quiz;
