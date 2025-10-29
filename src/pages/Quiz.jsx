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
    <div className="mb-5">
      <label className="block mb-2 text-blue-600 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-4 py-2 rounded-xl w-full text-blue-700 font-medium"
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt[optionValue]} value={opt[optionValue]}>
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
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 max-w-xl w-full mx-auto rounded-2xl shadow-lg p-8 mb-6 transition">
      <div className="mb-3 text-blue-500 font-semibold tracking-wide text-sm uppercase">
        Question {questionNumber + 1} <span className="text-blue-300">of</span>{" "}
        {total}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-5">
        {questionObj.question}
      </h3>
      <div className="flex flex-col gap-3">
        {["A", "B", "C", "D"].map((opt, idx) => (
          <button
            key={opt}
            className={`border px-4 py-2 rounded-xl font-medium transition text-left
              ${
                selected !== null
                  ? idx === selected
                    ? opt === questionObj.answer
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-gray-50 text-blue-900 border-blue-200 opacity-80"
                  : "bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100"
              }`}
            disabled={selected !== null}
            onClick={() => handleSelect(idx)}
          >
            <b className="mr-2">{opt}.</b>
            {questionObj.options[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizResult({ score, total, onRestart }) {
  return (
    <div className="bg-white/90 max-w-xl w-full mx-auto mt-12 rounded-2xl shadow-lg p-10 text-center">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-5">
        Quiz Completed!
      </h2>
      <div className="text-blue-800 text-xl mb-4">
        <span className="font-bold text-green-600 text-2xl">{score}</span> /{" "}
        {total}
      </div>
      <div className="w-full bg-blue-100 rounded-full h-4 mb-8">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-700"
          style={{ width: `${(score / total) * 100}%` }}
        ></div>
      </div>
      <button
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-blue-700 transition"
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

  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="p-10 bg-white rounded-2xl shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">
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
            className="bg-blue-600 w-full py-3 rounded-xl text-white font-bold text-lg hover:bg-blue-700 transition"
            disabled={loading || !selectedSubject || !selectedNote}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
          {error && <div className="text-red-500 mt-4">{error}</div>}
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <QuizItem
        questionObj={questions[current]}
        questionNumber={current}
        total={questions.length}
        onAnswer={handleAnswer}
      />
      <div className="flex gap-4 mt-6">
        <button
          className="bg-blue-100 border border-blue-300 rounded-lg px-5 py-2 font-medium text-blue-700 hover:bg-blue-200 transition"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Previous
        </button>
        <button
          className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition"
          onClick={handleRestart}
        >
          Restart
        </button>
        {current < questions.length - 1 && (
          <button
            className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold shadow hover:bg-blue-700 transition"
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
