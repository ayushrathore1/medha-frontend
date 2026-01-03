import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog } from 'react-icons/fa';
import CursorSettingsPanel from './CursorSettingsPanel';

const QuickSettingsFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[50]" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-16 right-0 w-80 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FaCog className="animate-spin-slow" />
              <h3 className="font-bold text-slate-800">Quick Settings</h3>
            </div>
            
            <CursorSettingsPanel />
            
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Adjust interface physics and responsiveness
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${
          isOpen 
            ? 'bg-indigo-600 text-white shadow-indigo-500/30' 
            : 'bg-white text-slate-600 hover:text-indigo-600 border border-slate-200'
        }`}
      >
        <FaCog className={`text-xl transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  );
};

export default QuickSettingsFab;
