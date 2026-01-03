import React, { useState } from "react";
import FlashcardItem from "./FlashcardItem";
import Card from "../Common/Card";
import Button from "../Common/Button";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaCheck, FaXmark, FaArrowRotateLeft } from "react-icons/fa6";

const FlashcardList = ({ flashcards, onEdit, onDelete, onMarkDifficulty, studyMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studied, setStudied] = useState({ correct: 0, incorrect: 0 });

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <p className="text-xl font-bold text-slate-400">
          No flashcards in this deck yet.
        </p>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markAsCorrect = () => {
    setStudied({ ...studied, correct: studied.correct + 1 });
    handleNext();
  };

  const markAsIncorrect = () => {
    setStudied({ ...studied, incorrect: studied.incorrect + 1 });
    handleNext();
  };

  const resetStudy = () => {
    setCurrentIndex(0);
    setStudied({ correct: 0, incorrect: 0 });
  };

  const currentFlashcard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header Stats */}
      <div className="flex items-center justify-between">
         <div className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
            Card {currentIndex + 1} of {flashcards.length}
         </div>
         {studyMode && (
            <div className="flex gap-4 text-xs font-bold">
               <span className="px-2 py-1 rounded bg-[var(--color-success-bg)]/20 text-[var(--color-success-text)]">Known: {studied.correct}</span>
               <span className="px-2 py-1 rounded bg-[var(--color-danger-bg)]/20 text-[var(--color-danger-text)]">Review: {studied.incorrect}</span>
            </div>
         )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
         <motion.div 
           className="h-full"
           style={{ backgroundColor: "var(--action-primary)" }}
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 0.3 }}
         />
      </div>

      {/* The Logical Card */}
      <div className="min-h-[450px] flex flex-col justify-center">
         <FlashcardItem
            flashcard={currentFlashcard}
            onEdit={onEdit}
            onDelete={onDelete}
         />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6">
         
         {studyMode ? (
            <div className="flex gap-4 w-full max-w-sm">
               <Button 
                 onClick={markAsIncorrect}
                 className="flex-1 border bg-[var(--bg-primary)] border-[var(--color-danger-bg)]/30 text-[var(--color-danger-text)] hover:bg-[var(--color-danger-bg)]/10 hover:border-[var(--color-danger-bg)]/50 shadow-lg shadow-[var(--color-danger-bg)]/10"
                 size="lg"
               >
                 <FaXmark className="mr-2"/> Still Learning
               </Button>
               <Button 
                 onClick={() => {
                   markAsCorrect();
                   if (onMarkDifficulty) onMarkDifficulty(currentFlashcard._id, "viewed");
                 }} 
                 className="flex-1 text-white shadow-lg shadow-[var(--color-success-bg)]/20 border-0 bg-[var(--color-success-bg)] hover:bg-[var(--color-success-bg)]/90"
                 size="lg"
               >
                 <FaCheck className="mr-2"/> Got It
               </Button>
            </div>
         ) : (
            <div className="flex gap-4">
               <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="secondary" className="rounded-full px-6">
                 <FaArrowLeft />
               </Button>
               <Button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} variant="primary" className="rounded-full px-8">
                 Next Card <FaArrowRight className="ml-2"/>
               </Button>
            </div>
         )}

         {currentIndex === flashcards.length - 1 && studyMode && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <Button onClick={resetStudy} variant="ghost">
                 <FaArrowRotateLeft className="mr-2"/> Restart Deck
               </Button>
            </motion.div>
         )}
      </div>

    </div>
  );
};

export default FlashcardList;
