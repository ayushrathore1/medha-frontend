/**
 * ChatbotWidget - Global AI Chatbot Widget
 * Floating chatbot that appears on all pages with SERP web search and RAG context
 * Premium Apple-inspired dark theme
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaGlobe,
  FaSpinner,
  FaChevronDown,
  FaTrash,
  FaBrain,
  FaBookOpen,
  FaGraduationCap,
  FaSearch,
} from "react-icons/fa";
import { useChatbot } from "../../context/ChatbotContext";

const APPLE_THEME = {
  bg: "#000000",
  surface: "#1c1c1e",
  surfaceHover: "#2c2c2e",
  surfaceElevated: "#38383a",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#0A84FF",
  accentGradient: "linear-gradient(135deg, #0A84FF, #5e5ce6)",
  text: "#F5F5F7",
  textSec: "#86868B",
  textTertiary: "#636366",
  success: "#30D158",
  danger: "#FF453A",
  warning: "#FFD60A",
  purple: "#BF5AF2",
};

const ChatbotWidget = () => {
  const { isOpen, setIsOpen } = useChatbot();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasContext, setHasContext] = useState(false);
  const [webSearchUsed, setWebSearchUsed] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Suggestions for academic chatbot
  const suggestions = [
    { text: "What subjects should I focus on?", icon: FaBookOpen },
    { text: "Explain my pending tasks", icon: FaGraduationCap },
    { text: "Help me with exam preparation", icon: FaBrain },
    { text: "What's trending in tech today?", icon: FaSearch },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Send message to AI
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${baseUrl}/api/chatbot/ask`,
        {
          input: text,
          contextMessages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: "groq",
        },
        { headers, timeout: 60000 }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
        hasWebSearch: response.data.webSearchUsed || false,
        hasContext: response.data.hasContext || false,
      };

      setHasContext(response.data.hasContext || false);
      setWebSearchUsed(response.data.webSearchUsed || false);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to get response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
    setHasContext(false);
    setWebSearchUsed(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: isOpen
            ? APPLE_THEME.surfaceElevated
            : APPLE_THEME.accentGradient,
          border: isOpen ? `1px solid ${APPLE_THEME.accent}` : "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOpen
            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
            : "0 8px 32px rgba(10, 132, 255, 0.4)",
          zIndex: 9999,
        }}
      >
        {isOpen ? (
          <FaChevronDown color={APPLE_THEME.accent} size={22} />
        ) : (
          <FaComments color="white" size={22} />
        )}
      </motion.button>

      {/* Unread indicator */}
      {!isOpen && messages.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: "fixed",
            bottom: "72px",
            right: "24px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: APPLE_THEME.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600,
            color: "white",
            zIndex: 10000,
            border: `2px solid ${APPLE_THEME.bg}`,
          }}
        >
          {messages.filter((m) => m.role === "assistant").length}
        </motion.div>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: "100px",
              right: "24px",
              width: "400px",
              maxWidth: "calc(100vw - 48px)",
              height: "550px",
              maxHeight: "70vh",
              background: "rgba(28, 28, 30, 0.98)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderRadius: "24px",
              border: `1px solid ${APPLE_THEME.border}`,
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6)",
              zIndex: 9999,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: `1px solid ${APPLE_THEME.border}`,
                background: "rgba(10, 132, 255, 0.08)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: APPLE_THEME.accentGradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaBrain color="white" size={20} />
                </div>
                <div>
                  <div
                    style={{
                      color: APPLE_THEME.text,
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    Medha AI
                  </div>
                  <div style={{ color: APPLE_THEME.textSec, fontSize: "11px" }}>
                    {hasContext ? "📚 Using your data" : "💬 Ready to help"}
                    {webSearchUsed && " • 🌐 Web search"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    style={{
                      background: "rgba(255, 69, 58, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px",
                      cursor: "pointer",
                    }}
                    title="Clear chat"
                  >
                    <FaTrash color={APPLE_THEME.danger} size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  <FaTimes color={APPLE_THEME.textSec} size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: "center",
                    padding: "24px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "20px",
                      background: APPLE_THEME.accentGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <FaBrain color="white" size={32} />
                  </div>
                  <div
                    style={{
                      color: APPLE_THEME.text,
                      fontWeight: 600,
                      fontSize: "18px",
                      marginBottom: "8px",
                    }}
                  >
                    Hi, I'm Medha! 👋
                  </div>
                  <div
                    style={{
                      color: APPLE_THEME.textSec,
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    Your AI study companion. I can help with your subjects,
                    explain concepts, and even search the web for real-time info!
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      color: APPLE_THEME.textSec,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Try asking
                  </div>
                  {suggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => sendMessage(suggestion.text)}
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: `1px solid ${APPLE_THEME.border}`,
                          borderRadius: "12px",
                          padding: "14px 16px",
                          textAlign: "left",
                          cursor: "pointer",
                          color: APPLE_THEME.text,
                          fontSize: "14px",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(10, 132, 255, 0.1)";
                          e.currentTarget.style.borderColor = APPLE_THEME.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.05)";
                          e.currentTarget.style.borderColor = APPLE_THEME.border;
                        }}
                      >
                        <Icon color={APPLE_THEME.accent} size={16} />
                        {suggestion.text}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    gap: "10px",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        background: APPLE_THEME.accentGradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FaRobot color="white" size={16} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "14px 18px",
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      background:
                        msg.role === "user"
                          ? APPLE_THEME.accentGradient
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
                      backdropFilter:
                        msg.role === "assistant" ? "blur(20px)" : "none",
                      WebkitBackdropFilter:
                        msg.role === "assistant" ? "blur(20px)" : "none",
                      border:
                        msg.role === "assistant"
                          ? "1px solid rgba(255, 255, 255, 0.15)"
                          : "none",
                      boxShadow:
                        msg.role === "assistant"
                          ? "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                          : "0 4px 12px rgba(10, 132, 255, 0.3)",
                      color: APPLE_THEME.text,
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                        {(msg.hasWebSearch || msg.hasContext) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginTop: "10px",
                              paddingTop: "10px",
                              borderTop: `1px solid ${APPLE_THEME.border}`,
                              fontSize: "11px",
                            }}
                          >
                            {msg.hasContext && (
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  color: APPLE_THEME.purple,
                                }}
                              >
                                <FaGraduationCap size={10} />
                                Your data
                              </span>
                            )}
                            {msg.hasWebSearch && (
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  color: APPLE_THEME.success,
                                }}
                              >
                                <FaGlobe size={10} />
                                Web search
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        background: APPLE_THEME.purple,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FaUser color="white" size={14} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 18px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background: APPLE_THEME.accentGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaRobot color="white" size={16} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 18px",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "14px",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <FaSpinner color={APPLE_THEME.accent} size={16} />
                    </motion.div>
                    <span
                      style={{ color: APPLE_THEME.textSec, fontSize: "14px" }}
                    >
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: "14px 18px",
                    background: "rgba(255, 69, 58, 0.1)",
                    borderRadius: "14px",
                    color: APPLE_THEME.danger,
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "14px 18px 18px",
                borderTop: `1px solid ${APPLE_THEME.border}`,
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "18px",
                  padding: "6px 6px 6px 18px",
                  border: `1px solid ${APPLE_THEME.border}`,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: APPLE_THEME.text,
                    fontSize: "15px",
                    padding: "10px 0",
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "14px",
                    background:
                      inputText.trim() && !isLoading
                        ? APPLE_THEME.accentGradient
                        : "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    cursor:
                      inputText.trim() && !isLoading
                        ? "pointer"
                        : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: inputText.trim() && !isLoading ? 1 : 0.5,
                  }}
                >
                  <FaPaperPlane color="white" size={16} />
                </motion.button>
              </div>
              <div
                style={{
                  color: APPLE_THEME.textTertiary,
                  fontSize: "10px",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Press Enter to send • Powered by Groq AI + SERP
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
