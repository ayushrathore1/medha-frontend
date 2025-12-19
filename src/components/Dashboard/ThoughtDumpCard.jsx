import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFeather, FaCheck } from 'react-icons/fa';

const ThoughtDumpCard = ({ className = '' }) => {
  const [thought, setThought] = useState('');
  const [showCleared, setShowCleared] = useState(false);
  const textareaRef = useRef(null);

  // Auto-clear thoughts after 2 minutes of inactivity
  useEffect(() => {
    if (!thought) return;
    
    const timer = setTimeout(() => {
      setThought('');
      setShowCleared(true);
      setTimeout(() => setShowCleared(false), 2000);
    }, 120000); // 2 minutes

    return () => clearTimeout(timer);
  }, [thought]);

  const handleClear = () => {
    setThought('');
    setShowCleared(true);
    setTimeout(() => setShowCleared(false), 2000);
    textareaRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${className}`}
    >
      <div className="relative h-full flex flex-col bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-2xl border border-sky-100/60 shadow-sm overflow-hidden p-4">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sky-100/40 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg shadow-sm">
            <FaFeather className="text-white text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              Overthinking? <span className="text-sky-600 font-semibold">Write it here</span> & let go ✨
            </p>
          </div>
        </div>

        {/* Text Input - Flexible height */}
        <div className="relative flex-1 min-h-[200px]">
          <textarea
            ref={textareaRef}
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Release your thoughts... Let your mind breathe. Write whatever comes to you — worries, ideas, frustrations. This is your private space to unload and refocus."
            className="w-full h-full bg-white/70 border border-sky-100 rounded-xl px-4 py-3 text-slate-600 placeholder-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-200 transition-all"
          />
          
          {/* Clear button */}
          <AnimatePresence>
            {thought && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FaCheck size={10} />
                Release & Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Cleared confirmation */}
        <AnimatePresence>
          {showCleared && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-xs text-emerald-500 font-medium"
            >
              ✨ Mind cleared. Focus restored.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy note - subtle but visible */}
        <p className="mt-3 text-center text-[10px] text-sky-400/70 select-none">
          🔒 Private • Vanishes automatically after 2 min
        </p>
      </div>
    </motion.div>
  );
};

export default ThoughtDumpCard;
