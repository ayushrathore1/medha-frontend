import React, { useEffect, useState, useCallback } from "react";
import {
  fetchSubjects,
  fetchNotes,
  fetchFlashcards,
  createFlashcard,
  generateAIFlashcards,
  updateFlashcard,
  deleteFlashcard,
  createSubject,
  createNote,
} from "../api/api";
import FlashcardList from "../components/Flashcards/FlashcardList";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { Plus, Sparkles } from "lucide-react";

const Flashcards = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [manualCard, setManualCard] = useState({
    question: "",
    answer: "",
    subject: "",
  });
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const subj = await fetchSubjects();
        setSubjects(subj);
      } catch {
        setSubjects([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      (async () => {
        try {
          const nts = await fetchNotes(selectedSubject);
          setNotes(nts);
        } catch {
          setNotes([]);
        }
        setSelectedNote("");
        setFlashcards([]);
      })();
    } else {
      setNotes([]);
      setSelectedNote("");
      setFlashcards([]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedNote) {
      (async () => {
        setLoading(true);
        try {
          const cards = await fetchFlashcards(selectedNote);
          setFlashcards(cards);
        } catch {
          setFlashcards([]);
        }
        setLoading(false);
      })();
    } else {
      setFlashcards([]);
    }
  }, [selectedNote]);

  const handleManualCreate = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await createFlashcard({
          noteId: selectedNote,
          question: manualCard.question,
          answer: manualCard.answer,
          subject:
            manualCard.subject ||
            subjects.find((s) => s._id === selectedSubject)?.name ||
            "",
        });
        setManualCard({ question: "", answer: "", subject: "" });
        setShowManualModal(false);
        const cards = await fetchFlashcards(selectedNote);
        setFlashcards(cards);
      } finally {
        setLoading(false);
      }
    },
    [manualCard, selectedNote, selectedSubject, subjects]
  );

  const handleAIGenerate = useCallback(async () => {
    setLoading(true);
    try {
      await generateAIFlashcards(selectedNote);
      const cards = await fetchFlashcards(selectedNote);
      setFlashcards(cards);
    } finally {
      setLoading(false);
    }
  }, [selectedNote]);

  const handleUpdate = useCallback(
    async (id, question, answer, subject) => {
      setLoading(true);
      try {
        await updateFlashcard(id, { question, answer, subject });
        const cards = await fetchFlashcards(selectedNote);
        setFlashcards(cards);
      } finally {
        setLoading(false);
      }
    },
    [selectedNote]
  );

  const handleDelete = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await deleteFlashcard(id);
        const cards = await fetchFlashcards(selectedNote);
        setFlashcards(cards);
      } finally {
        setLoading(false);
      }
    },
    [selectedNote]
  );

  const handleCreateSubject = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await createSubject({
          name: newSubject.name,
          description: newSubject.description,
        });
        setShowSubjectModal(false);
        setNewSubject({ name: "", description: "" });
        const subj = await fetchSubjects();
        setSubjects(subj);
      } finally {
        setLoading(false);
      }
    },
    [newSubject]
  );

  const handleCreateNote = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await createNote({
          title: newNote.title,
          content: newNote.content,
          subject: selectedSubject,
        });
        setShowNoteModal(false);
        setNewNote({ title: "", content: "" });
        const nts = await fetchNotes(selectedSubject);
        setNotes(nts);
      } finally {
        setLoading(false);
      }
    },
    [newNote, selectedSubject]
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                🎴 Flashcards
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                Study smarter with AI-generated flashcards
              </p>
            </div>
          </div>
        </Card>

        {/* Onboarding UI */}
        {(!subjects.length || !notes.length) && (
          <Card className="text-center mb-8">
            <div className="text-7xl mb-4">🎴</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Get Started
            </h3>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              Welcome to your Flashcards dashboard!
              <br />
              Start by creating a subject and adding your first note.
              <br />
              Once you have notes, you can create flashcards manually or let AI
              generate them!
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowSubjectModal(true)}
                icon={<Plus size={20} />}
              >
                Add New Subject
              </Button>
              {subjects.length > 0 && (
                <Button
                  onClick={() => setShowNoteModal(true)}
                  disabled={!selectedSubject}
                  variant="secondary"
                  icon={<Plus size={20} />}
                >
                  Add New Note
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Subject / Note Pickers */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Select Subject
              </label>
              <div className="flex gap-3">
                <select
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  value={selectedSubject}
                  className="flex-1 px-4 py-2 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Choose Subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() => setShowSubjectModal(true)}
                  variant="success"
                  size="small"
                >
                  + Add
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Select Note
              </label>
              <div className="flex gap-3">
                <select
                  onChange={(e) => setSelectedNote(e.target.value)}
                  value={selectedNote}
                  disabled={!selectedSubject}
                  className="flex-1 px-4 py-2 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Choose Note</option>
                  {notes.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.title}
                    </option>
                  ))}
                </select>
                {selectedSubject && (
                  <Button
                    onClick={() => setShowNoteModal(true)}
                    variant="primary"
                    size="small"
                  >
                    + Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Create/Generate Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <Button
            onClick={() => setShowManualModal(true)}
            disabled={!selectedNote}
            icon={<span>✍️</span>}
            size="large"
          >
            Create Flashcard Manually
          </Button>
          <Button
            onClick={handleAIGenerate}
            disabled={!selectedNote}
            variant="secondary"
            icon={<Sparkles size={20} />}
            size="large"
          >
            Generate AI Flashcards
          </Button>
        </div>

        {/* Flashcard List or Loader */}
        <div className="w-full flex justify-center items-center">
          {loading ? (
            <Loader />
          ) : selectedNote ? (
            <div className="w-full">
              <FlashcardList
                flashcards={flashcards}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <Card className="text-center">
              <p style={{ color: "var(--text-secondary)" }}>
                Select a note to view its flashcards.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <form onSubmit={handleCreateSubject}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--action-primary)" }}>
                Create New Subject
              </h3>
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, name: e.target.value })
                }
                className="mb-3 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newSubject.description}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, description: e.target.value })
                }
                className="mb-4 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowSubjectModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <form onSubmit={handleCreateNote}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--action-primary)" }}>
                Create New Note
              </h3>
              <input
                type="text"
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="mb-3 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
                required
              />
              <textarea
                placeholder="Note Content"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="mb-4 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
                required
                rows={4}
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNoteModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showManualModal && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <form onSubmit={handleManualCreate}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--action-primary)" }}>
                Create Flashcard
              </h3>
              <input
                type="text"
                placeholder="Question"
                value={manualCard.question}
                onChange={(e) =>
                  setManualCard({ ...manualCard, question: e.target.value })
                }
                required
                className="mb-3 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
              />
              <input
                type="text"
                placeholder="Answer"
                value={manualCard.answer}
                onChange={(e) =>
                  setManualCard({ ...manualCard, answer: e.target.value })
                }
                required
                className="mb-3 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
              />
              <input
                type="text"
                placeholder="Subject (optional)"
                value={manualCard.subject}
                onChange={(e) =>
                  setManualCard({ ...manualCard, subject: e.target.value })
                }
                className="mb-4 px-4 py-2 w-full rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--accent-secondary)",
                  color: "var(--text-primary)",
                }}
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowManualModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
