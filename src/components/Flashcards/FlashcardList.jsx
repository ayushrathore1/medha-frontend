import React, { useState, useEffect, useCallback } from "react";
import FlashcardItem from "./FlashcardItem";

const FlashcardList = ({
  flashcards,
  onUpdate,
  onDelete,
  onMarkEasy,
  onMarkDifficult,
}) => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [studyStats, setStudyStats] = useState({ correct: 0, incorrect: 0 });

  // Memoized navigation functions
  const handleNext = useCallback(() => {
    if (isAnimating || flashcards.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((cur) => (cur + 1) % flashcards.length);
      setIsAnimating(false);
    }, 150);
  }, [isAnimating, flashcards.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || flashcards.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((cur) => (cur - 1 + flashcards.length) % flashcards.length);
      setIsAnimating(false);
    }, 150);
  }, [isAnimating, flashcards.length]);

  const goToCard = useCallback(
    (index) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 150);
    },
    [isAnimating, current]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") {
        e.preventDefault();
        setStudyMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNext, handlePrev]);

  const handleEasyMark = (flashcard, index) => {
    setStudyStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    if (onMarkEasy) onMarkEasy(flashcard, index);
    setTimeout(handleNext, 500);
  };

  const handleDifficultMark = (flashcard, index) => {
    setStudyStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    if (onMarkDifficult) onMarkDifficult(flashcard, index);
    setTimeout(handleNext, 500);
  };

  const resetStudySession = () => {
    setStudyStats({ correct: 0, incorrect: 0 });
    setCurrent(0);
  };

  if (!flashcards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12">
        <div className="text-center space-y-6">
          <div className="text-8xl mb-4">🎴</div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">
            No flashcards yet
          </h3>
          <p className="text-slate-600 text-lg max-w-md">
            Create your first flashcard to start studying and boost your
            learning experience!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mt-6">
            <div className="flex items-center">
              <span className="mr-1">📝</span>
              Create manually
            </div>
            <div className="flex items-center">
              <span className="mr-1">🤖</span>
              AI generated
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[current];
  const progressPercentage = ((current + 1) / flashcards.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with Study Mode Toggle and Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-slate-800">
              📚 Study Session
            </h2>
            <button
              onClick={() => setStudyMode(!studyMode)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                studyMode
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {studyMode ? "🎯 Study Mode ON" : "📖 Review Mode"}
            </button>
          </div>

          {/* Study Stats */}
          {studyMode &&
            (studyStats.correct > 0 || studyStats.incorrect > 0) && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">
                    ✅ {studyStats.correct}
                  </span>
                  <span className="text-red-600 font-medium">
                    ❌ {studyStats.incorrect}
                  </span>
                </div>
                <button
                  onClick={resetStudySession}
                  className="text-sm px-3 py-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">Progress</span>
            <span className="text-sm font-medium text-slate-600">
              {current + 1} of {flashcards.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Flashcard with Animation */}
      <div
        className={`transition-all duration-300 ${isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
      >
        <FlashcardItem
          flashcard={currentFlashcard}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMarkEasy={() => handleEasyMark(currentFlashcard, current)}
          onMarkDifficult={() => handleDifficultMark(currentFlashcard, current)}
        />
      </div>

      {/* Enhanced Navigation */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
        <div className="flex flex-col space-y-4">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePrev}
              disabled={flashcards.length <= 1 || isAnimating}
              className="group flex items-center px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-semibold rounded-xl hover:from-slate-200 hover:to-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-xl border border-blue-200">
              <span className="font-bold text-lg">{current + 1}</span>
              <span className="text-blue-600">/</span>
              <span className="font-medium">{flashcards.length}</span>
            </div>

            <button
              onClick={handleNext}
              disabled={flashcards.length <= 1 || isAnimating}
              className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Quick Navigation Dots */}
          {flashcards.length > 1 && flashcards.length <= 10 && (
            <div className="flex items-center justify-center space-x-2">
              {flashcards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === current
                      ? "bg-blue-600 scale-125"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          )}

          {/* Keyboard Shortcuts Info */}
          <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 pt-2 border-t border-slate-200">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-600 font-mono">
                ←
              </kbd>
              <span>Previous</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-600 font-mono">
                →
              </kbd>
              <span>Next</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-600 font-mono">
                Space
              </kbd>
              <span>Study Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Study Session Summary */}
      {studyMode && flashcards.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mt-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📈 Session Stats
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {studyStats.correct}
              </div>
              <div className="text-sm text-slate-600">Correct</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {studyStats.incorrect}
              </div>
              <div className="text-sm text-slate-600">Needs Review</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {studyStats.correct + studyStats.incorrect > 0
                  ? Math.round(
                      (studyStats.correct /
                        (studyStats.correct + studyStats.incorrect)) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-slate-600">Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardList;
