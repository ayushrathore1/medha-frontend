import React from "react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const NoteModal = ({ note, subject, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-2">
      <Card className="max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-3xl font-bold transition px-2 py-1 rounded-lg active:scale-90 hover:opacity-70"
          style={{ color: "var(--action-primary)" }}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-3">
          <h2 className="font-extrabold text-2xl tracking-tight" style={{ color: "var(--action-primary)" }}>
            {note.title || note.originalName || "Untitled Note"}
          </h2>
        </div>
        <div className="mb-2" style={{ color: "var(--text-secondary)" }}>
          <span className="font-semibold">Subject:</span>{" "}
          {subject?.name || note.subject || "Unknown"}
        </div>
        <div className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
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
              className="font-semibold underline"
              style={{ color: "var(--action-primary)" }}
            >
              View Original File
            </a>
          </div>
        )}
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
