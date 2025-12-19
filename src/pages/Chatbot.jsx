import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";
import { FaPlus, FaHistory, FaTrash, FaEdit, FaCheck, FaTimes, FaComments, FaRobot } from "react-icons/fa";
import Loader from "../components/Common/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import { useTour } from "../context/TourContext";

const Chatbot = () => {
  const { isGuestMode } = useTour();
  const [messages, setMessages] = useState(isGuestMode ? [
    { sender: "bot", text: "Hey there! 👋 I'm Medha AI. Since you're on a tour, I've pre-loaded some examples for you!" },
    { sender: "user", text: "What is photosynthesis?" },
    { sender: "bot", text: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. In plants, photosynthesis generally involves the green pigment chlorophyll and generates oxygen as a byproduct. 🌿" }
  ] : [
    { sender: "bot", text: "Hey there! 👋 I'm Medha AI, your intelligent study companion. Ask me anything about your syllabus, concepts, or even current events!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState(isGuestMode ? [
    { _id: '1', title: 'Biology Basics', updatedAt: new Date() },
    { _id: '2', title: 'Calculus Review', updatedAt: new Date() }
  ] : []);
  const [currentSessionId, setCurrentSessionId] = useState(isGuestMode ? '1' : null);
  const [showHistory, setShowHistory] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (token) {
      fetchSessions();
      // On mobile, hide history by default
      if (window.innerWidth < 768) setShowHistory(false);
    }
  }, []);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/sessions`, { headers });
      setSessions(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/sessions/${sessionId}`, { headers });
      const loadedMessages = res.data.messages.map(msg => ({
        sender: msg.role === "user" ? "user" : "bot",
        text: msg.content
      }));
      setMessages(loadedMessages.length > 0 ? loadedMessages : [
        { sender: "bot", text: "Hey there! 👋 I'm Medha AI. Ask me anything!" }
      ]);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/chat/sessions`, { title: "New Chat" }, { headers });
      setSessions([res.data, ...sessions]);
      setCurrentSessionId(res.data._id);
      setMessages([{ sender: "bot", text: "Hey there! 👋 I'm Medha AI. What's on your mind?" }]);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/sessions/${sessionId}`, { headers });
      setSessions(sessions.filter(s => s._id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([{ sender: "bot", text: "Hey there! 👋 Chat deleted. Start a new one!" }]);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const updateTitle = async (sessionId) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/chat/sessions/${sessionId}`, { title: editTitle }, { headers });
      setSessions(sessions.map(s => s._id === sessionId ? { ...s, title: editTitle } : s));
      setEditingId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { sender: "user", text: message }]);
    setIsTyping(true);

    try {
      let sessionId = currentSessionId;
      if (!sessionId && token) {
        const res = await axios.post(`${BACKEND_URL}/api/chat/sessions`, { title: "New Chat" }, { headers });
        sessionId = res.data._id;
        setCurrentSessionId(sessionId);
        setSessions([res.data, ...sessions]);
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/chatbot/ask`,
        { input: message, sessionId },
        { headers }
      );

      setMessages(prev => [...prev, { sender: "bot", text: response.data.answer }]);
      fetchSessions(); // Refresh list to update message counts or titles
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Oops! Something went wrong. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 h-[calc(100vh-4rem)] flex bg-white z-0">
      
      {/* Mobile Overlay */}
      {showHistory && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setShowHistory(false)}
        />
      )}

      {/* Sidebar */}
      {token && (
        <div 
          className={`absolute md:relative z-30 h-full bg-slate-50 border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col ${
            showHistory ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-20'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200 h-16">
            {showHistory ? (
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <FaHistory className="text-indigo-500" /> History
              </span>
            ) : (
               <div className="w-full flex justify-center">
                  <FaHistory className="text-slate-400" />
               </div>
            )}
            <button
               onClick={() => setShowHistory(!showHistory)}
               className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors md:block hidden"
            >
               <FaComments />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
             <button
               onClick={() => {
                  createNewChat();
                  if (window.innerWidth < 768) setShowHistory(false);
               }}
               className={`w-full flex items-center gap-2 py-3 px-4 rounded-xl shadow-sm border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 font-bold transition-all hover:shadow-md ${!showHistory ? 'justify-center' : ''}`}
               title="New Chat"
             >
                <FaPlus /> {showHistory && <span>New Chat</span>}
             </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
             {loadingSessions ? (
               <div className="py-10 flex justify-center opacity-50"><Loader /></div>
             ) : (
                sessions.map(session => (
                   <div
                     key={session._id}
                     onClick={() => {
                        loadSession(session._id);
                        if (window.innerWidth < 768) setShowHistory(false);
                     }}
                     className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                        currentSessionId === session._id ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-200 text-slate-700'
                     }`}
                   >
                     {editingId === session._id ? (
                        <div className="flex items-center gap-1 bg-white rounded p-1" onClick={e => e.stopPropagation()}>
                           <input 
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="w-full text-xs text-slate-800 outline-none"
                              autoFocus
                           />
                           <button onClick={() => updateTitle(session._id)} className="text-emerald-500"><FaCheck size={12}/></button>
                           <button onClick={() => setEditingId(null)} className="text-red-500"><FaTimes size={12}/></button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3">
                           {showHistory && (
                              <div className="flex-1 min-w-0">
                                 <p className={`text-sm font-medium truncate ${currentSessionId === session._id ? 'text-white' : 'text-slate-700'}`}>
                                    {session.title || "Untitled Chat"}
                                 </p>
                                 <p className={`text-[10px] truncate ${currentSessionId === session._id ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {new Date(session.updatedAt || Date.now()).toLocaleDateString()}
                                 </p>
                              </div>
                           )}
                           {!showHistory && (
                              <div className="mx-auto"><FaComments className={currentSessionId === session._id ? 'text-white' : 'text-slate-400'}/></div>
                           )}

                           {showHistory && (
                              <div className={`flex gap-1 ${currentSessionId === session._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingId(session._id); setEditTitle(session.title); }}
                                    className={`p-1.5 rounded hover:bg-white/20 ${currentSessionId === session._id ? 'text-white' : 'text-slate-500'}`}
                                 >
                                    <FaEdit size={10} />
                                 </button>
                                 <button 
                                    onClick={(e) => deleteSession(session._id, e)}
                                    className={`p-1.5 rounded hover:bg-white/20 ${currentSessionId === session._id ? 'text-white' : 'text-red-400'}`}
                                 >
                                    <FaTrash size={10} />
                                 </button>
                              </div>
                           )}
                        </div>
                     )}
                   </div>
                ))
             )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative min-w-0">
         {/* Mobile Header Toggle */}
         <div className="md:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
            <h2 className="font-bold flex items-center gap-2 text-indigo-600"><FaRobot/> Medha AI</h2>
            <button onClick={() => setShowHistory(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
               <FaHistory />
            </button>
         </div>

         <ChatbotWidget
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
         />
      </div>
    </div>
  );
};

export default Chatbot;
