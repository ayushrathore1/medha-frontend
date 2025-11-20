import React from "react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const NoteModal = ({ note, subject, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-2">
<<<<<<< HEAD
      <Card className="max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-3xl font-bold transition px-2 py-1 rounded-lg active:scale-90 hover:opacity-70"
          style={{ color: "var(--action-primary)" }}
=======
      <div className="bg-[#18163a]/95 backdrop-blur-2xl border border-violet-400/30 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-3xl bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-bold hover:text-white transition px-2 py-1 rounded-lg active:scale-90"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-3">
<<<<<<< HEAD
          <h2 className="font-extrabold text-2xl tracking-tight" style={{ color: "var(--action-primary)" }}>
=======
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-extrabold text-2xl tracking-tight">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            {note.title || note.originalName || "Untitled Note"}
          </h2>
        </div>
<<<<<<< HEAD
        <div className="mb-2" style={{ color: "var(--text-secondary)" }}>
          <span className="font-semibold">Subject:</span>{" "}
          {subject?.name || note.subject || "Unknown"}
        </div>
        <div className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
=======
        <div className="text-violet-300 mb-2">
          <span className="font-semibold">Subject:</span>{" "}
          {subject?.name || note.subject || "Unknown"}
        </div>
        <div className="text-blue-300 text-sm mb-4">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          Created: {new Date(note.createdAt).toLocaleString()}
          <br />
          Updated: {new Date(note.updatedAt).toLocaleString()}
        </div>
        {note.fileUrl && (
          <div className="mb-4">
            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
<<<<<<< HEAD
              className="font-semibold underline"
              style={{ color: "var(--action-primary)" }}
=======
              className="text-blue-400 underline font-semibold"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            >
              View Original File
            </a>
          </div>
        )}
<<<<<<< HEAD
        <div 
          className="border-2 rounded-2xl shadow px-5 py-4 mb-4 max-h-60 overflow-auto"
          style={{ 
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--accent-secondary)"
          }}
        >
          <div className="font-bold mb-2" style={{ color: "var(--action-primary)" }}>
            Note Content:
          </div>
          <div
            className="whitespace-pre-wrap"
            style={{ wordBreak: "break-word", color: "var(--text-primary)" }}
=======
        <div className="bg-gradient-to-br from-violet-400/10 via-blue-400/10 to-purple-400/10 border border-violet-400/25 rounded-2xl shadow px-5 py-4 mb-2 max-h-60 overflow-auto">
          <div className="font-bold mb-2 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Note Content:
          </div>
          <div
            className="whitespace-pre-wrap text-white"
            style={{ wordBreak: "break-word" }}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          >
            {note.content || note.extractedText || "No content."}
          </div>
        </div>
        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </Card>
    </div>
  );
};

export default NoteModal;
