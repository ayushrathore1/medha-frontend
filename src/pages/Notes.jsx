import React, { useEffect, useState, useRef } from "react";
import NoteModal from "./NoteModal";
import TextNoteForm from "../components/Notes/TextNoteForm";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [viewNote, setViewNote] = useState(null);
  const [viewSubject, setViewSubject] = useState(null);

  // Edit state
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);

  // For upload
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${API_BASE}/api/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.message || "Failed to fetch subjects.");
        } else {
          setSubjects(data.subjects || []);
          if (data.subjects && data.subjects.length > 0 && !selectedSubject) {
            setSelectedSubject(data.subjects[0]._id);
          }
        }
      } catch {
        setErrorMsg("Server error fetching subjects.");
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
    // eslint-disable-next-line
  }, [token]);

  // Fetch notes
  useEffect(() => {
    if (!selectedSubject) {
      setNotes([]);
      setLoadingNotes(false);
      return;
    }
    const fetchNotes = async () => {
      setLoadingNotes(true);
      setErrorMsg("");
      try {
        const res = await fetch(
          `${API_BASE}/api/notes?subject=${selectedSubject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.message || "Failed to fetch notes.");
        } else {
          setNotes(data.notes || []);
        }
      } catch {
        setErrorMsg("Server error fetching notes.");
      }
      setLoadingNotes(false);
    };
    fetchNotes();
  }, [token, selectedSubject, uploading]);

  // Edit functions
  const handleEditStart = (note) => {
    setEditingNote(note._id);
    setEditTitle(note.title || "");
    setEditContent(note.content || note.extractedText || "");
  };

  const handleEditCancel = () => {
    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleEditSave = async (noteId) => {
    if (!editContent.trim()) return;
    setUpdating(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          subject: selectedSubject,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to update note.");
      } else {
        setNotes(
          notes.map((note) =>
            note._id === noteId ? { ...note, ...data.note } : note
          )
        );
        setEditingNote(null);
        setEditTitle("");
        setEditContent("");
      }
    } catch {
      setErrorMsg("Server error updating note.");
    }
    setUpdating(false);
  };

  // Delete a note
  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Delete failed.");
        return;
      }
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch {
      setErrorMsg("Server error deleting note.");
    }
  };

  // Upload note file
  const handleUploadNote = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!file || !selectedSubject) {
      setErrorMsg("Select a subject and file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", selectedSubject);
      if (uploadTitle.trim()) formData.append("title", uploadTitle.trim());
      const res = await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Upload failed.");
      } else {
        setFile(null);
        setUploadTitle("");
        setUploading(false);
        setNotes([data.note, ...notes]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch {
      setErrorMsg("Server error uploading note.");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                📚 My Notes
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                Organize and manage your study materials
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-base font-medium" style={{ color: "var(--text-secondary)" }}>
              <span>{notes.length} notes</span>
              <span>•</span>
              <span>{subjects.length} subjects</span>
            </div>
          </div>
        </Card>

        {errorMsg && (
          <Card className="mb-6 border-l-4" style={{ borderLeftColor: "#ef4444", backgroundColor: "#fef2f2" }}>
            <p className="font-bold" style={{ color: "#dc2626" }}>{errorMsg}</p>
          </Card>
        )}

        {/* Subject Selection & Forms */}
        <Card className="mb-10">
          <div className="mb-6">
            <label className="flex items-center text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              <span className="mr-2">🎯</span>
              Select Subject
            </label>
            {loadingSubjects ? (
              <div className="flex items-center gap-2">
                <Loader size="small" />
                <span style={{ color: "var(--text-secondary)" }}>Loading subjects...</span>
              </div>
            ) : !subjects.length ? (
              <Card variant="outline">
                <p style={{ color: "var(--text-secondary)" }}>
                  No subjects available. Create a subject first.
                </p>
              </Card>
            ) : (
              <select
                className="w-full px-4 py-3 rounded-lg border-2 font-medium focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)"
                }}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((subj) => (
                  <option key={subj._id} value={subj._id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-7">
            {/* Text Note Form */}
            <div className="space-y-4">
              <div className="flex items-center text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                <span className="mr-2">✍️</span>
                Create Text Note
              </div>
              <Card variant="outline">
                <TextNoteForm
                  subjectId={selectedSubject}
                  token={token}
                  onNoteCreated={(note) => setNotes([note, ...notes])}
                />
              </Card>
            </div>

            {/* File Upload Form */}
            <div className="space-y-4">
              <div className="flex items-center text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                <span className="mr-2">📎</span>
                Upload File
              </div>
              <Card variant="outline">
                <form onSubmit={handleUploadNote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                      Choose File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="w-full px-3 py-2.5 border-2 border-dashed rounded-lg transition focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "var(--accent-secondary)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)"
                      }}
                      disabled={!selectedSubject || uploading}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 rounded-lg transition focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "var(--accent-secondary)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)"
                      }}
                      placeholder="Enter note title..."
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    loading={uploading}
                    disabled={uploading || !file || !selectedSubject}
                    icon={<span>📤</span>}
                  >
                    Upload Note
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </Card>

        {/* Notes List */}
        <Card>
          {loadingNotes ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader />
              <p className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Loading notes...
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Please wait while we fetch your notes
              </p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                No notes yet
              </h3>
              <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
                Start by creating your first note for this subject
              </p>
              <div className="flex justify-center gap-7">
                <div className="flex items-center text-base" style={{ color: "var(--text-secondary)" }}>
                  <span className="mr-1">✍️</span>
                  Write a text note
                </div>
                <div className="flex items-center text-base" style={{ color: "var(--text-secondary)" }}>
                  <span className="mr-1">📎</span>
                  Upload a file
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  📋 Your Notes ({notes.length})
                </h2>
                <div className="text-base" style={{ color: "var(--text-secondary)" }}>
                  Latest notes shown first
                </div>
              </div>
              {notes.map((note) => (
                <Card key={note._id} variant="outline" hover>
                  {editingNote === note._id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold flex items-center" style={{ color: "var(--text-primary)" }}>
                          <span className="mr-2">✏️</span>
                          Editing Note
                        </h3>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {note.fileType && `${note.fileType.toUpperCase()} • `}
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Note title (optional)"
                        className="w-full px-4 py-2 border-2 rounded-lg transition focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--accent-secondary)",
                          color: "var(--text-primary)"
                        }}
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 resize-y min-h-[120px]"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--accent-secondary)",
                          color: "var(--text-primary)"
                        }}
                        placeholder="Edit your note content..."
                        rows={6}
                      />
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {editContent.length} characters
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="secondary"
                            onClick={handleEditCancel}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleEditSave(note._id)}
                            disabled={updating || !editContent.trim()}
                            loading={updating}
                            icon={<span>💾</span>}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0">
                            {note.fileType
                              ? note.fileType === "pdf"
                                ? "📄"
                                : "🖼️"
                              : "📝"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold truncate" style={{ color: "var(--text-primary)" }}>
                              {note.title || note.originalName || "Untitled Note"}
                            </h3>
                            {note.fileType && (
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ml-1"
                                style={{
                                  backgroundColor: "var(--accent-secondary)",
                                  color: "var(--text-primary)"
                                }}
                              >
                                {note.fileType.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        {(note.content || note.extractedText) && (
                          <Card variant="outline" className="mb-2">
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {note.content
                                ? note.content.substring(0, 200) +
                                  (note.content.length > 200 ? "..." : "")
                                : note.extractedText
                                  ? note.extractedText.substring(0, 200) + "..."
                                  : ""}
                            </p>
                          </Card>
                        )}
                        <div className="flex items-center gap-5 text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                          <div className="flex items-center">
                            <span className="mr-1">🕒</span>
                            {new Date(note.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {note.fileUrl && (
                            <a
                              href={note.fileUrl}
                              className="flex items-center hover:underline transition"
                              style={{ color: "var(--action-primary)" }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="mr-1">🔗</span>
                              View Original
                            </a>
                          )}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex flex-col gap-3 ml-6">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            setViewNote(note);
                            setViewSubject(
                              subjects.find((s) => s._id === note.subject)
                            );
                          }}
                        >
                          👁️ View
                        </Button>
                        {(note.content || note.extractedText) && (
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => handleEditStart(note)}
                          >
                            ✏️ Edit
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleDelete(note._id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
      {viewNote && (
        <NoteModal
          note={viewNote}
          subject={viewSubject}
          onClose={() => setViewNote(null)}
        />
      )}
    </div>
  );
};

export default Notes;
