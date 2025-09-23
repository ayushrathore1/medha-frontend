import React, { useState } from "react";

const QuizItem = ({ questionObj, questionNumber, total, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option, idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setTimeout(() => {
      onAnswer(idx, idx === questionObj.correctOption);
      setSelected(null);
      setAnswered(false);
    }, 800); // Delay before moving to next question
  };

  return (
    <div className="bg-white max-w-xl w-full mx-auto rounded-xl shadow-lg p-8 mb-4">
      <div className="mb-4 text-blue-600 font-semibold">
        Question {questionNumber + 1} of {total}
      </div>
      <h3 className="text-lg font-bold text-blue-800 mb-3">
        {questionObj.question}
      </h3>
      <div className="flex flex-col gap-2">
        {questionObj.options.map((option, idx) => (
          <button
            key={idx}
            className={`text-left border px-4 py-2 rounded-lg
                ${
                  selected === idx
                    ? idx === questionObj.correctOption
                      ? "bg-green-400 text-white border-green-500"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
                }
                font-medium transition`}
            disabled={answered}
            onClick={() => handleSelect(option, idx)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizItem;
