import React, { useState, useEffect, useCallback } from "react";
import FlashcardItem from "./FlashcardItem";
import Card from "../Common/Card";
import Button from "../Common/Button";

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
    }, 160);
  }, [isAnimating, flashcards.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || flashcards.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((cur) => (cur - 1 + flashcards.length) % flashcards.length);
      setIsAnimating(false);
    }, 160);
  }, [isAnimating, flashcards.length]);

  const goToCard = useCallback(
    (index) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 160);
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
      if (deltaX > deltaY && deltaX > 10) {
        setIsSwiping(true);
        e.preventDefault();
      }
    },
    [touchStart]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!touchStart.x || !isSwiping) return;
      const deltaX = e.changedTouches[0].clientX - touchStart.x;
      const threshold = 50;
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlePrev();
        } else {
          handleNext();
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
    setTimeout(handleNext, 350);
  };

  const handleDifficultMark = (flashcard, index) => {
    setStudyStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    if (onMarkDifficult) onMarkDifficult(flashcard, index);
    setTimeout(handleNext, 350);
  };

  const resetStudySession = () => {
    setStudyStats({ correct: 0, incorrect: 0 });
    setCurrent(0);
  };

  if (!flashcards.length) {
    return (
<<<<<<< HEAD
      <Card className="min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-4">🎴</div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          No flashcards yet
        </h3>
        <p className="text-lg max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
          Create your first flashcard to start studying and boost your
          learning experience!
        </p>
        <div className="flex items-center justify-center gap-6 text-base mt-6" style={{ color: "var(--text-secondary)" }}>
          <div className="flex items-center">
            <span className="mr-2">📝</span>
            Create manually
          </div>
          <div className="flex items-center">
            <span className="mr-2">🤖</span>
            AI generated
=======
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] bg-[#18163a]/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-violet-400/20 p-8 mx-2 sm:mx-0">
        <div className="text-center space-y-6">
          <div className="text-7xl mb-4">🎴</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
            No flashcards yet
          </h3>
          <p className="text-violet-300 text-lg max-w-md mx-auto">
            Create your first flashcard to start studying and boost your
            learning experience!
          </p>
          <div className="flex items-center justify-center gap-6 text-base text-violet-300 mt-6">
            <div className="flex items-center">
              <span className="mr-2">📝</span>
              Create manually
            </div>
            <div className="flex items-center">
              <span className="mr-2">🤖</span>
              AI generated
            </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          </div>
        </div>
      </Card>
    );
  }

  const currentFlashcard = flashcards[current];
  const progressPercentage = ((current + 1) / flashcards.length) * 100;

  return (
    <div className="w-full max-w-xl lg:max-w-4xl mx-auto space-y-8 px-1">
      {/* Header + Stats */}
<<<<<<< HEAD
      <Card>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold" style={{ color: "var(--action-primary)" }}>
=======
      <div className="bg-[#18163a]/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-violet-400/20 mb-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold font-inter bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                📚 Study Session
              </h2>
              <button
                onClick={() => setStudyMode(!studyMode)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm shadow-md ${
                  studyMode
<<<<<<< HEAD
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "border-2"
=======
                    ? "bg-emerald-600/30 text-emerald-200 border border-emerald-600/40"
                    : "bg-violet-400/15 text-white border border-violet-400/40"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                }`}
                style={{
                  backgroundColor: studyMode ? undefined : "var(--bg-secondary)",
                  borderColor: studyMode ? undefined : "var(--accent-secondary)",
                  color: studyMode ? undefined : "var(--text-primary)"
                }}
              >
                {studyMode ? "🎯 Study Mode ON" : "📖 Review Mode"}
              </button>
            </div>
            {studyMode &&
              (studyStats.correct > 0 || studyStats.incorrect > 0) && (
                <div className="flex items-center gap-5">
<<<<<<< HEAD
                  <span className="text-emerald-600 font-medium text-base">
                    ✅ {studyStats.correct}
                  </span>
                  <span className="text-red-600 font-medium text-base">
                    ❌ {studyStats.incorrect}
                  </span>
                  <Button
                    onClick={resetStudySession}
                    size="small"
                    variant="ghost"
=======
                  <span className="text-emerald-300 font-medium text-base">
                    ✅ {studyStats.correct}
                  </span>
                  <span className="text-red-300 font-medium text-base">
                    ❌ {studyStats.incorrect}
                  </span>
                  <button
                    onClick={resetStudySession}
                    className="text-xs px-4 py-2 bg-violet-400/20 text-white rounded-xl hover:bg-violet-400/30 border border-violet-400/30 transition shadow"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                  >
                    Reset
                  </Button>
                </div>
              )}
          </div>
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
<<<<<<< HEAD
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Progress
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {current + 1} of {flashcards.length}
              </span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))`
                }}
=======
              <span className="text-xs font-medium text-violet-300">
                Progress
              </span>
              <span className="text-xs font-medium text-violet-300">
                {current + 1} of {flashcards.length}
              </span>
            </div>
            <div className="w-full bg-violet-400/10 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-violet-500 via-blue-500 to-purple-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Flashcard */}
      <div
        className={`transition-all duration-300 ${isAnimating ? "opacity-70 scale-95" : "opacity-100 scale-100"}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
<<<<<<< HEAD
=======
        {isSwiping && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#18163a]/90 text-white px-5 py-3 rounded-xl text-base z-50 pointer-events-none shadow-2xl backdrop-blur-xl">
            Swipe to navigate
          </div>
        )}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        <FlashcardItem
          flashcard={currentFlashcard}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMarkEasy={() => handleEasyMark(currentFlashcard, current)}
          onMarkDifficult={() => handleDifficultMark(currentFlashcard, current)}
        />
      </div>

      {/* Navigation */}
<<<<<<< HEAD
      <Card>
        <div className="flex items-center justify-between gap-6">
          <Button
            onClick={handlePrev}
            disabled={flashcards.length <= 1 || isAnimating}
            variant="secondary"
=======
      <div className="bg-[#18163a]/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-violet-400/20">
        <div className="flex items-center justify-between gap-6">
          <button
            onClick={handlePrev}
            disabled={flashcards.length <= 1 || isAnimating}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-violet-400/30 to-blue-400/15 text-white rounded-xl font-semibold hover:from-violet-400/60 hover:to-blue-400/30 transition shadow-lg disabled:opacity-50"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          >
            <svg
              className="w-5 h-5 mr-2"
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
<<<<<<< HEAD
          </Button>
          <div 
            className="flex items-center px-5 py-3 rounded-xl border-2 min-w-[80px] justify-center font-bold text-lg"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)"
            }}
          >
            {current + 1}
            <span className="mx-2" style={{ color: "var(--text-secondary)" }}>/</span>
            {flashcards.length}
          </div>
          <Button
            onClick={handleNext}
            disabled={flashcards.length <= 1 || isAnimating}
            variant="primary"
=======
          </button>
          <div className="flex items-center px-5 py-3 bg-violet-400/15 text-white rounded-xl border border-violet-400/25 min-w-[80px] justify-center font-bold text-lg">
            {current + 1}
            <span className="mx-2 text-violet-300">/</span>
            {flashcards.length}
          </div>
          <button
            onClick={handleNext}
            disabled={flashcards.length <= 1 || isAnimating}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-violet-600 transition shadow-lg disabled:opacity-50"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          >
            Next
            <svg
              className="w-5 h-5 ml-2"
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
<<<<<<< HEAD
          </Button>
=======
          </button>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        </div>
        {/* Quick Navigation Dots */}
        {flashcards.length > 1 && flashcards.length <= 15 && (
          <div className="flex items-center justify-center mt-4 gap-2 overflow-x-auto py-2">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                  index === current
<<<<<<< HEAD
                    ? "scale-125"
                    : "opacity-40 hover:opacity-70"
                }`}
                style={{
                  backgroundColor: index === current ? "var(--action-primary)" : "var(--accent-secondary)"
                }}
=======
                    ? "bg-gradient-to-r from-violet-500 via-blue-400 to-purple-400 scale-125"
                    : "bg-violet-400/20 hover:bg-violet-400/40"
                }`}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                disabled={isAnimating}
              />
            ))}
          </div>
        )}
        {/* Swipe Hint */}
<<<<<<< HEAD
        <div className="flex items-center justify-center text-xs mt-4 sm:hidden" style={{ color: "var(--text-secondary)" }}>
          👈 Swipe to navigate 👉
        </div>
        {/* Keyboard Shortcuts Info */}
        <div className="hidden sm:flex items-center justify-center gap-6 text-xs pt-2 border-t mt-4" style={{ 
          color: "var(--text-secondary)",
          borderColor: "var(--accent-secondary)"
        }}>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded text-xs font-mono border" style={{ 
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)"
            }}>
=======
        <div className="flex items-center justify-center text-xs text-violet-400 mt-4 sm:hidden">
          👈 Swipe to navigate 👉
        </div>
        {/* Keyboard Shortcuts Info */}
        <div className="hidden sm:flex items-center justify-center gap-6 text-xs text-violet-300 pt-2 border-t border-violet-400/10 mt-4">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-violet-400/10 rounded text-violet-200 font-mono">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              ←
            </kbd>{" "}
            Previous
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <kbd className="px-2 py-1 rounded text-xs font-mono border" style={{ 
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)"
            }}>
=======
            <kbd className="px-2 py-1 bg-violet-400/10 rounded text-violet-200 font-mono">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              →
            </kbd>{" "}
            Next
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <kbd className="px-2 py-1 rounded text-xs font-mono border" style={{ 
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)"
            }}>
=======
            <kbd className="px-2 py-1 bg-violet-400/10 rounded text-violet-200 font-mono">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              Space
            </kbd>{" "}
            Study Mode
          </div>
        </div>
<<<<<<< HEAD
      </Card>
      {/* Study Stats */}
      {studyMode && flashcards.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            📈 Session Stats
          </h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div 
              className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="text-2xl font-bold text-emerald-600">
                {studyStats.correct}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Correct</div>
            </div>
            <div 
              className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="text-2xl font-bold text-red-600">
                {studyStats.incorrect}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Review</div>
            </div>
            <div 
              className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="text-2xl font-bold" style={{ color: "var(--action-primary)" }}>
=======
      </div>
      {/* Study Stats */}
      {studyMode && flashcards.length > 0 && (
        <div className="bg-gradient-to-r from-violet-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl p-6 border border-violet-400/15">
          <h3 className="text-lg font-semibold text-blue-300 mb-4 font-inter">
            📈 Session Stats
          </h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-[#18163a]/80 rounded-xl p-6 shadow">
              <div className="text-2xl font-bold text-emerald-300">
                {studyStats.correct}
              </div>
              <div className="text-xs text-violet-200">Correct</div>
            </div>
            <div className="bg-[#18163a]/80 rounded-xl p-6 shadow">
              <div className="text-2xl font-bold text-red-300">
                {studyStats.incorrect}
              </div>
              <div className="text-xs text-violet-200">Review</div>
            </div>
            <div className="bg-[#18163a]/80 rounded-xl p-6 shadow">
              <div className="text-2xl font-bold text-blue-300">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                {studyStats.correct + studyStats.incorrect > 0
                  ? Math.round(
                      (studyStats.correct /
                        (studyStats.correct + studyStats.incorrect)) *
                        100
                    )
                  : 0}
                %
              </div>
<<<<<<< HEAD
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Accuracy</div>
=======
              <div className="text-xs text-violet-200">Accuracy</div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FlashcardList;
