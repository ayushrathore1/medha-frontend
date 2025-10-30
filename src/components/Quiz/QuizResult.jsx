import React from "react";

const QuizResult = ({ score, total, onRestart }) => (
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
      Try Again
    </button>
  </div>
);

export default QuizResult;
