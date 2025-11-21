import React, { useState } from "react";
import FlashcardItem from "./FlashcardItem";
import Card from "../Common/Card";
import Button from "../Common/Button";

const FlashcardList = ({ flashcards, onEdit, onDelete, onMarkDifficulty, studyMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studied, setStudied] = useState({ correct: 0, incorrect: 0 });

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-xl font-semibold" style={{ color: "var(--text-secondary)" }}>
          No flashcards yet. Create some to get started!
        </p>
      </Card>
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

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Flashcards
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
          {studyMode && (
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {studied.correct}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Correct
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {studied.incorrect}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Incorrect
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--action-primary)" }}>
                  {studied.correct + studied.incorrect > 0
                    ? Math.round((studied.correct / (studied.correct + studied.incorrect)) * 100)
                    : 0}
                  %
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Accuracy
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Current Flashcard */}
      <FlashcardItem
        flashcard={currentFlashcard}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Navigation */}
      <Card>
        <div className="flex gap-4 justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
          >
            ← Previous
          </Button>

          {studyMode && (
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  markAsIncorrect();
                  // Just move next, don't mark viewed
                }} 
                variant="secondary"
              >
                Keep Reviewing
              </Button>
              <Button 
                onClick={() => {
                  markAsCorrect();
                  if (onMarkDifficulty) onMarkDifficulty(currentFlashcard._id, "viewed");
                }} 
                variant="success"
              >
                Got it (Viewed)
              </Button>
            </div>
          )}

          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            variant="primary"
          >
            Next →
          </Button>
        </div>

        {studyMode && currentIndex === flashcards.length - 1 && (
          <div className="mt-4 text-center">
            <Button onClick={resetStudy} variant="outline">
              Reset Study Session
            </Button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                background: `linear-gradient(to right, var(--action-primary), var(--accent-secondary))`,
              }}
            />
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
          <span className="font-semibold">Tip:</span> Use arrow keys to navigate
        </div>
      </Card>
    </div>
  );
};

export default FlashcardList;
