import React, { useEffect, useState, useRef } from "react";
import NoteModal from "./NoteModal";
import TextNoteForm from "../components/Notes/TextNoteForm";

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
    <div className="min-h-screen bg-[#10101a] font-inter relative overflow-x-hidden pt-20">
      {" "}
      {/* pt-20 fixes hiding behind navbar */}
      {/* Subtle glass blobs, only at the sides */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-14 left-1/2 -translate-x-1/2 w-2/5 h-[190px] 
          bg-gradient-to-r from-blue-500/10 via-blue-400/10 to-transparent rounded-full blur-2xl opacity-5"
        />
        <div className="absolute right-0 top-[23%] w-72 h-48 bg-gradient-to-br from-blue-300/7 to-fuchsia-400/7 rounded-full blur-2xl opacity-5" />
      </div>
      {/* Header */}
      <div className="bg-[#18192f]/90 backdrop-blur-xl border-b border-blue-800/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-7">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-1">
                📚 My Notes
              </h1>
              <p className="text-blue-200">
                Organize and manage your study materials
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-base text-blue-100 font-medium">
              <span>{notes.length} notes</span>
              <span>•</span>
              <span>{subjects.length} subjects</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {errorMsg && (
          <div className="mb-6 bg-gradient-to-r from-red-700/30 to-red-400/10 border-l-4 border-red-700 p-4 rounded-2xl shadow-lg">
            <p className="text-base text-red-100 font-bold">{errorMsg}</p>
          </div>
        )}

        {/* Subject Selection & Forms */}
        <div className="bg-[#18192f]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-800/10 mb-10 overflow-hidden">
          <div className="p-7 border-b border-blue-700/10">
            <div className="mb-5">
              <label className="flex items-center text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                <span className="mr-2">🎯</span>
                Select Subject
              </label>
              {loadingSubjects ? (
                <div className="flex items-center gap-2 text-blue-300">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading subjects...</span>
                </div>
              ) : !subjects.length ? (
                <div className="text-blue-400 py-3 px-5 bg-blue-400/10 rounded-xl border border-blue-400/10">
                  No subjects available. Create a subject first.
                </div>
              ) : (
                <select
                  className="w-full px-4 py-3 bg-[#18192f]/80 border border-blue-400/20 rounded-xl text-white font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition outline-none shadow hover:border-blue-300/30"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map((subj) => (
                    <option
                      key={subj._id}
                      value={subj._id}
                      className="py-2 text-white bg-[#18192f]/90"
                    >
                      {subj.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-7">
              {/* Text Note Form */}
              <div className="space-y-4">
                <div className="flex items-center text-lg font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                  <span className="mr-2">✍️</span>
                  Create Text Note
                </div>
                <div className="bg-[#18163a]/90 rounded-2xl p-5 border border-blue-800/10 shadow">
                  <TextNoteForm
                    subjectId={selectedSubject}
                    token={token}
                    onNoteCreated={(note) => setNotes([note, ...notes])}
                  />
                </div>
              </div>

              {/* File Upload Form */}
              <div className="space-y-4">
                <div className="flex items-center text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  <span className="mr-2">📎</span>
                  Upload File
                </div>
                <div className="bg-[#18163a]/90 rounded-2xl p-5 border border-blue-800/10 shadow">
                  <form onSubmit={handleUploadNote} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Choose File
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="w-full px-3 py-2.5 border-2 border-dashed border-blue-400/30 rounded-xl text-white bg-[#18163a]/80 hover:border-blue-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none file:bg-blue-200/10 file:text-white file:rounded-md"
                        disabled={!selectedSubject || uploading}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-blue-400/30 rounded-xl text-white bg-[#18163a]/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition placeholder-blue-200"
                        placeholder="Enter note title..."
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white font-bold py-3 px-5 rounded-xl hover:scale-[1.04] shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploading || !file || !selectedSubject}
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <span>📤</span>
                          <span>Upload Note</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Notes List */}
          <div className="p-7">
            {loadingNotes ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-bold text-blue-100">
                  Loading notes...
                </p>
                <p className="text-sm text-blue-200">
                  Please wait while we fetch your notes
                </p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-2">
                  No notes yet
                </h3>
                <p className="text-blue-300 mb-6">
                  Start by creating your first note for this subject
                </p>
                <div className="flex justify-center gap-7">
                  <div className="flex items-center text-base text-blue-200">
                    <span className="mr-1">✍️</span>
                    Write a text note
                  </div>
                  <div className="flex items-center text-base text-blue-200">
                    <span className="mr-1">📎</span>
                    Upload a file
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-7">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                    📋 Your Notes ({notes.length})
                  </h2>
                  <div className="text-base text-blue-400">
                    Latest notes shown first
                  </div>
                </div>
                {notes.map((note, index) => (
                  <div
                    key={note._id}
                    className="group bg-[#18163a]/80 backdrop-blur-lg rounded-2xl border border-blue-800/15 shadow-lg hover:shadow-2xl hover:border-blue-400/30 transition-all duration-300 overflow-hidden"
                    style={{
                      animationDelay: `${index * 120}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    <div className="p-6">
                      {editingNote === note._id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-blue-300 flex items-center">
                              <span className="mr-2">✏️</span>
                              Editing Note
                            </h3>
                            <div className="text-xs text-blue-200">
                              {note.fileType &&
                                `${note.fileType.toUpperCase()} • `}
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Note title (optional)"
                            className="w-full px-4 py-2 bg-[#18163a]/90 border border-blue-400/20 rounded-xl text-white placeholder-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-4 py-3 bg-[#18163a]/90 border border-blue-400/20 rounded-xl text-white placeholder-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 resize-y min-h-[120px]"
                            placeholder="Edit your note content..."
                            rows={6}
                          />
                          {/* Edit Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-blue-300">
                              {editContent.length} characters
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={handleEditCancel}
                                disabled={updating}
                                className="px-5 py-2 text-sm font-bold text-blue-200 bg-[#16162f]/80 border border-blue-400/15 rounded-xl hover:bg-blue-800/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditSave(note._id)}
                                disabled={updating || !editContent.trim()}
                                className="px-7 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:scale-[1.03] shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {updating ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>💾</span>
                                    <span>Save Changes</span>
                                  </>
                                )}
                              </button>
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
                                <h3 className="text-lg font-bold text-white truncate">
                                  {note.title ||
                                    note.originalName ||
                                    "Untitled Note"}
                                </h3>
                                {note.fileType && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-400/20 text-white ml-1">
                                    {note.fileType.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {(note.content || note.extractedText) && (
                              <div className="bg-[#16162f]/70 border border-blue-400/10 rounded-xl p-4 mb-2">
                                <p className="text-blue-100 text-sm leading-relaxed line-clamp-3">
                                  {note.content
                                    ? note.content.substring(0, 200) +
                                      (note.content.length > 200 ? "..." : "")
                                    : note.extractedText
                                      ? note.extractedText.substring(0, 200) +
                                        "..."
                                      : ""}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-5 text-xs text-blue-400 mt-2">
                              <div className="flex items-center">
                                <span className="mr-1">🕒</span>
                                {new Date(note.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                              {note.fileUrl && (
                                <a
                                  href={note.fileUrl}
                                  className="flex items-center text-blue-300 hover:text-blue-100 transition-colors"
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
                            <button
                              className="px-4 py-2 bg-blue-400/10 text-blue-200 border border-blue-400/10 rounded-xl font-bold hover:scale-[1.04] transition duration-150"
                              onClick={() => {
                                setViewNote(note);
                                setViewSubject(
                                  subjects.find((s) => s._id === note.subject)
                                );
                              }}
                            >
                              👁️ View
                            </button>
                            {(note.content || note.extractedText) && (
                              <button
                                className="px-4 py-2 bg-emerald-400/10 text-emerald-200 border border-emerald-400/10 rounded-xl font-bold hover:scale-[1.04] transition duration-150"
                                onClick={() => handleEditStart(note)}
                              >
                                ✏️ Edit
                              </button>
                            )}
                            <button
                              className="px-4 py-2 bg-red-400/10 text-red-200 border border-red-400/10 rounded-xl font-bold hover:scale-[1.04] transition duration-150"
                              onClick={() => handleDelete(note._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {viewNote && (
        <NoteModal
          note={viewNote}
          subject={viewSubject}
          onClose={() => setViewNote(null)}
        />
      )}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Notes;
