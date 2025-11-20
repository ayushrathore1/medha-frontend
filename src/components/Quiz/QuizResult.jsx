import React from "react";
import Card from "../Common/Card";
import Button from "../Common/Button";

const QuizResult = ({ score, total, onRestart, onReview }) => {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
          Quiz Results
        </h1>

        <Card className="text-center p-8">
          <div 
            className="text-6xl font-extrabold mb-4" 
            style={{ 
              color: percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444" 
            }}
          >
            {percentage}%
          </div>
          <div className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {score} / {total} Correct
          </div>
          <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
            {percentage >= 70 
              ? "Excellent work! 🎉" 
              : percentage >= 50 
              ? "Good effort! Keep it up! 👍" 
              : "Keep practicing! You'll improve! 💪"}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-5 mb-8 shadow-inner overflow-hidden">
            <div
              className="h-5 rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                background: percentage >= 70 
                  ? "linear-gradient(to right, #10b981, #34d399)" 
                  : percentage >= 50 
                  ? "linear-gradient(to right, #f59e0b, #fbbf24)"
                  : "linear-gradient(to right, #ef4444, #f87171)"
              }}
            ></div>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={onRestart} variant="primary" fullWidth>
              Take Another Quiz
            </Button>
            {onReview && (
              <Button onClick={onReview} variant="outline" fullWidth>
                Review Answers
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizResult;
