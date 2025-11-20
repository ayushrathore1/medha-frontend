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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          className="block mb-2 font-semibold text-lg"
          style={{ color: "var(--text-primary)" }}
        >
          Note Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
          placeholder="Enter note title..."
          required
        />
      </div>

      <div>
        <label
          className="block mb-2 font-semibold text-lg"
          style={{ color: "var(--text-primary)" }}
        >
          Note  Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all min-h-[200px] focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
          placeholder="Write your notes here..."
          maxLength={maxCharacters}
          required
        />
        <div
          className="text-sm text-right mt-2"
          style={{
            color:
              characterCount > maxCharacters * 0.9
                ? "var(--action-secondary)"
                : "var(--text-secondary)",
          }}
        >
          {characterCount} / {maxCharacters} characters
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" fullWidth>
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
