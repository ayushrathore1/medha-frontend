import React, { useState } from "react";
import Button from "../Common/Button";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

const TextNoteForm = ({ subjectId, onNoteCreated, token }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim() || !subjectId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/notes/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, subject: subjectId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save note.");
      } else {
        setTitle("");
        setContent("");
        onNoteCreated && onNoteCreated(data.note);
        alert("Note saved!");
      }
    } catch {
      alert("Server error saving text note.");
    }
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-5"
    >
      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Note Title (Optional)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
          placeholder="Enter a descriptive title..."
          type="text"
        />
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Note Content <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm resize-y min-h-[140px] leading-relaxed"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
            placeholder="Start typing your note here... 

You can paste content from anywhere or write directly. This supports:
• Text formatting
• Multiple paragraphs
• Lists and bullet points
• Code snippets"
            required
            rows={6}
          />
          {/* Character Counter */}
          <div 
            className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-xl shadow-sm"
            style={{ 
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)"
            }}
          >
            {content.length} chars
          </div>
        </div>
        {/* Helper Text */}
        <p className="text-xs flex items-center" style={{ color: "var(--text-secondary)" }}>
          <span className="mr-1">💡</span>
          Tip: Paste from docs/sites, or write new notes here.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs font-medium">
          {!subjectId && (
            <span className="flex items-center text-amber-500 font-bold">
              <span className="mr-1">⚠️</span>
              Select a subject first
            </span>
          )}
          {content.trim() && (
            <span className="flex items-center text-emerald-500 font-bold">
              <span className="mr-1">✓</span>
              Ready to save
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          {(title || content) && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              disabled={saving}
            >
              Clear
            </Button>
          )}
          {/* Save Button */}
          <Button
            type="submit"
            disabled={saving || !content.trim() || !subjectId}
            loading={saving}
            icon={<span>💾</span>}
          >
            Save Note
          </Button>
        </div>
      </div>

      {/* Form Status Indicators */}
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
        <div className="flex items-center gap-5">
          <span className="flex items-center font-semibold">
            <span className="mr-1">📝</span>
            Text Note
          </span>
          {title && (
            <span className="flex items-center font-semibold">
              <span className="mr-1">🏷️</span>
              Has Title
            </span>
          )}
        </div>
        {content.length > 1000 && (
          <span className="flex items-center font-semibold">
            <span className="mr-1">📄</span>
            Long Note ({Math.ceil(content.length / 1000)}k+ chars)
          </span>
        )}
      </div>
    </form>
  );
};

export default TextNoteForm;
