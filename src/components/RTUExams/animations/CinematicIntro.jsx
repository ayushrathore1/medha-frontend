/**
 * CinematicIntro.jsx - Premium "Apple Style" Intro
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CinematicIntro = ({ title, onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Logo Reveal (0 -> 1.5s)
    // Stage 2: Title Fade In (1.5s -> 3s)
    // Stage 3: Exit (3.5s)
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 2000);
    const t3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3800);

    const handleKey = () => {
      if (onComplete) onComplete();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* MEDHA LOGO ANIMATION */}
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: stage >= 1 ? 1 : 0.8, opacity: stage >= 1 ? 1 : 0 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           className="mb-8 relative"
        >
           <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)]">
              <span className="text-5xl font-bold text-white tracking-tighter">M</span>
           </div>
        </motion.div>

        {/* PRESENTS + TITLE */}
        <AnimatePresence>
          {stage >= 1 && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, duration: 0.8 }}
             >
                <div className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Presents</div>
             </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {stage >= 2 && (
             <motion.h1
               initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
             >
               {title}
             </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Particles */}
      <div className="absolute inset-0 pointer-events-none">
         <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 blur-[100px] rounded-full"
         />
      </div>
    </motion.div>
  );
};

export default CinematicIntro;
