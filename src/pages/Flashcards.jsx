import React, { useEffect, useState, useCallback } from "react";
import {
  fetchSubjects,
  fetchNotes,
  fetchFlashcards,
  createFlashcard,
  generateAIFlashcards,
  updateFlashcard,
  deleteFlashcard,
  createSubject, // <-- make sure this exists in api.js
  createNote, // <-- same for notes
} from "../api/api";
import FlashcardList from "../components/Flashcards/FlashcardList";

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

  // Fetch subjects on mount
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

  // Fetch notes when subject changes
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

  // Fetch flashcards when note changes
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

  // Manual create flashcard
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

  // Handle AI generate flashcards
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

  // Handle flashcard update
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

  // Handle flashcard delete
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

  // Create subject handler
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

  // Create note handler
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center pb-16 relative">
      {/* Spacer for sticky header */}
      <div style={{ height: "80px" }} />

      {/* Main Card Section */}
      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        {/* Onboarding UI if no data */}
        {(!subjects.length || !notes.length) && (
          <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-10 mt-6 border border-blue-200 shadow-lg">
            <div className="text-7xl mb-4">🎴</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-2">
              Get Started
            </h3>
            <p className="text-blue-700 mb-2 text-center">
              Welcome to your Flashcards dashboard!
              <br />
              Start by creating a subject and adding your first note.
              <br />
              Once you have notes, you can create flashcards manually or let AI
              generate them!
            </p>
            <div className="flex gap-4 mt-5">
              <button
                onClick={() => setShowSubjectModal(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold shadow"
              >
                + Add New Subject
              </button>
              {subjects.length > 0 && (
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold shadow"
                  disabled={!selectedSubject}
                >
                  + Add New Note
                </button>
              )}
            </div>
          </div>
        )}

        {/* Subject and Note Pickers */}
        <div className="flex flex-col md:flex-row gap-6 mt-8 mb-6 justify-center items-center">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-blue-800">
              Select Subject
            </label>
            <div className="flex gap-2">
              <select
                onChange={(e) => setSelectedSubject(e.target.value)}
                value={selectedSubject}
                className="px-4 py-2 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 focus:ring-2 focus:ring-blue-300 font-medium"
              >
                <option value="">Choose Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowSubjectModal(true)}
                className="px-4 bg-green-100 text-green-900 font-semibold rounded-xl border border-green-200 hover:bg-green-200 transition shadow"
              >
                + Add
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-blue-800">
              Select Note
            </label>
            <div className="flex gap-2">
              <select
                onChange={(e) => setSelectedNote(e.target.value)}
                value={selectedNote}
                disabled={!selectedSubject}
                className="px-4 py-2 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 focus:ring-2 focus:ring-purple-300 font-medium"
              >
                <option value="">Choose Note</option>
                {notes.map((n) => (
                  <option key={n._id} value={n._id}>
                    {n.title}
                  </option>
                ))}
              </select>
              {selectedSubject && (
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="px-4 bg-indigo-900 text-white font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-200 transition shadow"
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Create/Generate buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
          <button
            onClick={() => setShowManualModal(true)}
            disabled={!selectedNote}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition"
          >
            ✍️ Create Flashcard Manually
          </button>
          <button
            onClick={handleAIGenerate}
            disabled={!selectedNote}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-800 rounded-xl text-white font-semibold shadow-lg transition"
          >
            🤖 Generate AI Flashcards
          </button>
        </div>

        {/* Flashcard List or Loader */}
        <div className="w-full flex justify-center items-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-4 text-blue-700 font-semibold mt-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p>Loading...</p>
            </div>
          ) : selectedNote ? (
            <div className="w-full">
              <FlashcardList
                flashcards={flashcards}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="text-blue-600 text-lg mt-8 text-center">
              Select a note to view its flashcards.
            </div>
          )}
        </div>
      </div>

      {/* Create Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center">
          <form
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full"
            onSubmit={handleCreateSubject}
          >
            <h3 className="text-2xl text-blue-700 mb-4 font-bold">
              Create New Subject
            </h3>
            <input
              type="text"
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-blue-50 text-blue-900 rounded border border-blue-200"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newSubject.description}
              onChange={(e) =>
                setNewSubject({ ...newSubject, description: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-blue-50 text-blue-900 rounded border border-blue-200"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded text-white font-bold"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={() => setShowSubjectModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center">
          <form
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full"
            onSubmit={handleCreateNote}
          >
            <h3 className="text-2xl text-purple-700 mb-4 font-bold">
              Create New Note
            </h3>
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-purple-50 text-purple-900 rounded border border-purple-200"
              required
            />
            <textarea
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-purple-50 text-purple-900 rounded border border-purple-200"
              required
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="submit"
                className="bg-purple-600 px-4 py-2 rounded text-white font-bold"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manual Flashcard Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center">
          <form
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full"
            onSubmit={handleManualCreate}
          >
            <h3 className="text-2xl text-blue-800 mb-4 font-bold">
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
              className="mb-3 px-4 py-2 w-full bg-blue-50 text-blue-900 rounded border border-blue-200"
            />
            <input
              type="text"
              placeholder="Answer"
              value={manualCard.answer}
              onChange={(e) =>
                setManualCard({ ...manualCard, answer: e.target.value })
              }
              required
              className="mb-3 px-4 py-2 w-full bg-blue-50 text-blue-900 rounded border border-blue-200"
            />
            <input
              type="text"
              placeholder="Subject (optional)"
              value={manualCard.subject}
              onChange={(e) =>
                setManualCard({ ...manualCard, subject: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-blue-50 text-blue-900 rounded border border-blue-200"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded text-white font-bold"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={() => setShowManualModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
