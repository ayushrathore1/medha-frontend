import React, { useState } from "react";
import Card from "../Common/Card";
import Button from "../Common/Button";

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
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    if (flashcard.difficulty === "hard")
      return "bg-red-100 text-red-700 border-red-300";
    return "bg-blue-100 text-blue-700 border-blue-300";
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8 px-1">
      <Card className="overflow-hidden">
        {editMode ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center" style={{ color: "var(--action-primary)" }}>
                <span className="mr-2">✏️</span>
                Editing Flashcard
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  flashcard.isAIGenerated
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-purple-100 text-purple-700 border border-purple-300"
                }`}
              >
                {flashcard.isAIGenerated ? "🤖 AI Generated" : "✍️ Manual"}
              </span>
            </div>

            <div className="space-y-6">
              {/* Question Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 resize-none text-base"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 resize-none text-base"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Enter the answer here..."
                  rows={3}
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Enter subject (optional)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-5">
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!question.trim() || !answer.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Card Header */}
            <div className="px-6 py-4 border-b" style={{ 
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)"
            }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor()}`}
                  >
                    {flashcard.difficulty === "easy"
                      ? "😊 Easy"
                      : flashcard.difficulty === "hard"
                        ? "😰 Difficult"
                        : "🤔 Learning"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      flashcard.isAIGenerated
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-purple-100 text-purple-700 border-purple-300"
                    }`}
                  >
                    {flashcard.isAIGenerated ? "🤖 AI" : "✍️ Manual"}
                  </span>
                </div>
                {flashcard.subject && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-300">
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
              )}
            </div>
          </div>
        )}
      </Card>
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
