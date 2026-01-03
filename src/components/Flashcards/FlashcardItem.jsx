import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../Common/Button";
import { FaPen, FaTrash, FaCheck, FaXmark } from "react-icons/fa6";

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
      <div className="p-6 rounded-2xl shadow-xl border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Question</label>
            <textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 font-medium min-h-[80px]"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Answer</label>
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 font-medium min-h-[120px]"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="primary" fullWidth size="sm">Save Changes</Button>
            <Button onClick={handleCancel} variant="ghost" fullWidth size="sm">Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <motion.div
        className="relative h-[400px] w-full cursor-pointer preserve-3d"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 backface-hidden rounded-3xl shadow-2xl border p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden", backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
        >
          <div className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
            Question
          </div>
          <div className="text-2xl md:text-3xl font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
            {flashcard.question}
          </div>
          <div className="absolute bottom-6 text-sm font-semibold flex items-center gap-2" style={{ color: "var(--action-primary)" }}>
            Click to flip ↻
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-[var(--action-primary)]/10 to-[var(--action-hover)]/10 rounded-3xl shadow-2xl border p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderColor: "var(--border-default)" }}
        >
          <div className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--action-primary)" }}>
            Answer
          </div>
          <div className="text-xl md:text-2xl font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {flashcard.answer}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-8 px-4">
        <div className="flex gap-2">
           <button 
             onClick={() => setIsEditing(true)} 
             className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
             style={{ color: "var(--text-tertiary)" }}
             title="Edit Card"
           >
             <FaPen size={14}/>
           </button>
           <button 
             onClick={() => onDelete && onDelete(flashcard._id)} 
             className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-secondary)] hover:text-red-600"
             style={{ color: "var(--text-tertiary)" }}
             title="Delete Card"
           >
             <FaTrash size={14}/>
           </button>
        </div>

        {flashcard.isGenerated && (
           <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: "var(--action-primary)", backgroundColor: "var(--action-primary)", bgOpacity: 0.1 }}>
             AI Generated
           </span>
        )}
      </div>
    </div>
  );
};

export default FlashcardItem;
