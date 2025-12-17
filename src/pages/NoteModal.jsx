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
            {/* Check if it's a PDF */}
            {note.fileType === "application/pdf" || note.fileUrl?.toLowerCase().includes('.pdf') ? (
              <div>
                {/* Use Google Docs Viewer to display PDF inline */}
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.fileUrl)}&embedded=true`}
                  title="PDF Preview"
                  className="w-full h-[600px] rounded-xl border-2"
                  style={{ borderColor: "var(--accent-secondary)" }}
                  frameBorder="0"
                />
                <div className="flex gap-3 mt-4">
                  <a 
                    href={note.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: "var(--action-primary)" }}
                  >
                    📄 Open in New Tab
                  </a>
                  <a 
                    href={note.fileUrl} 
                    download
                    className="inline-block px-4 py-2 rounded-lg font-semibold border-2"
                    style={{ 
                      borderColor: "var(--action-primary)",
                      color: "var(--action-primary)"
                    }}
                  >
                    ⬇️ Download
                  </a>
                </div>
              </div>
            ) : (
              <img
                src={note.fileUrl}
                alt="Note"
                className="w-full rounded-xl shadow-lg"
              />
            )}
          </div>
        )}

        {/* Metadata section */}
        <div className="flex flex-wrap gap-3 items-center mt-4 pt-4 border-t" style={{ borderColor: "var(--accent-secondary)" }}>
          {/* Owner */}
          {note.owner && (
            <span 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)"
              }}
            >
              👤 {note.owner.name || note.owner.email?.split("@")[0] || "Unknown"}
            </span>
          )}
          
          {/* Subject */}
          {note.subject && (
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "var(--accent-secondary)",
                color: "var(--text-primary)"
              }}
            >
              📚 {typeof note.subject === 'object' ? note.subject.name : note.subject}
            </span>
          )}

          {/* Visibility */}
          <span 
            className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: note.isPublic ? "#dcfce7" : "#e0e7ff",
              color: note.isPublic ? "#166534" : "#3730a3"
            }}
          >
            {note.isPublic ? "🌍 Public" : "🔒 Private"}
          </span>

          {/* Date */}
          {note.createdAt && (
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              📅 {new Date(note.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NoteModal;
