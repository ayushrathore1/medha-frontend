import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

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
      className="bg-[#18163a]/90 backdrop-blur-xl border border-violet-500/15 rounded-3xl shadow-2xl max-w-2xl mx-auto px-8 py-8 space-y-6 font-inter"
    >
      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-violet-300">
          Note Title (Optional)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl text-white font-medium placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-300 focus:outline-none transition-all duration-200 hover:border-violet-500 shadow"
          placeholder="Enter a descriptive title..."
          type="text"
        />
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-blue-300">
          Note Content <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-xl text-white font-medium placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200 hover:border-blue-500 shadow resize-y min-h-[140px] leading-relaxed"
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
          <div className="absolute bottom-3 right-3 text-xs bg-gradient-to-r from-violet-400/15 to-blue-400/10 text-violet-200 px-2 py-1 rounded-xl shadow">
            {content.length} chars
          </div>
        </div>
        {/* Helper Text */}
        <p className="text-xs text-blue-300 flex items-center">
          <span className="mr-1">💡</span>
          Tip: Paste from docs/sites, or write new notes here.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs text-violet-300 font-medium">
          {!subjectId && (
            <span className="flex items-center text-amber-300 font-bold">
              <span className="mr-1">⚠️</span>
              Select a subject first
            </span>
          )}
          {content.trim() && (
            <span className="flex items-center text-emerald-400 font-bold">
              <span className="mr-1">✓</span>
              Ready to save
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          {(title || content) && (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              className="px-4 py-2 text-sm font-semibold text-violet-200 bg-white/10 backdrop-blur-xl border border-violet-400/20 rounded-xl hover:bg-violet-400/20 hover:text-white transition-all duration-200 shadow"
              disabled={saving}
            >
              Clear
            </button>
          )}
          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || !content.trim() || !subjectId}
            className="relative px-6 py-2.5 bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 text-white font-bold rounded-xl hover:scale-[1.05] shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 min-w-[140px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="flex items-center justify-between text-xs text-violet-300">
        <div className="flex items-center gap-5">
          <span className="flex items-center font-bold">
            <span className="mr-1">📝</span>
            Text Note
          </span>
          {title && (
            <span className="flex items-center font-bold">
              <span className="mr-1">🏷️</span>
              Has Title
            </span>
          )}
        </div>
        {content.length > 1000 && (
          <span className="text-blue-300 flex items-center font-bold">
            <span className="mr-1">📄</span>
            Long Note ({Math.ceil(content.length / 1000)}k+ chars)
          </span>
        )}
      </div>
    </form>
  );
};

export default TextNoteForm;
