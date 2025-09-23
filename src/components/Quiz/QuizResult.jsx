import React from "react";

const QuizResult = ({ score, total, onRestart }) => (
  <div className="bg-white max-w-xl w-full mx-auto mt-12 rounded-xl shadow-lg p-8 text-center">
    <h2 className="text-2xl font-bold text-blue-700 mb-3">Quiz Completed!</h2>
    <div className="text-blue-900 text-lg mb-2">
      Your Score:
      <span className="font-bold ml-2">{score}</span> / {total}
    </div>
    <button
      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      onClick={onRestart}
    >
      Try Again
    </button>
  </div>
);

export default QuizResult;
