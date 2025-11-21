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
  }, [token, selectedSubject]);

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

  const handleEditSave = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/notes/${editingNote}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });
      if (res.ok) {
        setNotes(
          notes.map((n) =>
            n._id === editingNote
              ? { ...n, title: editTitle, content: editContent }
              : n
          )
        );
        handleEditCancel();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to update note.");
      }
    } catch {
      setErrorMsg("Server error updating note.");
    }
    setUpdating(false);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotes(notes.filter((n) => n._id !== noteId));
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to delete note.");
      }
    } catch {
      setErrorMsg("Server error deleting note.");
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSubject) {
      setErrorMsg("Please select a file and subject.");
      return;
    }
    setUploading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", selectedSubject);
    if (uploadTitle) formData.append("title", uploadTitle);

    try {
      const res = await fetch(`${API_BASE}/api/notes/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFile(null);
        setUploadTitle("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        // Refresh notes
        const notesRes = await fetch(
          `${API_BASE}/api/notes?subject=${selectedSubject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const notesData = await notesRes.json();
        if (notesRes.ok) {
          setNotes(notesData.notes || []);
        }
      } else {
        setErrorMsg(data.message || "Failed to upload file.");
      }
    } catch {
      setErrorMsg("Server error uploading file.");
    }
    setUploading(false);
  };

  const handleTextNoteSubmit = async ({ title, content }) => {
    if (!selectedSubject) {
      setErrorMsg("Please select a subject first.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/notes/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          subject: selectedSubject,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([data.note, ...notes]);
      } else {
        setErrorMsg(data.message || "Failed to create note.");
      }
    } catch {
      setErrorMsg("Server error creating note.");
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
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
                <Loader />
                <span style={{ color: "var(--text-secondary)" }}>Loading subjects...</span>
              </div>
            ) : !subjects.length ? (
              <Card>
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

          {/* Tab-style Forms */}
          <div className="space-y-6">
            {/* Upload Form */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                📤 Upload Note File
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 font-medium focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--accent-secondary)",
                      color: "var(--text-primary)"
                    }}
                    placeholder="My awesome notes..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                    Select File
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg border-2 font-medium"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--accent-secondary)",
                      color: "var(--text-primary)"
                    }}
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  loading={uploading}
                  variant="primary"
                  fullWidth
                >
                  Upload & Process
                </Button>
              </div>
            </div>

            {/* Text Note Form */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                📝 Create Text Note
              </h3>
              <TextNoteForm onSubmit={handleTextNoteSubmit} />
            </div>
          </div>
        </Card>

        {/* Notes List */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
            📖 Your Notes
          </h2>
          {loadingNotes ? (
            <Loader />
          ) : !notes.length ? (
            <Card className="text-center py-12">
              <p className="text-xl font-semibold" style={{ color: "var(--text-secondary)" }}>
                No notes yet. Upload or create your first note!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Card key={note._id} className="group hover:shadow-xl transition-shadow">
                  {editingNote === note._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 font-medium"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--accent-secondary)",
                          color: "var(--text-primary)"
                        }}
                        placeholder="Title"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 font-medium min-h-[100px]"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--accent-secondary)",
                          color: "var(--text-primary)"
                        }}
                        placeholder="Content"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleEditSave}
                          loading={updating}
                          variant="primary"
                          size="small"
                          fullWidth
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleEditCancel}
                          variant="ghost"
                          size="small"
                          fullWidth
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                        {note.title || "Untitled"}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                        {note.content || note.extractedText || "No content"}
                      </p>
                      <div className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setViewNote(note)}
                          variant="outline"
                          size="small"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => handleEditStart(note)}
                          variant="secondary"
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(note._id)}
                          variant="danger"
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Note Modal */}
        {viewNote && (
          <NoteModal note={viewNote} onClose={() => setViewNote(null)} />
        )}
      </div>
    </div>
  );
};

export default Notes;
