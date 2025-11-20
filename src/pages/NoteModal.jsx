import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const NoteModal = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {note.title || "Note Details"}
          </h2>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {note.content && (
          <div 
            className="prose prose-sm max-w-none mb-6"
            style={{ color: "var(--text-primary)" }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        )}

        {note.fileUrl && (
          <div className="mb-6">
            <img
              src={note.fileUrl}
              alt="Note"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        )}

        {note.subject && (
          <div className="mb-4">
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "var(--accent-secondary)",
                color: "var(--text-primary)"
              }}
            >
              {note.subject}
            </span>
          </div>
        )}

        {note.createdAt && (
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NoteModal;
