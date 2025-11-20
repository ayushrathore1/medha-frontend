import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const motivationalQuotes = [
  "Stay focused, you're one step closer!",
  "Learning is a journey, enjoy the ride.",
  "Every expert was once a beginner.",
  "Believe you can and you're halfway there.",
  "Small progress is still progress.",
  "Your potential is endless.",
];

const Loader = ({ fullScreen = false }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-12";

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
        duration: 0.6,
      },
    }),
  };

  const word = "MEDHA";

  return (
    <div className={containerClasses}>
      {/* Logo Animation */}
      <div className="flex space-x-1 mb-8">
        {word.split("").map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)]"
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="h-8 relative w-full max-w-md text-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-[var(--text-secondary)] font-medium italic text-sm md:text-base absolute w-full left-0"
          >
            "{motivationalQuotes[quoteIndex]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loader;
