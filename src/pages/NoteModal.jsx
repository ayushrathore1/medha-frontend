import React from "react";

const NoteModal = ({ note, subject, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black/40 flex items-center justify-center px-2">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative border-blue-200 border">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-blue-700 hover:text-red-500 font-bold"
        >
          ×
        </button>
        <div className="mb-2">
          <span className="text-blue-700 font-bold text-2xl">
            {note.title || note.originalName || "Untitled Note"}
          </span>
        </div>
        <div className="text-blue-900 mb-1">
          <span className="font-semibold">Subject: </span>
          <span>{subject?.name || note.subject || "Unknown"}</span>
        </div>
        <div className="text-gray-500 text-sm mb-2">
          Created: {new Date(note.createdAt).toLocaleString()}
          <br />
          Updated: {new Date(note.updatedAt).toLocaleString()}
        </div>
        {note.fileUrl && (
          <div className="mb-2">
            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Original File
            </a>
          </div>
        )}
        <div className="bg-blue-50 border border-blue-100 p-3 rounded mb-4 max-h-60 overflow-auto">
          <div className="font-bold mb-1 text-blue-500">Note Content:</div>
          <div
            className="whitespace-pre-wrap text-blue-900"
            style={{ wordBreak: "break-word" }}
          >
            {note.content || note.extractedText || "No content."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
