import React, { useState } from "react";

const QuizItem = ({ questionObj, questionNumber, total, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      onAnswer(idx);
      setSelected(null);
    }, 500);
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
                    ? idx === ["A", "B", "C", "D"].indexOf(questionObj.answer)
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
};

export default QuizItem;
