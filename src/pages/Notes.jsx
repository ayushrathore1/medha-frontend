import React, { useEffect, useState, useRef, useMemo } from "react";
import NoteModal from "./NoteModal";
import TextNoteForm from "../components/Notes/TextNoteForm";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaGlobe, FaMagnifyingGlass, FaUpload, FaPlus, FaCloudArrowUp, FaFileLines, FaTrash, FaPen, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp, FaFolder, FaFolderOpen, FaCircleInfo, FaHeart, FaRegHeart } from "react-icons/fa6";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

import { useTour } from "../context/TourContext";

const Notes = () => {
  const { isGuestMode } = useTour();
  const [activeTab, setActiveTab] = useState("my-notes"); // "my-notes" | "explore"
  const [notes, setNotes] = useState(isGuestMode ? [
    { _id: '1', title: 'Cell Biology Notes', content: 'Discussion on mitochondria and nucleus...', createdAt: new Date(), isPublic: false },
    { _id: '2', title: 'Compiler Design', content: 'Lexical analysis and parsing techniques...', createdAt: new Date(), isPublic: true }
  ] : []);
  const [publicNotes, setPublicNotes] = useState(isGuestMode ? [
    { _id: 'p1', title: 'Organic Chemistry Basics', content: 'Introduction to carbon compounds...', subject: { _id: 'ps1', name: 'Chemistry' }, owner: { name: 'Priya S.' }, likes: ['u1', 'u2'], isPublic: true },
    { _id: 'p2', title: 'Newton\'s Laws of Motion', content: 'First, second, and third law explained...', subject: { _id: 'ps2', name: 'Physics' }, owner: { name: 'Rahul M.' }, likes: [], isPublic: true },
    { _id: 'p3', title: 'Data Structures - Trees', content: 'Binary trees, AVL trees, and heaps...', subject: { _id: 'ps3', name: 'Computer Science' }, owner: { name: 'Alex K.' }, likes: ['u1'], isPublic: true }
  ] : []);
  const [subjects, setSubjects] = useState(isGuestMode ? [
    { _id: 's1', name: 'Biology' },
    { _id: 's2', name: 'Computer Science' }
  ] : []);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(!isGuestMode);
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(!isGuestMode);
  const [viewNote, setViewNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
  
  // Get current user ID (simple decode for UI update, ideally from context)
  const getUserId = () => {
    try {
      if(!token) return null;
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch(e) { return null; }
  }
  const currentUserId = getUserId();

  // Explore page state
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

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

  // Fetch user's notes
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

  // Fetch public notes
  const fetchPublicNotes = async (search = "") => {
    setLoadingPublic(true);
    try {
      const url = search 
        ? `${API_BASE}/api/notes/public?search=${encodeURIComponent(search)}`
        : `${API_BASE}/api/notes/public`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPublicNotes(data.notes || []);
      }
    } catch {
      console.error("Error fetching public notes");
    }
    setLoadingPublic(false);
  };

  useEffect(() => {
    if (activeTab === "explore") {
      fetchPublicNotes(searchQuery);
    }
  }, [activeTab, searchQuery]);

  // Toggle visibility
  const toggleVisibility = async (noteId) => {
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}/visibility`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(notes.map(n => n._id === noteId ? { ...n, isPublic: data.note.isPublic } : n));
      }
    } catch {
      setErrorMsg("Failed to update visibility");
    }
  };

  // Toggle Like
  const toggleLike = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Update state in publicNotes
        setPublicNotes(publicNotes.map(n => {
           if(n._id === noteId) {
             const newLikes = data.isLiked 
                ? [...(n.likes || []), currentUserId] 
                : (n.likes || []).filter(id => id !== currentUserId);
             return { ...n, likes: newLikes };
           }
           return n;
        }));
      }
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

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
    if (!editTitle.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
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
          subject: selectedSubject,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(notes.map((n) => n._id === editingNote ? data.note : n));
        handleEditCancel();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update note.");
      }
    } catch {
      setErrorMsg("Server error updating note.");
    }
    setUpdating(false);
  };

  const handleUpload = async () => {
    if (!uploadTitle.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!file || !selectedSubject) {
      setErrorMsg("Please select a file and subject.");
      return;
    }
    setUploading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", selectedSubject);
    formData.append("title", uploadTitle);

    try {
      const res = await fetch(`${API_BASE}/api/notes`, {
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
        setErrorMsg(data.error || "Failed to upload file.");
      }
    } catch {
      setErrorMsg("Server error uploading file.");
    }
    setUploading(false);
  };

  const handleTextNoteSubmit = async ({ title, content }) => {
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
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
        body: JSON.stringify({ title, content, subject: selectedSubject }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([data.note, ...notes]);
      } else {
        setErrorMsg(data.error || "Failed to create note.");
      }
    } catch {
      setErrorMsg("Server error creating note.");
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotes(notes.filter((n) => n._id !== noteId));
      } else {
        setErrorMsg("Failed to delete note.");
      }
    } catch {
      setErrorMsg("Server error deleting note.");
    }
  };

  const getOwnerName = (note) => {
    if (note.owner?.name) return note.owner.name;
    if (note.owner?.email) return note.owner.email.split("@")[0];
    return "Unknown";
  };

  const groupedNotes = useMemo(() => {
    const groups = {};
    publicNotes.forEach(note => {
      const subId = note.subject?._id || "unknown";
      const subName = note.subject?.name || "Uncategorized";
      
      if (!groups[subId]) {
        groups[subId] = {
          subjectId: subId,
          subjectName: subName,
          ownerName: getOwnerName(note),
          notes: []
        };
      }
      groups[subId].notes.push(note);
    });
    return Object.values(groups);
  }, [publicNotes]);

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Paper Trail</h1>
            <p className="text-[var(--text-secondary)] font-medium">Manage your academic resources.</p>
          </div>
          
          <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl shadow-sm border border-[var(--border-default)]">
            <button
              onClick={() => setActiveTab("my-notes")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "my-notes" 
                  ? "bg-[var(--action-primary)] text-white shadow-lg shadow-[var(--action-primary)]/20" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              <FaBook /> My Notes
            </button>
            <button
              data-tour="explore-tab"
              onClick={() => { setActiveTab("explore"); fetchPublicNotes(); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "explore" 
                  ? "bg-[var(--action-primary)] text-white shadow-lg shadow-[var(--action-primary)]/20" 
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--action-primary)]/50"
              }`}
            >
              <FaGlobe /> Explore
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex justify-between items-center">
            <span className="font-bold">{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-sm font-bold opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* My Notes Tab */}
        {activeTab === "my-notes" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar: Controls (Create/Upload) */}
            <div 
              data-tour="quick-notes"
              className="lg:col-span-4 space-y-6"
            >
              
              {/* Subject Select */}
              <Card data-tour="choose-subject">
                <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">1. Select Subject</h3>
                {loadingSubjects ? (
                  <Loader />
                ) : (
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] appearance-none font-bold focus:ring-2 focus:ring-[var(--action-primary)]/20 focus:border-[var(--action-primary)] outline-none"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">Choose Subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)]">▼</div>
                  </div>
                )}
              </Card>

              {/* Upload */}
              <Card data-tour="upload-note">
                <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Or Upload File</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Document Title"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] font-medium focus:outline-none focus:border-[var(--action-primary)]"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer hover:bg-[var(--bg-tertiary)] hover:border-[var(--action-primary)]/50 transition-colors"
                    >
                      <FaCloudArrowUp className="text-3xl text-[var(--text-tertiary)] mb-2" />
                      <span className="text-sm font-bold text-[var(--text-secondary)]">
                        {file ? file.name : "Click to browse"}
                      </span>
                    </label>
                  </div>
                  <Button onClick={handleUpload} loading={uploading} fullWidth disabled={!selectedSubject || !file} variant={file ? "primary" : "secondary"}>
                    Upload File
                  </Button>
                </div>
              </Card>

              {/* Create Text Note */}
              <Card data-tour="text-note">
                 <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Or Write Note</h3>
                 <TextNoteForm onSubmit={handleTextNoteSubmit} />
              </Card>
            </div>

            {/* Right: Notes List */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {selectedSubject ? subjects.find(s => s._id === selectedSubject)?.name || "Subject" : "All Notes"}
                </h3>
                <span className="text-sm font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-lg border border-[var(--border-default)]">
                  {notes.length} Files
                </span>
              </div>

              {loadingNotes ? (
                <div className="flex justify-center py-20"><Loader /></div>
              ) : notes.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-default)]">
                  <div className="inline-block p-4 bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] rounded-full mb-3"><FaFileLines size={32}/></div>
                  <p className="font-bold text-[var(--text-secondary)]">No notes found.</p>
                  <p className="text-[var(--text-tertiary)] text-sm">Select a subject and create/upload one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {notes.map((note) => (
                      <motion.div
                        key={note._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className="h-full flex flex-col justify-between group hover:border-[var(--action-primary)]/50 transition-colors">
                          {editingNote === note._id ? (
                            <div className="space-y-3">
                              <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                                placeholder="Title"
                              />
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm"
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <Button onClick={handleEditSave} loading={updating} size="sm">Save</Button>
                                <Button onClick={handleEditCancel} variant="ghost" size="sm">Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <div className={`p-2 rounded-lg ${note.isPublic ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]" : "bg-[var(--action-primary)]/10 text-[var(--action-primary)]"}`}>
                                    <FaFileLines />
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleEditStart(note)} className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--action-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg"><FaPen size={12}/></button>
                                     <button onClick={() => handleDelete(note._id)} className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--color-danger-text)] hover:bg-[var(--bg-tertiary)] rounded-lg"><FaTrash size={12}/></button>
                                  </div>
                                </div>
                                <h4 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1 mb-1" title={note.title}>
                                  {note.title || "Untitled Note"}
                                </h4>
                                <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-4">
                                  {new Date(note.createdAt).toLocaleDateString()} • {note.fileUrl ? "PDF/Image" : "Text Note"}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 h-10">
                                  {note.content || note.extractedText || "No preview available."}
                                </p>
                              </div>

                              <div className="flex gap-2 mt-auto">
                                <Button onClick={() => setViewNote(note)} variant="secondary" size="sm" fullWidth className="text-xs">
                                  View
                                </Button>
                                <Button 
                                  onClick={() => toggleVisibility(note._id)} 
                                  variant={note.isPublic ? "ghost" : "ghost"}
                                  className={`${note.isPublic ? "text-[var(--color-success-text)] bg-[var(--color-success-bg)]" : "text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]"}`}
                                  size="sm"
                                >
                                  {note.isPublic ? <FaGlobe title="Public"/> : <FaEyeSlash title="Private"/>}
                                </Button>
                              </div>
                            </>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explore Tab */}
        {activeTab === "explore" && (
          <div className="space-y-6">
            
            {/* Disclaimer */}
            <div className="bg-[var(--color-warning-bg)]/10 border border-[var(--color-warning-bg)]/20 rounded-xl p-4 flex items-start gap-4 mx-auto max-w-3xl">
              <FaCircleInfo className="text-[var(--color-warning-text)] text-xl shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[var(--color-warning-text)]">Community Disclaimer</h3>
                <p className="text-sm text-[var(--color-warning-text)]/80">
                  These notes are uploaded by students and the community. Medha does not claim ownership or copyright over this content. Use them for educational reference only.
                </p>
              </div>
            </div>

            <div data-tour="explore-search" className="max-w-2xl mx-auto">
               <div className="relative">
                 <FaMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for topics, notes, or authors..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[var(--border-default)] shadow-xl shadow-[var(--action-primary)]/5 bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--action-primary)]/10 font-medium text-lg"
                 />
                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Button onClick={() => fetchPublicNotes(searchQuery)} size="sm">Search</Button>
                 </div>
               </div>
            </div>

            {loadingPublic ? (
               <div className="py-20 flex justify-center"><Loader /></div>
            ) : publicNotes.length === 0 ? (
               <div className="text-center py-20">
                 <p className="text-xl font-bold text-[var(--text-tertiary)]">No public notes found matching your search.</p>
               </div>
            ) : (
               <div data-tour="explore-folders" className="space-y-4">
                 {groupedNotes.map((group) => (
                   <div key={group.subjectId} className="border border-[var(--border-default)] rounded-xl bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
                     <button
                       onClick={() => toggleSubject(group.subjectId)}
                       className="w-full flex items-center justify-between p-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                     >
                       <div className="flex items-center gap-3">
                         <div className={`text-xl ${expandedSubjects[group.subjectId] ? "text-[var(--action-primary)]" : "text-[var(--text-tertiary)]"}`}>
                           {expandedSubjects[group.subjectId] ? <FaFolderOpen /> : <FaFolder />}
                         </div>
                         <div>
                           <h3 className="font-bold text-[var(--text-primary)] text-lg">{group.subjectName}</h3>
                           <p className="text-xs font-semibold text-[var(--text-secondary)]">By {group.ownerName} • {group.notes.length} Files</p>
                         </div>
                       </div>
                       <div className="text-[var(--text-tertiary)]">
                         {expandedSubjects[group.subjectId] ? <FaChevronUp /> : <FaChevronDown />}
                       </div>
                     </button>
                     
                     <AnimatePresence>
                       {expandedSubjects[group.subjectId] && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="border-t border-[var(--border-default)]"
                         >
                           <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-[var(--bg-tertiary)]/20">
                             {group.notes.map((note) => (
                               <motion.div
                                 key={note._id}
                                 whileHover={{ y: -3 }}
                                 onClick={() => setViewNote(note)}
                                 className="cursor-pointer"
                               >
                                  <Card className="h-full border-[var(--border-default)] hover:border-[var(--action-primary)]/50 transition-colors bg-[var(--bg-secondary)]">
                                     <div className="flex justify-between items-start mb-3">
                                        <div className="p-1.5 bg-[var(--action-primary)]/10 text-[var(--action-primary)] rounded-lg text-sm"><FaGlobe /></div>
                                        <div className="flex items-center gap-2">
                                           {note.fileUrl && (
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                                                PDF
                                              </span>
                                           )}
                                        {/* Like Button */}
                                          <button 
                                            onClick={(e) => toggleLike(e, note._id)}
                                            className="flex items-center gap-1 text-[var(--text-tertiary)] hover:text-pink-500 transition-colors"
                                          >
                                            {note.likes?.includes(currentUserId) ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
                                            <span className="text-xs font-bold">{note.likes?.length || 0}</span>
                                          </button>
                                        </div>
                                     </div>
                                     <h4 className="font-bold text-[var(--text-primary)] mb-1 line-clamp-1 text-sm">{note.title}</h4>
                                     <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 mb-3 h-8">
                                       {note.content || note.extractedText || "No preview"}
                                     </p>
                                     <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-default)]">
                                        <div className="w-5 h-5 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-tertiary)]">
                                          {getOwnerName(note).charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[10px] font-bold text-[var(--text-tertiary)] line-clamp-1">{getOwnerName(note)}</span>
                                     </div>
                                  </Card>
                               </motion.div>
                             ))}
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 ))}
               </div>
             )}
           </div>
         )}

        {viewNote && (
          <NoteModal note={viewNote} onClose={() => setViewNote(null)} />
        )}
      </div>
    </div>
  );
};

export default Notes;

