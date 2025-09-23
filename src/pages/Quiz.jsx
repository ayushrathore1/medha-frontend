import React, { useState } from "react";
import SubjectSelect from "../components/Subject/SubjectSelect";

// DEMO SUBJECTS & QUESTIONS (replace with backend later)
const subjects = ["Data Structures", "DBMS", "OOP"];
const mockQuestions = {
  "Data Structures": [
    {
      question: "Which data structure uses LIFO order?",
      options: ["Queue", "Stack", "Graph", "Array"],
      answer: "Stack",
    },
    {
      question: "What is the time complexity for accessing an array element?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      answer: "O(1)",
    },
  ],
  DBMS: [
    {
      question: "Which language is used to query databases?",
      options: ["HTML", "CSS", "SQL", "JavaScript"],
      answer: "SQL",
    },
  ],
  OOP: [
    {
      question: "Which pillar is NOT a part of OOP?",
      options: ["Encapsulation", "Polymorphism", "Abstraction", "Compilation"],
      answer: "Compilation",
    },
  ],
};

const Quiz = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(null);

  const startQuiz = (subject) => {
    setSelectedSubject(subject);
    setQuestions(mockQuestions[subject] || []);
    setUserAnswers([]);
    setCurrent(0);
    setScore(null);
  };

  const handleOption = (option) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[current] = option;
      return updated;
    });
  };

  const handleNext = () => setCurrent((c) => c + 1);
  const handlePrev = () => setCurrent((c) => c - 1);

  const handleSubmit = () => {
    let sc = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) sc += 1;
    });
    setScore(sc);
  };

  const handleRestart = () => {
    setSelectedSubject("");
    setQuestions([]);
    setUserAnswers([]);
    setCurrent(0);
    setScore(null);
  };

  // === Quiz not started yet ===
  if (!selectedSubject)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20 pb-16 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 border border-blue-100 shadow-lg rounded-2xl p-8 mt-10">
            <h1 className="text-4xl font-bold text-blue-700 mb-3">
              Take a Quiz
            </h1>
            <p className="mb-6 text-blue-900 text-lg">
              Test yourself! Choose a subject to begin your quiz and check your
              progress.
            </p>
            <SubjectSelect
              subjects={subjects}
              selected={""}
              onChange={startQuiz}
              label="Select Subject"
            />
          </div>
        </div>
      </div>
    );

  // === Quiz Complete / Score ===
  if (score !== null)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20 pb-16 flex flex-col items-center">
        <div className="bg-white/90 border border-blue-100 shadow-lg rounded-2xl p-8 mt-10 max-w-md w-full flex flex-col items-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            Quiz Complete!
          </h2>
          <div className="mb-5 text-blue-900 text-lg">
            You scored <span className="font-bold text-blue-700">{score}</span>{" "}
            out of {questions.length}.
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 mb-6">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition"
            onClick={handleRestart}
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );

  // === Quiz in progress ===
  const q = questions[current];
  const selected = userAnswers[current];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20 pb-16 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white/90 border border-blue-100 shadow-lg rounded-2xl p-8 mt-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-1">
            {selectedSubject} Quiz
          </h2>
          <div className="text-blue-800 mb-4">
            Question <span className="font-bold">{current + 1}</span> of{" "}
            {questions.length}
          </div>
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl shadow p-5 mb-5">
            <div className="font-semibold mb-3 text-blue-900">{q.question}</div>
            <div className="grid gap-3">
              {q.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`q${current}`}
                    value={opt}
                    checked={selected === opt}
                    onChange={() => handleOption(opt)}
                    className="accent-blue-600 text-lg"
                  />
                  <span className="text-blue-800 text-lg">{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 font-medium text-blue-700 hover:bg-blue-200 transition"
              disabled={current === 0}
              onClick={handlePrev}
            >
              Previous
            </button>
            <button
              className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 font-medium text-blue-700 hover:bg-blue-200 transition"
              onClick={handleRestart}
            >
              Change Subject
            </button>
            {current < questions.length - 1 ? (
              <button
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                disabled={!selected}
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                disabled={userAnswers.length < questions.length}
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
