import React, { useState } from "react";

const API_BASE = "http://localhost:5000";

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
    <form onSubmit={handleSave} className="space-y-4">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600">
          Note Title (Optional)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-sm"
          placeholder="Enter a descriptive title..."
          type="text"
        />
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600">
          Note Content <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-sm resize-y min-h-[140px] leading-relaxed"
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
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded-md">
            {content.length} characters
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-slate-500 flex items-center">
          <span className="mr-1">💡</span>
          Tip: You can paste content directly from documents, websites, or other
          sources
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          {!subjectId && (
            <span className="flex items-center text-amber-600">
              <span className="mr-1">⚠️</span>
              Select a subject first
            </span>
          )}
          {content.trim() && (
            <span className="flex items-center text-green-600">
              <span className="mr-1">✓</span>
              Ready to save
            </span>
          )}
        </div>

        <div className="flex space-x-3">
          {/* Clear Button */}
          {(title || content) && (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-all duration-200"
              disabled={saving}
            >
              Clear
            </button>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || !content.trim() || !subjectId}
            className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center space-x-2 min-w-[140px] justify-center"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Status Indicators */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4 text-slate-500">
          <span className="flex items-center">
            <span className="mr-1">📝</span>
            Text Note
          </span>
          {title && (
            <span className="flex items-center">
              <span className="mr-1">🏷️</span>
              Has Title
            </span>
          )}
        </div>

        {content.length > 1000 && (
          <span className="text-blue-600 flex items-center">
            <span className="mr-1">📄</span>
            Long Note ({Math.ceil(content.length / 1000)}k+ chars)
          </span>
        )}
      </div>
    </form>
  );
};

export default TextNoteForm;
