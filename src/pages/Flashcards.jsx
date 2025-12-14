import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import FlashcardList from "../components/Flashcards/FlashcardList";
import { FaArrowLeft, FaCheckCircle, FaBook, FaLayerGroup } from "react-icons/fa";

const Flashcards = () => {
  const [viewState, setViewState] = useState("subjects"); // "subjects", "topics", "flashcards"
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  
  // Form State
  const [notes, setNotes] = useState([]);
  const [generationMode, setGenerationMode] = useState("note"); // "note" or "topic"
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    noteId: "",
    topic: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject && viewState === "topics") {
      fetchTopics(selectedSubject.name);
    }
  }, [selectedSubject, viewState]);

  useEffect(() => {
    if (selectedTopic && viewState === "flashcards") {
      fetchFlashcards(selectedTopic.name);
    }
  }, [selectedTopic, viewState]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const [subjectsRes, notesRes] = await Promise.all([
        axios.get(`${baseUrl}/api/subjects`, { headers }),
        axios.get(`${baseUrl}/api/notes`, { headers })
      ]);

      setSubjects(subjectsRes.data.subjects || []);
      setNotes(notesRes.data.notes || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (subjectName) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/topics/all?subject=${encodeURIComponent(subjectName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTopics(response.data.topics || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async (topicName) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards?topic=${encodeURIComponent(topicName)}`,
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

      // If we are in "subjects" view, user must have selected a subject in the form (if we allowed it)
      // But we will enforce selecting a subject first in the UI flow, so selectedSubject should be available if we are in topics/flashcards view.
      // If we are in subjects view, we might need to let user select subject in form.
      
      // Let's simplify: The form always requires a subject. 
      // If selectedSubject is set, use it. If not, user must select in form (if we enable that).
      // BUT user requirement: "first select the subject then we can do anything".
      // So we should probably only allow creating when a subject is selected? 
      // Or allow creating but force subject selection.
      
      const subjectToUse = selectedSubject ? selectedSubject.name : formData.subject;
      
      if (!subjectToUse) {
          alert("Please select a subject first.");
          setSubmitting(false);
          return;
      }

      if (generationMode === "note") {
        if (!formData.noteId) {
          alert("Please select a note.");
          setSubmitting(false);
          return;
        }
        await axios.post(
          `${baseUrl}/api/flashcards/generate-ai`,
          { noteId: formData.noteId },
          { headers }
        );
      } else if (generationMode === "topic") {
        if (!formData.topic) {
          alert("Please enter a topic.");
          setSubmitting(false);
          return;
        }
        await axios.post(
          `${baseUrl}/api/flashcards/generate-ai`,
          { topic: formData.topic, subject: subjectToUse },
          { headers }
        );
      } else {
        await axios.post(
          `${baseUrl}/api/flashcards`,
          { ...formData, subject: subjectToUse, topicName: "Manual" },
          { headers }
        );
      }

      setFormData({ ...formData, question: "", answer: "", topic: "" });
      setShowForm(false);
      
      // Refresh current view
      // If generated from topic, go back to topics view to see the new topic
      if (generationMode === "topic" && selectedSubject) {
        setViewState("topics");
        setSelectedTopic(null);
        await fetchTopics(selectedSubject.name);
        alert("Flashcards generated! Click on your new topic to view them.");
      } else if (viewState === "flashcards" && selectedTopic) {
        await fetchFlashcards(selectedTopic.name);
      } else if (viewState === "topics" && selectedSubject) {
        await fetchTopics(selectedSubject.name);
        alert("Flashcards generated! Check your new topic below.");
      }
      
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
      if (selectedTopic) fetchFlashcards(selectedTopic.name);
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
      if (selectedTopic) fetchFlashcards(selectedTopic.name);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const handleMarkTopicDifficulty = async (topicName, difficulty, e) => {
    e.stopPropagation(); 
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/topic/${encodeURIComponent(topicName)}/difficulty`,
        { difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTopics(prev => prev.map(t => 
        t.name === topicName ? { ...t, difficulty } : t
      ));
    } catch (error) {
      console.error("Error updating topic difficulty:", error);
    }
  };

  const handleMarkViewed = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/${id}/viewed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlashcards(prev => prev.map(fc => 
        fc._id === id ? { ...fc, viewed: true } : fc
      ));
    } catch (error) {
      console.error("Error marking as viewed:", error);
    }
  };

  // Navigation Handlers
  const goBack = () => {
    if (viewState === "flashcards") {
      setViewState("topics");
      setSelectedTopic(null);
    } else if (viewState === "topics") {
      setViewState("subjects");
      setSelectedSubject(null);
    }
  };

  if (loading && !subjects.length && !topics.length && !flashcards.length) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {viewState !== "subjects" && (
              <Button onClick={goBack} variant="ghost">
                <FaArrowLeft className="mr-2" /> Back
              </Button>
            )}
            <div>
                <h1 className="text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                {viewState === "subjects" && "Select Subject"}
                {viewState === "topics" && selectedSubject?.name}
                {viewState === "flashcards" && selectedTopic?.name}
                </h1>
                {viewState !== "subjects" && (
                    <p className="text-sm opacity-70" style={{ color: "var(--text-secondary)" }}>
                        {viewState === "topics" ? "Select a topic to study" : `Subject: ${selectedSubject?.name}`}
                    </p>
                )}
            </div>
          </div>
          
          <div className="flex gap-4">
            {viewState === "flashcards" && (
              <Button
                onClick={() => setStudyMode(!studyMode)}
                variant={studyMode ? "secondary" : "outline"}
              >
                {studyMode ? "Exit Study Mode" : "Start Study Mode"}
              </Button>
            )}
            
            {/* Only show Create button if a subject is selected (i.e. not in subjects view) */}
            {viewState !== "subjects" && (
                <Button onClick={() => setShowForm(!showForm)} variant="primary">
                {showForm ? "Cancel" : "Create New"}
                </Button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {showForm && viewState !== "subjects" && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Generate Flashcards for {selectedSubject?.name}
            </h2>
            
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
                    Select Note (must belong to {selectedSubject?.name})
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
                        .filter(n => n.subject === selectedSubject?.name)
                        .map(note => (
                      <option key={note._id} value={note._id}>{note.title}</option>
                    ))}
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

        {/* VIEW: SUBJECTS */}
        {viewState === "subjects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.length === 0 ? (
                    <div className="col-span-full text-center opacity-60 py-12">
                        No subjects found. Please add subjects in the Dashboard first.
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <Card 
                            key={subject._id} 
                            className="cursor-pointer hover:border-violet-500 transition-all group relative flex flex-col items-center justify-center py-12 gap-4"
                            onClick={() => {
                                setSelectedSubject(subject);
                                setViewState("topics");
                            }}
                        >
                            <div className="p-4 rounded-full bg-violet-500/20 text-violet-500">
                                <FaBook size={32} />
                            </div>
                            <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                                {subject.name}
                            </h3>
                            <p className="text-sm opacity-70">Click to view topics</p>
                        </Card>
                    ))
                )}
            </div>
        )}

        {/* VIEW: TOPICS */}
        {viewState === "topics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.length === 0 ? (
              <div className="col-span-full text-center opacity-60 py-12">
                No topics found for {selectedSubject.name}. Generate some flashcards to get started!
              </div>
            ) : (
              topics.map((topic) => (
                <Card 
                  key={topic._id} 
                  className="cursor-pointer hover:border-violet-500 transition-all group relative"
                  onClick={() => {
                      setSelectedTopic(topic);
                      setViewState("flashcards");
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <FaLayerGroup className="text-violet-500" />
                        <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        {topic.name}
                        </h3>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-600" onClick={(e) => e.stopPropagation()} />
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-70">
                      {topic.viewedCards} / {topic.totalCards} Viewed
                    </span>
                    {topic.viewedCards === topic.totalCards && topic.totalCards > 0 && (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </div>

                  {/* Difficulty Controls */}
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleMarkTopicDifficulty(topic.name, "easy", e)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        topic.difficulty === "easy" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={(e) => handleMarkTopicDifficulty(topic.name, "medium", e)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        topic.difficulty === "medium" 
                          ? "bg-yellow-500 text-white" 
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={(e) => handleMarkTopicDifficulty(topic.name, "hard", e)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        topic.difficulty === "hard" 
                          ? "bg-red-500 text-white" 
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      Difficult
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* VIEW: FLASHCARDS */}
        {viewState === "flashcards" && (
          <div>
            <FlashcardList
              flashcards={flashcards}
              onEdit={handleUpdate}
              onDelete={handleDelete}
              onMarkDifficulty={(id, type) => {
                 if (type === "viewed") handleMarkViewed(id);
              }}
              studyMode={studyMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;