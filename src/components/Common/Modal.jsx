import React from "react";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Glassy animated modal card */}
      <div className="bg-[#18163a]/95 backdrop-blur-xl border border-violet-400/15 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto animate-modal-pop">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-violet-400 text-2xl font-bold hover:text-white transition px-2 py-1 rounded-lg active:scale-90"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="text-white/95 font-inter">{children}</div>
        {actions && (
          <div className="mt-6 flex justify-end gap-3">{actions}</div>
        )}
      </div>
      <style>
        {`
        .animate-modal-pop {
          animation: modalPopIn 0.38s cubic-bezier(.22,1,.36,1);
        }
        @keyframes modalPopIn {
          from { opacity: 0; transform: scale(0.75);}
          to { opacity: 1; transform: scale(1);}
        }
        `}
      </style>
    </div>
  );
};

export default Modal;
