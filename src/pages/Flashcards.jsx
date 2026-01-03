import React, { useEffect, useState, useCallback } from "react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import FlashcardList from "../components/Flashcards/FlashcardList";
import { motion, AnimatePresence } from "framer-motion";
import { FaLayerGroup, FaWandMagicSparkles, FaTrash, FaCircleCheck, FaArrowLeft, FaBrain } from "react-icons/fa6";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

import { useTour } from "../context/TourContext";

const Flashcards = () => {
  const { isGuestMode } = useTour();
  const [view, setView] = useState("topics");
  const [topics, setTopics] = useState(isGuestMode ? [
    { topicName: 'Photosynthesis', subject: 'Biology', total: 20, viewed: 15, difficulty: 'medium' },
    { topicName: 'Quantum Mechanics', subject: 'Physics', total: 15, viewed: 5, difficulty: 'hard' },
    { topicName: 'React Basics', subject: 'Computer Science', total: 30, viewed: 30, difficulty: 'easy' }
  ] : []);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(!isGuestMode);
  const [error, setError] = useState("");
  
  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({ topic: "", subject: "" });
  const [generating, setGenerating] = useState(false);
  
  const token = localStorage.getItem("token");

  // Fetch topics
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/flashcards/topics/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTopics(data.topics || []);
      } else {
        setError(data.message || "Failed to fetch topics");
      }
    } catch {
      setError("Server error fetching topics");
    }
    setLoading(false);
  }, [token]);

  // Fetch flashcards
  const fetchFlashcardsForTopic = useCallback(async (topicName) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/flashcards?topic=${encodeURIComponent(topicName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFlashcards(data.flashcards || []);
      } else {
        setError(data.message || "Failed to fetch flashcards");
      }
    } catch {
      setError("Server error fetching flashcards");
    }
    setLoading(false);
  }, [token]);

  // Generate
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!generateForm.topic.trim()) return;
    
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/flashcards/generate-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: generateForm.topic,
          subject: generateForm.subject || generateForm.topic,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowGenerateModal(false);
        setGenerateForm({ topic: "", subject: "" });
        fetchTopics();
      } else {
        setError(data.message || "Failed to generate flashcards");
      }
    } catch {
      setError("Server error generating flashcards");
    }
    setGenerating(false);
  };

  const handleUpdateDifficulty = async (topicName, difficulty) => {
    try {
      await fetch(`${API_BASE}/flashcards/topic/${encodeURIComponent(topicName)}/difficulty`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ difficulty }),
      });
      fetchTopics();
    } catch {
      console.error("Failed to update difficulty");
    }
  };

  const handleDeleteTopic = async (topicName) => {
    if (!window.confirm(`Delete all flashcards for "${topicName}"?`)) return;
    try {
      await fetch(`${API_BASE}/flashcards/topic/${encodeURIComponent(topicName)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTopics();
    } catch {
      setError("Failed to delete topic");
    }
  };

  const handleMarkViewed = async (flashcardId) => {
    try {
      await fetch(`${API_BASE}/flashcards/${flashcardId}/viewed`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      console.error("Failed to mark as viewed");
    }
  };

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    setView("flashcards");
    fetchFlashcardsForTopic(topic.topicName);
  };

  const backToTopics = () => {
    setView("topics");
    setSelectedTopic(null);
    setFlashcards([]);
    fetchTopics();
  };

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {view === "flashcards" && (
              <Button onClick={backToTopics} variant="ghost" size="sm" className="bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] shadow-sm border border-slate-200">
                <FaArrowLeft className="mr-2"/> Back
              </Button>
            )}
            <div>
              <h1 
                data-tour="flashcards"
                className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3"
              >
                {view === "topics" ? (
                  <>
                    <span className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><FaLayerGroup size={24}/></span>
                    Flashcard Decks
                  </>
                ) : (
                  <>
                    <span className="p-2 bg-violet-100 text-violet-600 rounded-xl"><FaBrain size={24}/></span>
                    {selectedTopic?.topicName}
                  </>
                )}
              </h1>
            </div>
          </div>

          {view === "topics" && (
            <Button onClick={() => setShowGenerateModal(true)} className="shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 border-0">
              <FaWandMagicSparkles className="mr-2"/> Generate New Deck
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold flex justify-between">
             <span>{error}</span>
             <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {/* View Switcher */}
        <AnimatePresence mode="wait">
          {view === "topics" ? (
             <motion.div 
               key="topics"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
               {loading ? (
                  <div className="col-span-full py-20 flex justify-center"><Loader /></div>
               ) : topics.length === 0 ? (
                  <Card className="col-span-full text-center py-20 border-dashed border-2 border-slate-300 bg-transparent shadow-none">
                     <div className="inline-block p-6 bg-slate-100 rounded-full mb-4 text-slate-400 text-4xl">🎴</div>
                     <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-2">No Decks Found</h3>
                     <p className="text-[var(--text-tertiary)] mb-6">Create your first AI-Generated flashcard deck to start learning.</p>
                     <Button onClick={() => setShowGenerateModal(true)}>Create Deck</Button>
                  </Card>
               ) : (
                  topics.map((topic) => (
                    <motion.div key={topic.topicName} whileHover={{ y: -5 }}>
                      <Card 
                        className="cursor-pointer group hover:border-indigo-400 transition-all h-full flex flex-col justify-between"
                        onClick={() => selectTopic(topic)}
                      >
                         <div>
                           <div className="flex justify-between items-start mb-4">
                             <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                               topic.difficulty === 'easy' ? 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]' :
                               topic.difficulty === 'hard' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]' :
                               'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]'
                             }`}>
                               {topic.difficulty}
                             </span>
                             <button
                               onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic.topicName); }}
                               className="text-slate-300 hover:text-red-500 transition-colors"
                             >
                               <FaTrash />
                             </button>
                           </div>
                           
                           <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                             {topic.topicName}
                           </h3>
                           <p className="text-sm text-[var(--text-secondary)] font-medium mb-4">
                             {topic.subject || "General Knowledge"}
                           </p>

                           {/* Progress */}
                           <div className="space-y-2 mb-6">
                             <div className="flex justify-between text-xs font-bold text-[var(--text-tertiary)]">
                               <span>Progress</span>
                               <span>{Math.round((topic.viewed / topic.total) * 100) || 0}%</span>
                             </div>
                             <div className="h-2 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                 style={{ width: `${(topic.viewed / topic.total) * 100}%` }}
                               ></div>
                             </div>
                           </div>
                         </div>

                         <div className="flex gap-2 pt-4 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                           {['easy', 'medium', 'hard'].map(d => (
                              <button
                                key={d}
                                onClick={() => handleUpdateDifficulty(topic.topicName, d)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                                  topic.difficulty === d 
                                    ? 'bg-slate-800 text-white' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                {d}
                              </button>
                           ))}
                         </div>
                      </Card>
                    </motion.div>
                  ))
               )}
             </motion.div>
          ) : (
            <motion.div
               key="flashcards"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
            > 
               {loading ? (
                 <Loader />
               ) : (
                 <FlashcardList
                    flashcards={flashcards}
                    onMarkDifficulty={handleMarkViewed}
                    studyMode={true}
                 />
               )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
              <Card className="p-8">
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-2">
                  <FaWandMagicSparkles className="text-indigo-600"/> Generate Deck
                </h3>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Topic Name</label>
                    <input
                      value={generateForm.topic}
                      onChange={(e) => setGenerateForm({ ...generateForm, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                      placeholder="e.g. Photosynthesis"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Subject (Optional)</label>
                    <input
                       value={generateForm.subject}
                       onChange={(e) => setGenerateForm({ ...generateForm, subject: e.target.value })}
                       className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                       placeholder="e.g. Biology"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowGenerateModal(false)} fullWidth>Cancel</Button>
                    <Button type="submit" loading={generating} fullWidth variant="primary" className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] border-0">
                      Generate
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Flashcards;
