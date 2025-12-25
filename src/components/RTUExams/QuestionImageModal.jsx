import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaImage } from "react-icons/fa";

/**
 * QuestionImageModal - Modal for viewing question images at full size
 */
const QuestionImageModal = ({ isOpen, imageUrl, questionCode, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FaImage />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Question Image</h3>
                  <p className="text-xs text-slate-500 font-medium">{questionCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  title="Close"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 overflow-auto p-4 bg-slate-50 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={`Question ${questionCode}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border border-slate-200"
                loading="lazy"
              />
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Click outside or press Escape to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuestionImageModal;
