import React, { useEffect, useState, useRef } from "react";
import NoteModal from "./NoteModal";
import TextNoteForm from "../components/Notes/TextNoteForm";

const API_BASE = "https://medha-backend.onrender.com/";

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

  // Fetch subjects on mount
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

  // Fetch notes on subject change or after upload
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                📚 My Notes
              </h1>
              <p className="text-slate-600">
                Organize and manage your study materials by subject
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
              <span>{notes.length} notes</span>
              <span>•</span>
              <span>{subjects.length} subjects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Subject Selection & Forms */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-white/50 to-blue-50/30">
            <div className="mb-8">
              <label className="flex items-center text-lg font-semibold text-slate-700 mb-3">
                <span className="mr-2">🎯</span>
                Select Subject
              </label>
              {loadingSubjects ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading subjects...</span>
                </div>
              ) : !subjects.length ? (
                <div className="text-slate-500 py-4 px-6 bg-slate-50 rounded-lg border border-slate-200">
                  No subjects available. Create a subject first.
                </div>
              ) : (
                <select
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none shadow-sm hover:border-slate-300"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map((subj) => (
                    <option key={subj._id} value={subj._id} className="py-2">
                      {subj.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Text Note Form */}
              <div className="space-y-4">
                <div className="flex items-center text-lg font-semibold text-slate-700">
                  <span className="mr-2">✍️</span>
                  Create Text Note
                </div>
                <div className="bg-white/60 rounded-xl p-6 border border-slate-200/50 shadow-sm">
                  <TextNoteForm
                    subjectId={selectedSubject}
                    token={token}
                    onNoteCreated={(note) => setNotes([note, ...notes])}
                  />
                </div>
              </div>

              {/* File Upload Form */}
              <div className="space-y-4">
                <div className="flex items-center text-lg font-semibold text-slate-700">
                  <span className="mr-2">📎</span>
                  Upload File
                </div>
                <div className="bg-white/60 rounded-xl p-6 border border-slate-200/50 shadow-sm">
                  <form onSubmit={handleUploadNote} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Choose File
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="w-full px-3 py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        disabled={!selectedSubject || uploading}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-slate-700 bg-white/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none placeholder-slate-400"
                        placeholder="Enter note title..."
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center space-x-2"
                      disabled={uploading || !file || !selectedSubject}
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
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
          <div className="p-8">
            {loadingNotes ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-medium text-slate-600">
                  Loading notes...
                </p>
                <p className="text-sm text-slate-400">
                  Please wait while we fetch your notes
                </p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No notes yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Start by creating your first note for this subject
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center text-sm text-slate-400">
                    <span className="mr-1">✍️</span>
                    Write a text note
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <span className="mr-1">📎</span>
                    Upload a file
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-700">
                    📋 Your Notes ({notes.length})
                  </h2>
                  <div className="text-sm text-slate-500">
                    Latest notes shown first
                  </div>
                </div>

                {notes.map((note, index) => (
                  <div
                    key={note._id}
                    className="group bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-blue-300/50"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    <div className="p-6">
                      {editingNote === note._id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                              <span className="mr-2">✏️</span>
                              Editing Note
                            </h3>
                            <div className="text-xs text-slate-500">
                              {note.fileType &&
                                `${note.fileType.toUpperCase()} • `}
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {/* Edit Form */}
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Note title (optional)"
                              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                            />
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-y min-h-[120px]"
                              placeholder="Edit your note content..."
                              rows={6}
                            />
                          </div>
                          {/* Edit Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-slate-500">
                              {editContent.length} characters
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={handleEditCancel}
                                disabled={updating}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditSave(note._id)}
                                disabled={updating || !editContent.trim()}
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                        // View Mode
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {/* Note Header */}
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex-shrink-0">
                                {note.fileType
                                  ? note.fileType === "pdf"
                                    ? "📄"
                                    : "🖼️"
                                  : "📝"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-slate-800 truncate">
                                  {note.title ||
                                    note.originalName ||
                                    "Untitled Note"}
                                </h3>
                                {note.fileType && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                    {note.fileType.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Note Preview */}
                            {(note.content || note.extractedText) && (
                              <div className="bg-slate-50/70 rounded-lg p-4 mb-3 border border-slate-200/50">
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
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
                            {/* Note Metadata */}
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
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
                                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="mr-1">🔗</span>
                                  View Original
                                </a>
                              )}
                            </div>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-2 ml-6">
                            <button
                              className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm font-medium group-hover:shadow-sm"
                              onClick={() => {
                                setViewNote(note);
                                setViewSubject(
                                  subjects.find((s) => s._id === note.subject)
                                );
                              }}
                            >
                              <span className="mr-1">👁️</span>
                              View
                            </button>
                            {(note.content || note.extractedText) && (
                              <button
                                className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 text-sm font-medium group-hover:shadow-sm"
                                onClick={() => handleEditStart(note)}
                              >
                                <span className="mr-1">✏️</span>
                                Edit
                              </button>
                            )}
                            <button
                              className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm font-medium group-hover:shadow-sm"
                              onClick={() => handleDelete(note._id)}
                            >
                              <span className="mr-1">🗑️</span>
                              Delete
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
        {/* Note Modal */}
        {viewNote && (
          <NoteModal
            note={viewNote}
            subject={viewSubject}
            onClose={() => setViewNote(null)}
          />
        )}
      </div>
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
