import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoteModal from "./NoteModal";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaMagnifyingGlass, FaCloudArrowUp, FaBookOpen, FaCircleInfo, FaHeart, FaRegHeart, FaUser, FaLock, FaUnlock, FaPlus, FaTag, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import useAuthGuard from "../hooks/useAuthGuard";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

import { useTour } from "../context/TourContext";

// Subject tag colors - generates consistent color based on subject name
const SUBJECT_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-500" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-500" },
  { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: "text-green-500" },
  { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", icon: "text-orange-500" },
  { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200", icon: "text-pink-500" },
  { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200", icon: "text-cyan-500" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" },
  { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", icon: "text-indigo-500" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", icon: "text-rose-500" },
  { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200", icon: "text-teal-500" },
];

const getSubjectColor = (subjectName) => {
  if (!subjectName) return SUBJECT_COLORS[0];
  // Generate consistent color index based on subject name
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
};

const Notes = () => {
  const { isGuestMode } = useTour();
  const { isAuthenticated, requireAuth } = useAuthGuard();
  
  const [publicNotes, setPublicNotes] = useState(isGuestMode ? [
    { _id: 'p1', title: 'Organic Chemistry Basics', content: 'Introduction to carbon compounds...', subjectTag: 'Chemistry', owner: { name: 'Priya S.' }, likes: ['u1', 'u2'], isPublic: true },
    { _id: 'p2', title: 'Newton\'s Laws of Motion', content: 'First, second, and third law explained...', subjectTag: 'Physics', owner: { name: 'Rahul M.' }, likes: [], isPublic: true },
    { _id: 'p3', title: 'Data Structures - Trees', content: 'Binary trees, AVL trees, and heaps...', subjectTag: 'Computer Science', owner: { name: 'Alex K.' }, likes: ['u1'], isPublic: true }
  ] : []);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState(null);
  const [activeUploaderFilter, setActiveUploaderFilter] = useState(null);
  /* Removed duplicates */
  const [showFilters, setShowFilters] = useState(false);
  
  // User Search Suggestions
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // For upload
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [subjectTag, setSubjectTag] = useState("");
  const [isPublicUpload, setIsPublicUpload] = useState(true);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [showAuraAnimation, setShowAuraAnimation] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  
  // Get current user ID
  const getUserId = () => {
    try {
      if(!token) return null;
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch(e) { return null; }
  }
  const currentUserId = getUserId();

  // Fetch public notes
  const fetchPublicNotes = async (search = "") => {
    setLoadingPublic(true);
    try {
      const url = search 
        ? `${API_BASE}/api/notes/public?search=${encodeURIComponent(search)}`
        : `${API_BASE}/api/notes/public`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
    // Fetch public notes immediately (or debounced if desired, but kept simple here)
    fetchPublicNotes(searchQuery);

    // Debounce user search suggestions
    const timer = setTimeout(() => {
        if (searchQuery.length >= 2) {
            fetchUserSuggestions(searchQuery);
        } else {
            setSuggestedUsers([]);
            setShowSuggestions(false);
        }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUserSuggestions = async (query) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setSuggestedUsers(data.users || []);
        setShowSuggestions(true);
      }
    } catch (e) {
      console.error("Error searching users", e);
    }
  };

  // Toggle Like
  const toggleLike = async (e, noteId) => {
    e.stopPropagation();
    if (!isAuthenticated && !isGuestMode) {
      requireAuth(() => {}, 'Liking Notes');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
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

  const handleUpload = async () => {
    if (!isAuthenticated && !isGuestMode) {
      requireAuth(() => {}, 'Uploading Notes');
      return;
    }
    if (!uploadTitle.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!file || !subjectTag.trim()) {
      setErrorMsg("Please select a file and enter a subject tag.");
      return;
    }
    setUploading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectTag", subjectTag.trim());
    formData.append("title", uploadTitle);
    formData.append("isPublic", isPublicUpload);

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
        setSubjectTag("");
        setShowUploadPanel(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (isPublicUpload) {
          fetchPublicNotes(searchQuery);
        }
        setErrorMsg("");
        // Show AURA++ animation
        setShowAuraAnimation(true);
        setTimeout(() => setShowAuraAnimation(false), 3000);
      } else {
        setErrorMsg(data.error || "Failed to upload file.");
      }
    } catch {
      setErrorMsg("Server error uploading file.");
    }
    setUploading(false);
  };

  const getOwnerName = (note) => {
    if (note.owner?.name) return note.owner.name;
    if (note.owner?.email) return note.owner.email.split("@")[0];
    return "Unknown";
  };

  // Get subject name from note (support both old and new format)
  const getSubjectName = (note) => {
    if (note.subjectTag) return note.subjectTag;
    if (note.subject?.name) return note.subject.name;
    return "General";
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent relative">
      {/* AURA++ Animation */}
      <AnimatePresence>
        {showAuraAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.8)",
                  "0 0 60px rgba(251, 191, 36, 1)",
                  "0 0 20px rgba(251, 191, 36, 0.8)"
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl md:text-8xl font-black"
              style={{
                background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(251, 191, 36, 0.6))"
              }}
            >
              AURA++
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Notes Community</h1>
            <p className="text-[var(--text-secondary)] font-medium">Discover and share study materials with fellow students.</p>
          </div>
          
          {/* Upload Button */}
          <Button 
            onClick={() => {
              if (isAuthenticated || isGuestMode) {
                setShowUploadPanel(!showUploadPanel);
              } else {
                requireAuth(() => setShowUploadPanel(true), 'Uploading Notes');
              }
            }}
            variant={showUploadPanel ? "secondary" : "primary"}
            className="flex items-center gap-2"
          >
            <FaPlus /> Share Your Notes
          </Button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex justify-between items-center">
            <span className="font-bold">{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-sm font-bold opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Upload Panel - Collapsible */}
        <AnimatePresence>
          {showUploadPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="border-2 border-dashed border-[var(--action-primary)]/30 bg-[var(--action-primary)]/5">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Inputs */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <FaCloudArrowUp className="text-[var(--action-primary)]" />
                      Upload New Note
                    </h3>
                    
                    {/* Title */}
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Note Title (e.g., 'Data Structures - Unit 3')"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] font-medium focus:outline-none focus:border-[var(--action-primary)]"
                    />
                    
                    {/* Subject Tag Input */}
                    <div className="relative">
                      <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                      <input
                        type="text"
                        value={subjectTag}
                        onChange={(e) => setSubjectTag(e.target.value)}
                        placeholder="Subject Tag (e.g., 'Physics', 'Data Structures')"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] font-medium focus:outline-none focus:border-[var(--action-primary)]"
                      />
                      {subjectTag && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSubjectColor(subjectTag).bg} ${getSubjectColor(subjectTag).text} border ${getSubjectColor(subjectTag).border}`}>
                            {subjectTag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[var(--text-secondary)]">Visibility:</span>
                      <button 
                        onClick={() => setIsPublicUpload(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isPublicUpload ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-2 border-[var(--color-success-text)]" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-2 border-transparent"}`}
                      >
                        <FaUnlock /> Public
                      </button>
                      <button 
                        onClick={() => setIsPublicUpload(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${!isPublicUpload ? "bg-[var(--action-primary)]/20 text-[var(--action-primary)] border-2 border-[var(--action-primary)]" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-2 border-transparent"}`}
                      >
                        <FaLock /> Private
                      </button>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {isPublicUpload ? "Public notes will appear in the community for everyone to access." : "Private notes are only visible to you."}
                    </p>
                  </div>

                  {/* Right: File Drop */}
                  <div className="flex-1 flex flex-col justify-between">
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
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer hover:bg-[var(--bg-tertiary)] hover:border-[var(--action-primary)]/50 transition-colors bg-[var(--bg-secondary)]"
                      >
                        <FaCloudArrowUp className="text-3xl text-[var(--text-tertiary)] mb-2" />
                        <span className="text-sm font-bold text-[var(--text-secondary)]">
                          {file ? file.name : "Click to select PDF or Image"}
                        </span>
                      </label>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleUpload} loading={uploading} fullWidth disabled={!subjectTag.trim() || !file || !uploadTitle.trim()}>
                        Upload Note
                      </Button>
                      <Button onClick={() => setShowUploadPanel(false)} variant="ghost">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="bg-[var(--color-warning-bg)]/10 border border-[var(--color-warning-bg)]/20 rounded-xl p-4 flex items-start gap-4">
          <FaCircleInfo className="text-[var(--color-warning-text)] text-xl shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[var(--color-warning-text)]">Community Notes</h3>
            <p className="text-sm text-[var(--color-warning-text)]/80">
              Notes are uploaded by students. Medha does not claim ownership over this content. Use for educational reference only.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
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
             
             {/* User Suggestions Dropdown */}
             {showSuggestions && suggestedUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl shadow-xl z-50 overflow-hidden">
                  {suggestedUsers.map(user => (
                    <div 
                      key={user._id}
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="p-3 hover:bg-[var(--bg-tertiary)] cursor-pointer flex items-center gap-3 border-b border-[var(--border-default)] last:border-none"
                    >
                       <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shrink-0">
                          {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.name}</p>
                         <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
                       </div>
                       <div className="text-xs font-bold text-[var(--action-primary)] px-2 py-1 bg-[var(--action-primary)]/10 rounded-lg whitespace-nowrap">
                          View Profile
                       </div>
                    </div>
                  ))}
                </div>
             )}
           </div>
        </div>

        {/* Filter Toggle */}
        {publicNotes.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <FaFilter size={12} />
              Filters
              {(activeTagFilter || activeUploaderFilter) && (
                <span className="w-2 h-2 rounded-full bg-[var(--action-primary)]"></span>
              )}
              {showFilters ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2"
                >
                  {/* Subject Tags Filter */}
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-default)]">
                    <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wide">Tags:</span>
                    <button
                      onClick={() => setActiveTagFilter(null)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!activeTagFilter ? 'bg-[var(--action-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                    >
                      All
                    </button>
                    {[...new Set(publicNotes.map(n => getSubjectName(n)))].slice(0, 6).map(tag => {
                      const colors = getSubjectColor(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${activeTagFilter === tag ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-default)]'}`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Uploaders Filter */}
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-default)]">
                    <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wide">By:</span>
                    <button
                      onClick={() => setActiveUploaderFilter(null)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!activeUploaderFilter ? 'bg-[var(--action-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                    >
                      All
                    </button>
                    {[...new Map(publicNotes.map(n => [n.owner?._id, { id: n.owner?._id, name: getOwnerName(n) }])).values()].slice(0, 5).map(uploader => (
                      <button
                        key={uploader.id}
                        onClick={() => setActiveUploaderFilter(activeUploaderFilter === uploader.id ? null : uploader.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${activeUploaderFilter === uploader.id ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                      >
                        <FaUser size={10} />
                        {uploader.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Notes Grid - Flat Layout with Subject Tags */}
        {loadingPublic ? (
           <div className="py-20 flex justify-center"><Loader /></div>
        ) : publicNotes.length === 0 ? (
           <div className="text-center py-20">
             <div className="inline-block p-4 bg-sky-100 text-sky-500 rounded-full mb-3"><FaBookOpen size={32}/></div>
             <p className="text-xl font-bold text-[var(--text-tertiary)]">No notes found.</p>
             <p className="text-[var(--text-secondary)] mt-2">Be the first to share your study materials!</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {publicNotes
               .filter(note => !activeTagFilter || getSubjectName(note) === activeTagFilter)
               .filter(note => !activeUploaderFilter || note.owner?._id === activeUploaderFilter)
               .map((note) => {
               const subjectName = getSubjectName(note);
               const colors = getSubjectColor(subjectName);
               
               return (
                 <motion.div
                   key={note._id}
                   whileHover={{ y: -3, scale: 1.02 }}
                   onClick={() => setViewNote(note)}
                   className="cursor-pointer"
                 >
                    <Card className="h-full border-[var(--border-default)] hover:border-[var(--action-primary)]/50 transition-all bg-[var(--bg-secondary)] hover:shadow-lg">
                       <div className="flex justify-between items-start mb-3">
                          {/* Book Icon with Subject Color */}
                          <div className={`p-2 rounded-xl ${colors.bg}`}>
                            <FaBookOpen className={`text-xl ${colors.icon}`} />
                          </div>
                          <div className="flex items-center gap-2">
                             {note.fileUrl && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                                  PDF
                                </span>
                             )}
                            <button 
                              onClick={(e) => toggleLike(e, note._id)}
                              className="flex items-center gap-1 text-[var(--text-tertiary)] hover:text-pink-500 transition-colors"
                            >
                              {currentUserId && note.likes?.includes(currentUserId) ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
                              <span className="text-xs font-bold">{note.likes?.length || 0}</span>
                            </button>
                          </div>
                       </div>
                       
                       {/* Subject Tag */}
                       <div className="mb-2">
                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                           <FaTag size={8} />
                           {subjectName}
                         </span>
                       </div>
                       
                       <h4 className="font-bold text-[var(--text-primary)] mb-1 line-clamp-2 text-sm">{note.title}</h4>
                       <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-default)]">
                          <Link 
                            to={note.owner?._id ? `/profile/${note.owner._id}` : "#"} 
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity group/owner" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="w-5 h-5 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-tertiary)] ring-1 ring-[var(--border-default)] group-hover/owner:ring-[var(--action-primary)] transition-all">
                              {note.owner?.avatar ? (
                                <img src={note.owner.avatar} alt="Owner" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <FaUser size={10} />
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] line-clamp-1 group-hover/owner:text-[var(--action-primary)] transition-colors">{getOwnerName(note)}</span>
                          </Link>
                       </div>
                    </Card>
                 </motion.div>
               );
             })}
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
