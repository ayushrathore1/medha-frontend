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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pb-16 relative font-inter overflow-hidden">
      {/* Glassy animated blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-8 left-1/4 w-96 h-56 bg-gradient-to-tr from-violet-400/19 to-blue-400/12 rounded-full blur-2xl opacity-21 animate-blob"></div>
        <div className="absolute bottom-2 right-1/3 w-80 h-48 bg-gradient-to-r from-blue-400/16 to-purple-400/10 rounded-full blur-2xl opacity-17 animate-blob animation-delay-2000"></div>
        <style>{`
          @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.09) translate(21px,-13px);} 66% {transform: scale(0.95) translate(-16px,18px);} 100% {transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 13s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>

      {/* Spacer for sticky header */}
      <div style={{ height: "80px" }} />

      <div className="w-full max-w-4xl mx-auto px-4 py-4 z-10">
        {/* Onboarding UI */}
        {(!subjects.length || !notes.length) && (
          <div className="flex flex-col items-center justify-center bg-[#18163a]/90 backdrop-blur-2xl rounded-3xl p-10 mt-6 border border-violet-400/12 shadow-2xl">
            <div className="text-7xl mb-4">🎴</div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Get Started
            </h3>
            <p className="text-violet-200 mb-2 text-center">
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
                className="px-5 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:bg-violet-700 rounded-xl text-white font-bold shadow-xl transition focus:ring-2 focus:ring-violet-400"
              >
                + Add New Subject
              </button>
              {subjects.length > 0 && (
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:bg-blue-700 rounded-xl text-white font-bold shadow-xl transition focus:ring-2 focus:ring-blue-400"
                  disabled={!selectedSubject}
                >
                  + Add New Note
                </button>
              )}
            </div>
          </div>
        )}

        {/* Subject / Note Pickers */}
        <div className="flex flex-col md:flex-row gap-7 mt-10 mb-8 justify-center items-center">
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-violet-300">
              Select Subject
            </label>
            <div className="flex gap-3">
              <select
                onChange={(e) => setSelectedSubject(e.target.value)}
                value={selectedSubject}
                className="px-4 py-2 rounded-xl bg-[#18163a]/70 text-white border border-violet-400/25 font-medium placeholder-violet-300 focus:ring-2 focus:ring-violet-400 focus:outline-none"
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
                className="px-4 bg-emerald-500 text-white font-bold rounded-xl border border-emerald-400 hover:bg-emerald-600 transition shadow"
              >
                + Add
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-1 text-blue-300">Select Note</label>
            <div className="flex gap-3">
              <select
                onChange={(e) => setSelectedNote(e.target.value)}
                value={selectedNote}
                disabled={!selectedSubject}
                className="px-4 py-2 rounded-xl bg-[#18163a]/70 text-white border border-blue-400/25 font-medium placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                  className="px-4 bg-indigo-600 text-white font-bold rounded-xl border border-indigo-400 hover:bg-indigo-800 transition shadow"
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Create/Generate Buttons */}
        <div className="flex flex-col md:flex-row gap-5 justify-center items-center mb-12">
          <button
            onClick={() => setShowManualModal(true)}
            disabled={!selectedNote}
            className="px-7 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-blue-700 hover:to-violet-700 rounded-xl text-white font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✍️ Create Flashcard Manually
          </button>
          <button
            onClick={handleAIGenerate}
            disabled={!selectedNote}
            className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-800 hover:to-purple-800 rounded-xl text-white font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🤖 Generate AI Flashcards
          </button>
        </div>

        {/* Flashcard List or Loader */}
        <div className="w-full flex justify-center items-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-4 text-blue-200 font-bold mt-8">
              <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="text-violet-200 text-lg mt-8 text-center">
              Select a note to view its flashcards.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center">
          <form
            className="bg-[#18163a]/95 rounded-2xl p-8 shadow-2xl border border-violet-400/20 max-w-sm w-full"
            onSubmit={handleCreateSubject}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Create New Subject
            </h3>
            <input
              type="text"
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newSubject.description}
              onChange={(e) =>
                setNewSubject({ ...newSubject, description: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 rounded-xl text-white font-bold shadow"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gradient-to-r from-gray-400 to-gray-500 px-5 py-2 rounded-xl text-white font-bold"
                onClick={() => setShowSubjectModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center">
          <form
            className="bg-[#18163a]/95 rounded-2xl p-8 shadow-2xl border border-violet-400/20 max-w-sm w-full"
            onSubmit={handleCreateNote}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Create New Note
            </h3>
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
              required
            />
            <textarea
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
              required
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-xl text-white font-bold shadow"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gradient-to-r from-gray-400 to-gray-500 px-5 py-2 rounded-xl text-white font-bold"
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showManualModal && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center">
          <form
            className="bg-[#18163a]/95 rounded-2xl p-8 shadow-2xl border border-violet-400/20 max-w-sm w-full"
            onSubmit={handleManualCreate}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-4">
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
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="text"
              placeholder="Answer"
              value={manualCard.answer}
              onChange={(e) =>
                setManualCard({ ...manualCard, answer: e.target.value })
              }
              required
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="text"
              placeholder="Subject (optional)"
              value={manualCard.subject}
              onChange={(e) =>
                setManualCard({ ...manualCard, subject: e.target.value })
              }
              className="mb-3 px-4 py-2 w-full bg-[#18163a]/80 text-white rounded-xl border border-violet-400/15 placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 rounded-xl text-white font-bold shadow"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-gradient-to-r from-gray-400 to-gray-500 px-5 py-2 rounded-xl text-white font-bold"
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
