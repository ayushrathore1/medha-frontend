import React from "react";

const QuizItem = ({ 
  question, 
  options, 
  selectedAnswer, 
  correctAnswer,
  onSelectAnswer, 
  showResult 
}) => {
  // Normalize options to array format
  const normalizedOptions = React.useMemo(() => {
    if (!options) return [];
    
    // If options is already an array
    if (Array.isArray(options)) {
      return options.map((opt, index) => ({
        key: String.fromCharCode(65 + index), // A, B, C, D
        text: opt
      }));
    }
    
    // If options is an object like {A: "text", B: "text"}
    if (typeof options === 'object') {
      return Object.entries(options).map(([key, text]) => ({
        key: key.toUpperCase(),
        text
      }));
    }
    
    return [];
  }, [options]);

  return (
    <div
      className="p-6 rounded-2xl border-2 shadow-lg"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)",
      }}
    >
      <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        {question}
      </h3>

      {normalizedOptions.length === 0 ? (
        <div className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
          No options available
        </div>
      ) : (
        <div className="space-y-3">
          {normalizedOptions.map(({ key, text }) => {
            const isSelected = selectedAnswer === key;
            const isCorrectAnswer = correctAnswer === key;
            
            const showCorrect = showResult && isCorrectAnswer;
            const showWrong = showResult && isSelected && !isCorrectAnswer;

            return (
              <button
                key={key}
                onClick={() => !showResult && onSelectAnswer && onSelectAnswer(key)}
                disabled={showResult}
                className={`w-full px-5 py-4 rounded-xl border-2 font-medium text-left transition-all ${
                  showResult ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={{
                  backgroundColor: showCorrect
                    ? "#d1fae5"
                    : showWrong
                    ? "#fee2e2"
                    : isSelected
                    ? "var(--accent-secondary)"
                    : "var(--bg-primary)",
                  borderColor: showCorrect
                    ? "#10b981"
                    : showWrong
                    ? "#ef4444"
                    : isSelected
                    ? "var(--action-primary)"
                    : "var(--accent-secondary)",
                  color: showCorrect || showWrong ? "#1f2937" : "var(--text-primary)",
                }}
              >
                <span className="font-bold mr-2">{key}.</span> {text}
                {showCorrect && <span className="ml-2 text-green-600">✓</span>}
                {showWrong && <span className="ml-2 text-red-600">✗</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizItem;
