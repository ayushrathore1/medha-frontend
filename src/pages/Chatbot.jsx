import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";
import { FaPlus, FaHistory, FaTrash, FaEdit, FaCheck, FaTimes, FaComments, FaRobot } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey there! 👋 I'm Medha AI, your intelligent study companion. Ask me anything about your syllabus, concepts, or even current events!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (token) {
      fetchSessions();
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
        { sender: "bot", text: "Hey there! 👋 I'm Medha AI, your intelligent study companion. Ask me anything!" }
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
      setMessages([{ sender: "bot", text: "Hey there! 👋 I'm Medha AI, your intelligent study companion. What would you like to learn today?" }]);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/sessions/${sessionId}`, { headers });
      setSessions(sessions.filter(s => s._id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([{ sender: "bot", text: "Hey there! 👋 I'm Medha AI. Ready for a new conversation!" }]);
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
      fetchSessions();
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Oops! Something went wrong. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className="w-full flex flex-col fixed inset-0 top-16" // Fixed positioning to prevent scroll issues
      style={{ 
        height: "calc(100vh - 64px)", // Exact viewport height minus navbar
        backgroundColor: "var(--bg-primary)"
      }}
    >
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Mobile History Toggle Overlay */}
        {showHistory && (
          <div 
            className="absolute inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setShowHistory(false)}
          />
        )}

        {/* Sidebar - Chat History */}
        {token && (
          <div 
            className={`absolute md:relative z-30 h-full transition-all duration-300 transform ${
              showHistory ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-12'
            }`}
            style={{ 
              backgroundColor: "var(--bg-primary)",
              borderRight: "1px solid var(--border-color)"
            }}
          >
            <Card className="h-full flex flex-col overflow-hidden rounded-none md:rounded-xl border-0 md:border">
              {/* Sidebar Header */}
              <div 
                className="flex items-center justify-between p-3 border-b flex-shrink-0" 
                style={{ borderColor: "var(--border-color)" }}
              >
                {showHistory && (
                  <h3 className="font-bold flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
                    <FaHistory /> Conversations
                  </h3>
                )}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                  title={showHistory ? "Collapse" : "Expand"}
                >
                  <FaComments style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>

              {showHistory && (
                <>
                  {/* New Chat Button */}
                  <button
                    onClick={() => {
                        createNewChat();
                        if (window.innerWidth < 768) setShowHistory(false);
                    }}
                    className="m-2 p-2.5 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-sm font-medium flex-shrink-0"
                    style={{ borderColor: "var(--accent-primary)", color: "var(--accent-primary)" }}
                  >
                    <FaPlus /> New Chat
                  </button>

                  {/* Sessions List - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5 custom-scrollbar">
                    {loadingSessions ? (
                      <div className="text-center py-4 opacity-50 text-sm">Loading...</div>
                    ) : sessions.length === 0 ? (
                      <div className="text-center py-4 opacity-50 text-xs">
                        No conversations yet.<br/>Start a new chat!
                      </div>
                    ) : (
                      sessions.map(session => (
                        <div
                          key={session._id}
                          onClick={() => {
                              loadSession(session._id);
                              if (window.innerWidth < 768) setShowHistory(false);
                          }}
                          className={`p-2.5 rounded-lg cursor-pointer transition-all group ${
                            currentSessionId === session._id 
                              ? 'bg-white/15 border-l-4' 
                              : 'hover:bg-white/10'
                          }`}
                          style={{ 
                            borderColor: currentSessionId === session._id ? "var(--accent-primary)" : "transparent" 
                          }}
                        >
                          {editingId === session._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="flex-1 bg-transparent border-b outline-none text-xs"
                                style={{ borderColor: "var(--accent-primary)", color: "var(--text-primary)" }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button onClick={() => updateTitle(session._id)} className="text-green-500 hover:text-green-400">
                                <FaCheck size={10} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400">
                                <FaTimes size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-xs truncate flex-1 font-medium" style={{ color: "var(--text-primary)" }}>
                                {session.title}
                              </span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingId(session._id);
                                    setEditTitle(session.title);
                                  }}
                                  className="p-1 hover:text-blue-400"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <FaEdit size={10} />
                                </button>
                                <button
                                  onClick={(e) => deleteSession(session._id, e)}
                                  className="p-1 hover:text-red-400"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <FaTrash size={10} />
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="text-xs opacity-50 mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            {session.messageCount || 0} messages
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
          {/* Header - Fixed */}
          <div className="p-2 md:p-4 flex-shrink-0">
             <Card className="p-3 md:p-4 flex items-center gap-3">
                 {/* Mobile Toggle Button */}
                 <button 
                  onClick={() => setShowHistory(true)} 
                  className="md:hidden p-2 -ml-2 text-[var(--text-secondary)]"
                 >
                     <FaComments size={20} />
                 </button>

                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                  <FaRobot className="text-white text-lg md:text-xl" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-extrabold truncate" style={{ color: "var(--text-primary)" }}>
                    Medha AI
                  </h1>
                  <p className="text-xs md:text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                    Your intelligent study companion
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-semibold hidden sm:inline" style={{ color: "var(--text-secondary)" }}>
                    Online
                  </span>
                </div>
             </Card>
          </div>

          {/* Chat Widget - Fills remaining space */}
          <div className="flex-1 overflow-hidden px-2 md:px-4 pb-2">
            <ChatbotWidget
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
