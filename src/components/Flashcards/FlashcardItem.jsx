<<<<<<< HEAD
import React, { useState } from "react";
import Card from "../Common/Card";
import Button from "../Common/Button";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

const FlashcardItem = ({
  flashcard,
  onUpdate,
  onDelete,
  onMarkEasy,
  onMarkDifficult,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [question, setQuestion] = useState(flashcard.question);
  const [answer, setAnswer] = useState(flashcard.answer);
  const [subject, setSubject] = useState(flashcard.subject);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
  }, [flashcard._id]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(flashcard._id, question, answer, subject);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);
    setSubject(flashcard.subject);
    setEditMode(false);
  };

  const getDifficultyColor = () => {
    if (flashcard.difficulty === "easy")
<<<<<<< HEAD
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    if (flashcard.difficulty === "hard")
      return "bg-red-100 text-red-700 border-red-300";
    return "bg-blue-100 text-blue-700 border-blue-300";
=======
      return "bg-emerald-600/20 text-emerald-300 border border-emerald-600/20";
    if (flashcard.difficulty === "hard")
      return "bg-red-700/20 text-red-300 border border-red-700/20";
    return "bg-blue-600/20 text-blue-300 border border-blue-600/20";
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8 px-1">
<<<<<<< HEAD
      <Card className="overflow-hidden">
        {editMode ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center" style={{ color: "var(--action-primary)" }}>
=======
      <div className="bg-[#18163a]/90 backdrop-blur-2xl border border-violet-400/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 group">
        {editMode ? (
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent flex items-center">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                <span className="mr-2">✏️</span>
                Editing Flashcard
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  flashcard.isAIGenerated
<<<<<<< HEAD
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-purple-100 text-purple-700 border border-purple-300"
=======
                    ? "bg-gradient-to-r from-emerald-400/40 to-blue-400/30 text-white border border-emerald-400/40"
                    : "bg-gradient-to-r from-purple-400/40 to-blue-400/20 text-white border border-purple-400/30"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                }`}
              >
                {flashcard.isAIGenerated ? "🤖 AI Generated" : "✍️ Manual"}
              </span>
            </div>

            <div className="space-y-6">
              {/* Question Input */}
              <div className="space-y-2">
<<<<<<< HEAD
                <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Question <span className="text-red-500">*</span>
=======
                <label className="block text-sm font-semibold text-violet-300">
                  Question <span className="text-red-400">*</span>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
<<<<<<< HEAD
                  className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 resize-none text-base"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
=======
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl font-medium text-white placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-300 focus:outline-none transition-all duration-200 resize-none text-base"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
<<<<<<< HEAD
                <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Answer <span className="text-red-500">*</span>
=======
                <label className="block text-sm font-semibold text-blue-300">
                  Answer <span className="text-red-400">*</span>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
<<<<<<< HEAD
                  className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 resize-none text-base"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
=======
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-xl font-medium text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200 resize-none text-base"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                  placeholder="Enter the answer here..."
                  rows={3}
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
<<<<<<< HEAD
                <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
=======
                <label className="block text-sm font-semibold text-blue-300">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
<<<<<<< HEAD
                  className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
=======
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-violet-400/20 rounded-xl font-medium text-white placeholder-violet-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200 text-base"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                  placeholder="Enter subject (optional)"
                />
              </div>

<<<<<<< HEAD
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-5">
                <Button
                  onClick={handleCancel}
                  variant="ghost"
=======
              {/* Action Buttons - Mobile Stacked */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-5">
                <button
                  onClick={handleCancel}
                  className="px-5 py-3 text-sm font-semibold text-violet-300 bg-white/10 border border-violet-400/20 rounded-xl hover:bg-violet-400/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-200"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!question.trim() || !answer.trim()}
<<<<<<< HEAD
=======
                  className="px-5 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl hover:scale-[1.04] shadow-lg duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400 border border-violet-400/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Card Header */}
<<<<<<< HEAD
            <div className="px-6 py-4 border-b" style={{ 
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)"
            }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor()}`}
=======
            <div className="bg-gradient-to-r from-violet-400/10 to-blue-400/10 px-6 py-4 border-b border-violet-400/15">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor()}`}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                  >
                    {flashcard.difficulty === "easy"
                      ? "😊 Easy"
                      : flashcard.difficulty === "hard"
                        ? "😰 Difficult"
                        : "🤔 Learning"}
                  </span>
                  <span
<<<<<<< HEAD
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      flashcard.isAIGenerated
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-purple-100 text-purple-700 border-purple-300"
=======
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      flashcard.isAIGenerated
                        ? "bg-gradient-to-r from-emerald-400/40 to-blue-400/20 text-white border border-emerald-400/30"
                        : "bg-gradient-to-r from-purple-400/40 to-blue-400/20 text-white border border-purple-400/30"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                    }`}
                  >
                    {flashcard.isAIGenerated ? "🤖 AI" : "✍️ Manual"}
                  </span>
                </div>
                {flashcard.subject && (
<<<<<<< HEAD
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-300">
=======
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-semibold border border-blue-400/20">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                    📚 {flashcard.subject}
                  </span>
                )}
              </div>
            </div>

            {/* Flip Card Container */}
<<<<<<< HEAD
            <div className="relative min-h-[200px] perspective-1000">
              <div
                className={`w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? "rotate-y-180" : ""}`}
                onClick={() => setIsFlipped(!isFlipped)}
                onTouchStart={() => setIsFlipped(!isFlipped)}
              >
                {/* Front Side - Question */}
                <div 
                  className="absolute inset-0 backface-hidden p-6 flex flex-col justify-center rounded-3xl"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                      Question
                    </div>
                    <div className="text-lg lg:text-xl font-semibold leading-relaxed mb-5 flex items-center justify-center text-center px-2 min-h-[70px]" style={{ color: "var(--text-primary)" }}>
                      {flashcard.question}
                    </div>
                    <div className="flex justify-center text-xs" style={{ color: "var(--action-primary)" }}>
=======
            <div 
              className="relative min-h-[200px] perspective-1000 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
              >
                {/* Front Side - Question */}
                <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-center bg-[#161639]/80 rounded-3xl">
                  <div className="text-center">
                    <div className="text-xs font-medium text-violet-300 mb-3 uppercase tracking-wide">
                      Question
                    </div>
                    <div className="text-lg lg:text-xl font-semibold text-white leading-relaxed mb-5 flex items-center justify-center text-center px-2 min-h-[70px]">
                      {flashcard.question}
                    </div>
                    <div className="flex justify-center text-blue-400 text-xs">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Click/tap to reveal answer
                    </div>
                  </div>
                </div>

                {/* Back Side - Answer */}
<<<<<<< HEAD
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 p-6 flex flex-col justify-center rounded-3xl"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium text-emerald-600 mb-3 uppercase tracking-wide">
                      Answer
                    </div>
                    <div className="text-lg lg:text-xl font-semibold leading-relaxed mb-5 flex items-center justify-center text-center px-2 min-h-[70px]" style={{ color: "var(--text-primary)" }}>
                      {flashcard.answer}
                    </div>
                    <div className="flex justify-center text-xs" style={{ color: "var(--action-primary)" }}>
=======
                <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 flex flex-col justify-center bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-purple-400/10 rounded-3xl">
                  <div className="text-center">
                    <div className="text-xs font-medium text-emerald-300 mb-3 uppercase tracking-wide">
                      Answer
                    </div>
                    <div className="text-lg lg:text-xl font-semibold text-white leading-relaxed mb-5 flex items-center justify-center text-center px-2 min-h-[70px]">
                      {flashcard.answer}
                    </div>
                    <div className="flex justify-center text-blue-400 text-xs">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Click/tap to see question
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
<<<<<<< HEAD
            <div 
              className="px-6 py-4 border-t grid grid-cols-2 sm:flex sm:gap-3 sm:justify-center gap-2"
              style={{ 
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--accent-secondary)"
              }}
            >
              <Button
                onClick={() => setEditMode(true)}
                variant="secondary"
                size="small"
              >
                ✏️ Edit
              </Button>
              <Button
                onClick={() => onDelete && onDelete(flashcard._id)}
                variant="danger"
                size="small"
              >
                🗑️ Delete
              </Button>
              {onMarkEasy && (
                <Button
                  onClick={() => onMarkEasy(flashcard)}
                  variant="success"
                  size="small"
                >
                  😊 Easy
                </Button>
              )}
              {onMarkDifficult && (
                <Button
                  onClick={() => onMarkDifficult(flashcard)}
                  size="small"
                  className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-300"
                >
                  😰 Difficult
                </Button>
=======
            <div className="px-6 py-4 bg-[#18163a]/80 border-t border-violet-400/10 grid grid-cols-2 sm:flex sm:gap-3 sm:justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMode(true);
                }}
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
              >
                ✏️ Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(flashcard._id);
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
              >
                🗑️ Delete
              </button>
              {onMarkEasy && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkEasy(flashcard);
                  }}
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
                >
                  😊 Easy
                </button>
              )}
              {onMarkDifficult && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkDifficult(flashcard);
                  }}
                  className="px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-200 border border-orange-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
                >
                  😰 Difficult
                </button>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              )}
            </div>
          </div>
        )}
<<<<<<< HEAD
      </Card>
=======
      </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardItem;
