import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

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
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8 leading-snug">
        {question}
      </h3>

      {normalizedOptions.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200 text-slate-400">
          No options available
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {normalizedOptions.map(({ key, text }, index) => {
              const isSelected = selectedAnswer === key;
              const isCorrectAnswer = correctAnswer === key;
              
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;

              // Determine container style
              let containerClass = "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md";
              let textClass = "text-slate-700";
              let badgeClass = "bg-slate-100 text-slate-500";

              if (showResult) {
                if (showCorrect) {
                  containerClass = "bg-emerald-50 border-emerald-400 shadow-emerald-100";
                  textClass = "text-emerald-900 font-bold";
                  badgeClass = "bg-emerald-200 text-emerald-800";
                } else if (showWrong) {
                  containerClass = "bg-red-50 border-red-400 shadow-red-100";
                  textClass = "text-red-900 font-bold";
                  badgeClass = "bg-red-200 text-red-800";
                } else {
                  containerClass = "opacity-50 border-slate-200";
                }
              } else if (isSelected) {
                containerClass = "bg-indigo-50 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500";
                textClass = "text-indigo-900 font-bold";
                badgeClass = "bg-indigo-200 text-indigo-700";
              }

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !showResult && onSelectAnswer && onSelectAnswer(key)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${containerClass} ${showResult ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg ${badgeClass}`}>
                    {key}
                  </span>
                  <span className={`text-lg transition-colors flex-1 ${textClass}`}>
                    {text}
                  </span>
                  {showCorrect && <FaCheck className="text-emerald-600 flex-shrink-0" />}
                  {showWrong && <FaTimes className="text-red-600 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default QuizItem;
