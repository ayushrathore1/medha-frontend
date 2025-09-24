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
      return "bg-green-100 text-green-800 border-green-200";
    if (flashcard.difficulty === "hard")
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 group">
        {editMode ? (
          // Edit Mode - Mobile Optimized
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center">
                <span className="mr-2">✏️</span>
                <span className="hidden sm:inline">Editing Flashcard</span>
                <span className="sm:hidden">Edit Card</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    flashcard.isAIGenerated
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {flashcard.isAIGenerated ? (
                    <>
                      <span className="sm:hidden">🤖 AI</span>
                      <span className="hidden sm:inline">🤖 AI Generated</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">✍️ Manual</span>
                      <span className="hidden sm:inline">✍️ Manual</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Question Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder="Enter the answer here..."
                  rows={3}
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter subject (optional)"
                />
              </div>

              {/* Action Buttons - Mobile Stacked */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg sm:rounded-xl hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!question.trim() || !answer.trim()}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          // View Mode - Mobile First Flip Card Design
          <div className="relative">
            {/* Card Header - Mobile Optimized */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200/50">
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}
                  >
                    {flashcard.difficulty === "easy"
                      ? "😊 Easy"
                      : flashcard.difficulty === "hard"
                        ? "😰 Difficult"
                        : "🤔 Learning"}
                  </span>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      flashcard.isAIGenerated
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-purple-100 text-purple-800 border border-purple-200"
                    }`}
                  >
                    {flashcard.isAIGenerated ? (
                      <>
                        <span className="sm:hidden">🤖</span>
                        <span className="hidden sm:inline">🤖 AI</span>
                      </>
                    ) : (
                      <>
                        <span className="sm:hidden">✍️</span>
                        <span className="hidden sm:inline">✍️ Manual</span>
                      </>
                    )}
                  </span>
                </div>
                {flashcard.subject && (
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200 self-start sm:self-auto">
                    <span className="sm:hidden">📚</span>
                    <span className="hidden xs:inline">📚 </span>
                    {flashcard.subject}
                  </span>
                )}
              </div>
            </div>

            {/* Flip Card Container - Touch Optimized */}
            <div className="relative min-h-[180px] sm:min-h-[200px] md:min-h-[220px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
                onTouchStart={() => setIsFlipped(!isFlipped)}
              >
                {/* Front Side - Question */}
                <div className="absolute inset-0 backface-hidden p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-medium text-blue-600 mb-2 sm:mb-3 uppercase tracking-wide">
                      Question
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 leading-relaxed mb-4 sm:mb-6 min-h-[60px] sm:min-h-[80px] flex items-center justify-center text-center px-2">
                      {flashcard.question}
                    </div>
                    <div className="flex items-center justify-center text-slate-400 text-xs sm:text-sm">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
                      <span className="hidden sm:inline">
                        Click to reveal answer
                      </span>
                      <span className="sm:hidden">Tap for answer</span>
                    </div>
                  </div>
                </div>

                {/* Back Side - Answer */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 p-4 sm:p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-medium text-green-600 mb-2 sm:mb-3 uppercase tracking-wide">
                      Answer
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 leading-relaxed mb-4 sm:mb-6 min-h-[60px] sm:min-h-[80px] flex items-center justify-center text-center px-2">
                      {flashcard.answer}
                    </div>
                    <div className="flex items-center justify-center text-slate-400 text-xs sm:text-sm">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
                      <span className="hidden sm:inline">
                        Click to see question again
                      </span>
                      <span className="sm:hidden">Tap for question</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile First Grid Layout */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-50/50 border-t border-slate-200/50">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-2 sm:justify-center">
                {/* Primary Actions - Full width on mobile */}
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 hover:border-blue-300 transition-all duration-200 text-xs sm:text-sm font-medium"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>

                <button
                  onClick={() => onDelete && onDelete(flashcard._id)}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 hover:border-red-300 transition-all duration-200 text-xs sm:text-sm font-medium"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>

                {/* Difficulty Buttons */}
                {onMarkEasy && (
                  <button
                    onClick={() => onMarkEasy(flashcard)}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 hover:border-green-300 transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <span className="mr-1 sm:mr-1.5">😊</span>
                    Easy
                  </button>
                )}

                {onMarkDifficult && (
                  <button
                    onClick={() => onMarkDifficult(flashcard)}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-200 hover:border-orange-300 transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <span className="mr-1 sm:mr-1.5">😰</span>
                    Difficult
                  </button>
                )}
              </div>
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

        /* Enhanced touch targets for mobile */
        @media (max-width: 640px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default FlashcardItem;
