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

  // Touch/swipe handling for mobile navigation
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

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

  // Touch/Swipe handlers for mobile navigation
  const handleTouchStart = useCallback((e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!touchStart.x || !touchStart.y) return;

      const deltaX = Math.abs(e.touches[0].clientX - touchStart.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStart.y);

      // Detect horizontal swipe (more horizontal than vertical movement)
      if (deltaX > deltaY && deltaX > 10) {
        setIsSwiping(true);
        e.preventDefault(); // Prevent scrolling during swipe
      }
    },
    [touchStart]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!touchStart.x || !isSwiping) return;

      const deltaX = e.changedTouches[0].clientX - touchStart.x;
      const threshold = 50; // Minimum swipe distance

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlePrev(); // Swipe right = previous
        } else {
          handleNext(); // Swipe left = next
        }
      }

      setTouchStart({ x: 0, y: 0 });
      setIsSwiping(false);
    },
    [touchStart, isSwiping, handleNext, handlePrev]
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
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 mx-2 sm:mx-0">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="text-6xl sm:text-8xl mb-2 sm:mb-4">🎴</div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">
            No flashcards yet
          </h3>
          <p className="text-slate-600 text-base sm:text-lg max-w-sm sm:max-w-md px-4 sm:px-0">
            Create your first flashcard to start studying and boost your
            learning experience!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-slate-500 mt-4 sm:mt-6">
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
    <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header with Study Mode Toggle and Stats - Mobile Optimized */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
            <div className="flex items-center justify-between xs:justify-start space-x-3 sm:space-x-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                <span className="hidden sm:inline">📚 Study Session</span>
                <span className="sm:hidden">📚 Study</span>
              </h2>
              <button
                onClick={() => setStudyMode(!studyMode)}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm ${
                  studyMode
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {studyMode ? (
                  <>
                    <span className="sm:hidden">🎯 Study</span>
                    <span className="hidden sm:inline">🎯 Study Mode ON</span>
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">📖 Review</span>
                    <span className="hidden sm:inline">📖 Review Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Study Stats - Mobile Responsive */}
            {studyMode &&
              (studyStats.correct > 0 || studyStats.incorrect > 0) && (
                <div className="flex items-center justify-between xs:justify-center space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-medium text-sm">
                      ✅ {studyStats.correct}
                    </span>
                    <span className="text-red-600 font-medium text-sm">
                      ❌ {studyStats.incorrect}
                    </span>
                  </div>
                  <button
                    onClick={resetStudySession}
                    className="text-xs px-2 sm:px-3 py-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                Progress
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                {current + 1} of {flashcards.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard with Animation and Touch Support */}
      <div
        className={`transition-all duration-300 ${
          isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Indicator */}
        {isSwiping && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-50 pointer-events-none">
            Swipe to navigate
          </div>
        )}

        <FlashcardItem
          flashcard={currentFlashcard}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMarkEasy={() => handleEasyMark(currentFlashcard, current)}
          onMarkDifficult={() => handleDifficultMark(currentFlashcard, current)}
        />
      </div>

      {/* Enhanced Navigation - Mobile First */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Navigation Buttons - Mobile Optimized */}
          <div className="flex items-center justify-between sm:justify-center space-x-3 sm:space-x-4">
            <button
              onClick={handlePrev}
              disabled={flashcards.length <= 1 || isAnimating}
              className="group flex items-center justify-center flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-semibold rounded-lg sm:rounded-xl hover:from-slate-200 hover:to-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform"
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
              <span className="text-sm sm:text-base">Previous</span>
            </button>

            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg sm:rounded-xl border border-blue-200 min-w-[80px] justify-center">
              <span className="font-bold text-base sm:text-lg">
                {current + 1}
              </span>
              <span className="text-blue-600">/</span>
              <span className="font-medium text-sm sm:text-base">
                {flashcards.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={flashcards.length <= 1 || isAnimating}
              className="group flex items-center justify-center flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm sm:text-base">Next</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform"
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

          {/* Quick Navigation Dots - Hidden on very small screens */}
          {flashcards.length > 1 && flashcards.length <= 15 && (
            <div className="hidden xs:flex items-center justify-center space-x-1 sm:space-x-2 overflow-x-auto py-2">
              {flashcards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                    index === current
                      ? "bg-blue-600 scale-125"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          )}

          {/* Mobile Swipe Hint */}
          <div className="flex items-center justify-center text-xs text-slate-400 sm:hidden">
            👈 Swipe to navigate 👉
          </div>

          {/* Keyboard Shortcuts Info - Desktop Only */}
          <div className="hidden sm:flex items-center justify-center space-x-4 md:space-x-6 text-xs text-slate-500 pt-2 border-t border-slate-200">
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

      {/* Study Session Summary - Mobile Optimized */}
      {studyMode && flashcards.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
          <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">
            📈 Session Stats
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {studyStats.correct}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Correct</div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {studyStats.incorrect}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                <span className="hidden sm:inline">Needs Review</span>
                <span className="sm:hidden">Review</span>
              </div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {studyStats.correct + studyStats.incorrect > 0
                  ? Math.round(
                      (studyStats.correct /
                        (studyStats.correct + studyStats.incorrect)) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardList;
