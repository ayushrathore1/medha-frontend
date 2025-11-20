import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://medha-backend.onrender.com";

// Select dropdown using design system
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
          if (selected !== null) {
            if (idx === selected) {
              btnClass +=
                key === questionObj.answer
                  ? " bg-emerald-100 text-emerald-700 border-emerald-400 font-bold"
                  : " bg-red-100 text-red-700 border-red-400 font-bold";
            } else {
              btnClass +=
                " bg-gray-100 text-gray-400 border-gray-200 opacity-60";
            }
          } else {
            btnClass +=
              " border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700";
          }
          return (
            <button
              key={key}
              className={btnClass}
              style={{ 
                backgroundColor: selected === null ? "var(--bg-primary)" : undefined,
                color: selected === null ? "var(--text-primary)" : undefined 
              }}
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
            >
              <b className="mr-3">{key}.</b>
              {text}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function QuizResult({ score, total, onRestart }) {
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
  const [topicName, setTopicName] = useState(""); // For topic-based quiz

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

  // Handler for quiz by topic
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
      </div>
    );

  if (quizCompleted)
    return (
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
      <QuizItem
        questionObj={questions[current]}
        questionNumber={current}
        total={questions.length}
        onAnswer={handleAnswer}
      />
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
        )}
      </div>
    </div>
  );
};

export default Quiz;
