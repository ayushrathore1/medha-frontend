import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../Common/Button";

const FlashcardItem = ({ flashcard, onEdit, onDelete, onMarkDifficulty }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(flashcard.question);
  const [editedAnswer, setEditedAnswer] = useState(flashcard.answer);

  const handleSave = () => {
    if (onEdit) {
      onEdit(flashcard._id, { question: editedQuestion, answer: editedAnswer });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuestion(flashcard.question);
    setEditedAnswer(flashcard.answer);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className="p-6 rounded-2xl border-2"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--accent-secondary)",
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Question
            </label>
            <input
              type="text"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Answer
            </label>
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 font-medium min-h-[120px] focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="primary" fullWidth>
              Save
            </Button>
            <Button onClick={handleCancel} variant="ghost" fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        className="relative h-64 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="absolute w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-6 rounded-2xl border-2"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
              QUESTION
            </div>
            <div className="text-2xl font-bold text-center" style={{ color: "var(--text-primary)" }}>
              {flashcard.question}
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-6 rounded-2xl border-2"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
              ANSWER
            </div>
            <div className="text-lg text-center" style={{ color: "var(--text-primary)" }}>
              {flashcard.answer}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button onClick={() => setIsEditing(true)} variant="outline" size="small">
          Edit
        </Button>
        <Button onClick={() => onDelete && onDelete(flashcard._id)} variant="danger" size="small">
          Delete
        </Button>
        {!flashcard.viewed && onMarkDifficulty && (
           <Button onClick={() => onMarkDifficulty(flashcard._id, "viewed")} variant="success" size="small">
             Mark as Viewed
           </Button>
        )}
        {flashcard.viewed && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center">
                ✓ Viewed
            </span>
        )}
      </div>

      {/* Tags */}
      {flashcard.difficulty && (
        <div className="mt-3 flex gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            {flashcard.topicName || "General"}
          </span>
          {flashcard.isGenerated && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
            >
              AI Generated
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardItem;
