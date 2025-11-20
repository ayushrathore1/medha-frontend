import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import FlashcardList from "../components/Flashcards/FlashcardList";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  
  // New State
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [generationMode, setGenerationMode] = useState("note"); // "note" or "topic"
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    noteId: "",
    topic: "",
    subject: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchFlashcards(selectedSubject);
    } else {
      setFlashcards([]);
    }
  }, [selectedSubject]);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const [subjectsRes, notesRes] = await Promise.all([
        axios.get(`${baseUrl}/api/subjects`, { headers }),
        axios.get(`${baseUrl}/api/notes`, { headers })
      ]);

      setSubjects(subjectsRes.data.subjects || []);
      setNotes(notesRes.data.notes || []);
      
      // Select first subject by default if available
      if (subjectsRes.data.subjects?.length > 0) {
        setSelectedSubject(subjectsRes.data.subjects[0].name);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async (subject) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards?subject=${subject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlashcards(response.data.flashcards || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const headers = { Authorization: `Bearer ${token}` };

      if (generationMode === "note") {
        // AI Generation from Note
        if (!formData.noteId) {
          alert("Please select a note.");
          return;
        }
        await axios.post(
          `${baseUrl}/api/flashcards/generate-ai`,
          { noteId: formData.noteId },
          { headers }
        );
      } else if (generationMode === "topic") {
        // AI Generation from Topic
        if (!formData.topic) {
          alert("Please enter a topic.");
          return;
        }
        await axios.post(
          `${baseUrl}/api/flashcards/generate-ai`,
          { topic: formData.topic, subject: selectedSubject },
          { headers }
        );
      } else {
        // Manual Creation
        await axios.post(
          `${baseUrl}/api/flashcards`,
          { ...formData, subject: selectedSubject, topicName: "Manual" },
          { headers }
        );
      }

      setFormData({ ...formData, question: "", answer: "", topic: "" });
      setShowForm(false);
      fetchFlashcards(selectedSubject);
    } catch (error) {
      console.error("Error creating flashcard:", error);
      alert("Error creating flashcard.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFlashcards(selectedSubject);
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFlashcards(selectedSubject);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const handleMarkDifficulty = async (id, difficulty) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/${id}/difficulty`,
        { difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistically update local state
      setFlashcards(prev => prev.map(fc => 
        fc._id === id ? { ...fc, difficulty } : fc
      ));
    } catch (error) {
      console.error("Error updating difficulty:", error);
    }
  };

  if (loading && !flashcards.length && !subjects.length) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            Flashcards
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setStudyMode(!studyMode)}
              variant={studyMode ? "secondary" : "outline"}
            >
              {studyMode ? "Exit Study Mode" : "Start Study Mode"}
            </Button>
            <Button onClick={() => setShowForm(!showForm)} variant="primary">
              {showForm ? "Cancel" : "Create New"}
            </Button>
          </div>
        </div>

        {/* Subject Selection */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
          >
            <option value="" disabled>Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Generate Flashcards
            </h2>
            
            {/* Generation Mode Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setGenerationMode("note")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  generationMode === "note" 
                    ? "bg-violet-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                From Notes
              </button>
              <button
                onClick={() => setGenerationMode("topic")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  generationMode === "topic" 
                    ? "bg-violet-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                From Topic
              </button>
              <button
                onClick={() => setGenerationMode("manual")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  generationMode === "manual" 
                    ? "bg-violet-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Manual
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {generationMode === "note" && (
                <div>
                  <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                    Select Note
                  </label>
                  <select
                    value={formData.noteId}
                    onChange={(e) => setFormData({ ...formData, noteId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--accent-secondary)",
                      color: "var(--text-primary)",
                    }}
                    required
                  >
                    <option value="">Select a note...</option>
                    {notes
                      .filter(n => !selectedSubject || n.subject === selectedSubject)
                      .map(note => (
                        <option key={note._id} value={note._id}>{note.title}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              {generationMode === "topic" && (
                <div>
                  <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                    Enter Topic
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Photosynthesis, Newton's Laws"
                    className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--accent-secondary)",
                      color: "var(--text-primary)",
                    }}
                    required
                  />
                </div>
              )}

              {generationMode === "manual" && (
                <>
                  <div>
                    <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Question
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--accent-secondary)",
                        color: "var(--text-primary)",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Answer
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium min-h-[100px] focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--accent-secondary)",
                        color: "var(--text-primary)",
                      }}
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" loading={submitting} disabled={submitting} fullWidth>
                {generationMode === "manual" ? "Create Flashcard" : "Generate with AI"}
              </Button>
            </form>
          </Card>
        )}

        {/* Group by Topic */}
        {Object.entries(
          flashcards.reduce((acc, fc) => {
            const topic = fc.topicName || "General";
            if (!acc[topic]) acc[topic] = [];
            acc[topic].push(fc);
            return acc;
          }, {})
        ).map(([topic, cards]) => (
          <div key={topic} className="mb-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {topic}
            </h3>
            <FlashcardList
              flashcards={cards}
              onEdit={handleUpdate}
              onDelete={handleDelete}
              onMarkDifficulty={handleMarkDifficulty}
              studyMode={studyMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;