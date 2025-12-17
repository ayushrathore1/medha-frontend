import React, { useEffect, useState, useRef, useMemo } from "react";
import NoteModal from "./NoteModal";
import TextNoteForm from "../components/Notes/TextNoteForm";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaGlobe, FaSearch, FaUpload, FaPlus, FaCloudUploadAlt, FaFileAlt, FaTrash, FaPen, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp, FaFolder, FaFolderOpen, FaInfoCircle, FaHeart, FaRegHeart } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

const Notes = () => {
  const [activeTab, setActiveTab] = useState("my-notes"); // "my-notes" | "explore"
  const [notes, setNotes] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
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
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paper Trail</h1>
            <p className="text-slate-500 font-medium">Manage your academic resources.</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab("my-notes")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "my-notes" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <FaBook /> My Notes
            </button>
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "explore" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-500 hover:bg-slate-50"
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
            <div className="lg:col-span-4 space-y-6">
              
              {/* Subject Select */}
              <Card>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">1. Select Subject</h3>
                {loadingSubjects ? (
                  <Loader />
                ) : (
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 appearance-none font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">Choose Subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                  </div>
                )}
              </Card>

              {/* Upload */}
              <Card>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Or Upload File</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Document Title"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-500"
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
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-colors"
                    >
                      <FaCloudUploadAlt className="text-3xl text-slate-400 mb-2" />
                      <span className="text-sm font-bold text-slate-500">
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
              <Card>
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Or Write Note</h3>
                 <TextNoteForm onSubmit={handleTextNoteSubmit} />
              </Card>
            </div>

            {/* Right: Notes List */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedSubject ? subjects.find(s => s._id === selectedSubject)?.name || "Subject" : "All Notes"}
                </h3>
                <span className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {notes.length} Files
                </span>
              </div>

              {loadingNotes ? (
                <div className="flex justify-center py-20"><Loader /></div>
              ) : notes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                  <div className="inline-block p-4 bg-slate-50 text-slate-400 rounded-full mb-3"><FaFileAlt size={32}/></div>
                  <p className="font-bold text-slate-500">No notes found.</p>
                  <p className="text-slate-400 text-sm">Select a subject and create/upload one!</p>
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
                        <Card className="h-full flex flex-col justify-between group hover:border-indigo-300 transition-colors">
                          {editingNote === note._id ? (
                            <div className="space-y-3">
                              <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300"
                                placeholder="Title"
                              />
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
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
                                  <div className={`p-2 rounded-lg ${note.isPublic ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}>
                                    <FaFileAlt />
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleEditStart(note)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"><FaPen size={12}/></button>
                                     <button onClick={() => handleDelete(note._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg"><FaTrash size={12}/></button>
                                  </div>
                                </div>
                                <h4 className="font-bold text-lg text-slate-800 line-clamp-1 mb-1" title={note.title}>
                                  {note.title || "Untitled Note"}
                                </h4>
                                <p className="text-xs font-semibold text-slate-400 mb-4">
                                  {new Date(note.createdAt).toLocaleDateString()} • {note.fileUrl ? "PDF/Image" : "Text Note"}
                                </p>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
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
                                  className={`${note.isPublic ? "text-emerald-600 bg-emerald-50" : "text-slate-500 bg-slate-50"}`}
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
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4 mx-auto max-w-3xl">
              <FaInfoCircle className="text-amber-500 text-xl shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800">Community Disclaimer</h3>
                <p className="text-sm text-amber-900/80">
                  These notes are uploaded by students and the community. Medha does not claim ownership or copyright over this content. Use them for educational reference only.
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
               <div className="relative">
                 <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for topics, notes, or authors..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-xl shadow-indigo-500/5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium text-lg"
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
                 <p className="text-xl font-bold text-slate-400">No public notes found matching your search.</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {groupedNotes.map((group) => (
                   <div key={group.subjectId} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                     <button
                       onClick={() => toggleSubject(group.subjectId)}
                       className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                     >
                       <div className="flex items-center gap-3">
                         <div className={`text-xl ${expandedSubjects[group.subjectId] ? "text-indigo-600" : "text-slate-400"}`}>
                           {expandedSubjects[group.subjectId] ? <FaFolderOpen /> : <FaFolder />}
                         </div>
                         <div>
                           <h3 className="font-bold text-slate-800 text-lg">{group.subjectName}</h3>
                           <p className="text-xs font-semibold text-slate-500">By {group.ownerName} • {group.notes.length} Files</p>
                         </div>
                       </div>
                       <div className="text-slate-400">
                         {expandedSubjects[group.subjectId] ? <FaChevronUp /> : <FaChevronDown />}
                       </div>
                     </button>
                     
                     <AnimatePresence>
                       {expandedSubjects[group.subjectId] && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="border-t border-slate-200"
                         >
                           <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-slate-50/30">
                             {group.notes.map((note) => (
                               <motion.div
                                 key={note._id}
                                 whileHover={{ y: -3 }}
                                 onClick={() => setViewNote(note)}
                                 className="cursor-pointer"
                               >
                                  <Card className="h-full border-slate-200 hover:border-indigo-400 transition-colors bg-white">
                                     <div className="flex justify-between items-start mb-3">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm"><FaGlobe /></div>
                                        <div className="flex items-center gap-2">
                                           {note.fileUrl && (
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                PDF
                                              </span>
                                           )}
                                        {/* Like Button */}
                                          <button 
                                            onClick={(e) => toggleLike(e, note._id)}
                                            className="flex items-center gap-1 text-slate-400 hover:text-pink-500 transition-colors"
                                          >
                                            {note.likes?.includes(currentUserId) ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
                                            <span className="text-xs font-bold">{note.likes?.length || 0}</span>
                                          </button>
                                        </div>
                                     </div>
                                     <h4 className="font-bold text-slate-800 mb-1 line-clamp-1 text-sm">{note.title}</h4>
                                     <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                                       {note.content || note.extractedText || "No preview"}
                                     </p>
                                     <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                          {getOwnerName(note).charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 line-clamp-1">{getOwnerName(note)}</span>
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

