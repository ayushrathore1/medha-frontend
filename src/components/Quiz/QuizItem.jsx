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
    <div className="bg-[#18163a]/90 backdrop-blur-2xl border border-violet-500/15 max-w-xl w-full mx-auto rounded-3xl shadow-2xl p-8 mb-8 transition font-inter">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          Question {questionNumber + 1}
        </span>
        <span className="text-xs ml-2 text-violet-300">of {total}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-7">
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
                    ? idx === ["A", "B", "C", "D"].indexOf(questionObj.answer)
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-lg animate-pulse"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-lg animate-pulse"
                    : "bg-[#0f0e2a] text-gray-300 border-violet-400/30 opacity-70"
                  : "bg-[#1e1c42] text-white border-violet-400/30 hover:scale-[1.03] hover:bg-gradient-to-r hover:from-violet-600/30 hover:to-blue-400/30 hover:border-violet-400/50 shadow"
              }`}
            disabled={selected !== null}
            onClick={() => handleSelect(idx)}
          >
            <b className="mr-3 text-xl">{opt}.</b>
            <span>{questionObj.options[opt]}</span>
            {selected !== null && idx === selected && (
              <span
                className={`absolute left-0 right-0 bottom-1 h-1 rounded-xl ${
                  idx === ["A", "B", "C", "D"].indexOf(questionObj.answer)
                    ? "bg-gradient-to-r from-emerald-400 to-blue-400"
                    : "bg-gradient-to-r from-red-400 to-pink-400"
                } opacity-80`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizItem;
