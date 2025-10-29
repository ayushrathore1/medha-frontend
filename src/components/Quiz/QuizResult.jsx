import React from "react";

const QuizResult = ({ score, total, onRestart }) => (
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
      Try Again
    </button>
  </div>
);

export default QuizResult;
