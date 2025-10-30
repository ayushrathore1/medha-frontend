import React, { useState } from "react";

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
      return "bg-emerald-600/20 text-emerald-300 border border-emerald-600/20";
    if (flashcard.difficulty === "hard")
      return "bg-red-700/20 text-red-300 border border-red-700/20";
    return "bg-blue-600/20 text-blue-300 border border-blue-600/20";
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8 px-1">
      <div className="bg-[#18163a]/90 backdrop-blur-2xl border border-violet-400/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 group">
        {editMode ? (
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent flex items-center">
                <span className="mr-2">✏️</span>
                Editing Flashcard
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  flashcard.isAIGenerated
                    ? "bg-gradient-to-r from-emerald-400/40 to-blue-400/30 text-white border border-emerald-400/40"
                    : "bg-gradient-to-r from-purple-400/40 to-blue-400/20 text-white border border-purple-400/30"
                }`}
              >
                {flashcard.isAIGenerated ? "🤖 AI Generated" : "✍️ Manual"}
              </span>
            </div>

            <div className="space-y-6">
              {/* Question Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-violet-300">
                  Question <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl font-medium text-white placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-300 focus:outline-none transition-all duration-200 resize-none text-base"
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-blue-300">
                  Answer <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-xl font-medium text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200 resize-none text-base"
                  placeholder="Enter the answer here..."
                  rows={3}
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-blue-300">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-violet-400/20 rounded-xl font-medium text-white placeholder-violet-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200 text-base"
                  placeholder="Enter subject (optional)"
                />
              </div>

              {/* Action Buttons - Mobile Stacked */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-5">
                <button
                  onClick={handleCancel}
                  className="px-5 py-3 text-sm font-semibold text-violet-300 bg-white/10 border border-violet-400/20 rounded-xl hover:bg-violet-400/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!question.trim() || !answer.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl hover:scale-[1.04] shadow-lg duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400 border border-violet-400/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-400/10 to-blue-400/10 px-6 py-4 border-b border-violet-400/15">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor()}`}
                  >
                    {flashcard.difficulty === "easy"
                      ? "😊 Easy"
                      : flashcard.difficulty === "hard"
                        ? "😰 Difficult"
                        : "🤔 Learning"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      flashcard.isAIGenerated
                        ? "bg-gradient-to-r from-emerald-400/40 to-blue-400/20 text-white border border-emerald-400/30"
                        : "bg-gradient-to-r from-purple-400/40 to-blue-400/20 text-white border border-purple-400/30"
                    }`}
                  >
                    {flashcard.isAIGenerated ? "🤖 AI" : "✍️ Manual"}
                  </span>
                </div>
                {flashcard.subject && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-semibold border border-blue-400/20">
                    📚 {flashcard.subject}
                  </span>
                )}
              </div>
            </div>

            {/* Flip Card Container */}
            <div className="relative min-h-[200px] perspective-1000">
              <div
                className={`w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? "rotate-y-180" : ""}`}
                onClick={() => setIsFlipped(!isFlipped)}
                onTouchStart={() => setIsFlipped(!isFlipped)}
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
                <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 flex flex-col justify-center bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-purple-400/10 rounded-3xl">
                  <div className="text-center">
                    <div className="text-xs font-medium text-emerald-300 mb-3 uppercase tracking-wide">
                      Answer
                    </div>
                    <div className="text-lg lg:text-xl font-semibold text-white leading-relaxed mb-5 flex items-center justify-center text-center px-2 min-h-[70px]">
                      {flashcard.answer}
                    </div>
                    <div className="flex justify-center text-blue-400 text-xs">
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
            <div className="px-6 py-4 bg-[#18163a]/80 border-t border-violet-400/10 grid grid-cols-2 sm:flex sm:gap-3 sm:justify-center gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(flashcard._id)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
              >
                🗑️ Delete
              </button>
              {onMarkEasy && (
                <button
                  onClick={() => onMarkEasy(flashcard)}
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
                >
                  😊 Easy
                </button>
              )}
              {onMarkDifficult && (
                <button
                  onClick={() => onMarkDifficult(flashcard)}
                  className="px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-200 border border-orange-400/20 rounded-xl font-semibold hover:scale-[1.06] transition shadow"
                >
                  😰 Difficult
                </button>
              )}
            </div>
          </div>
        )}
      </div>
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
