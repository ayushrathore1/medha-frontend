import React, { useState } from "react";
import Button from "../Common/Button";

const TextNoteForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ title, content });
    }
    setTitle("");
    setContent("");
  };

  const characterCount = content.length;
  const maxCharacters = 5000;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-bold text-slate-700">
          Note Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
          placeholder="Enter note title..."
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-slate-700">
          Note Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all min-h-[150px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400 resize-none"
          placeholder="Start typing your notes here..."
          maxLength={maxCharacters}
          required
        />
        <div className={`text-xs text-right mt-1 font-semibold ${
          characterCount > maxCharacters * 0.9 ? "text-red-500" : "text-slate-400"
        }`}>
          {characterCount} / {maxCharacters} chars
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" fullWidth className="shadow-lg shadow-indigo-500/20">
          Save Note
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TextNoteForm;
