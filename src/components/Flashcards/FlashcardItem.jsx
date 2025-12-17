import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../Common/Button";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

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
      <div className="p-6 bg-white rounded-2xl shadow-xl border border-indigo-100">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-slate-700">Question</label>
            <textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium min-h-[80px]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-slate-700">Answer</label>
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium min-h-[120px]"
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
          className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-6 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Question
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
            {flashcard.question}
          </div>
          <div className="absolute bottom-6 text-sm font-semibold text-indigo-500 flex items-center gap-2">
            Click to flip ↻
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-6 left-6 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Answer
          </div>
          <div className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
            {flashcard.answer}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-8 px-4">
        <div className="flex gap-2">
           <button 
             onClick={() => setIsEditing(true)} 
             className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
             title="Edit Card"
           >
             <FaPen size={14}/>
           </button>
           <button 
             onClick={() => onDelete && onDelete(flashcard._id)} 
             className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
             title="Delete Card"
           >
             <FaTrash size={14}/>
           </button>
        </div>

        {flashcard.isGenerated && (
           <span className="text-xs font-bold text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full">
             AI Generated
           </span>
        )}
      </div>
    </div>
  );
};

export default FlashcardItem;
