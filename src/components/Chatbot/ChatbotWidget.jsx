import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import Button from "../Common/Button";

const ChatbotWidget = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm MEDHA AI. Ask me anything about your uploaded notes.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [typingMessageIdx, setTypingMessageIdx] = useState(null);

  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    if (atBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingMessageIdx, atBottom]);

  const handleScroll = () => {
    if (!chatScrollRef.current) return;
    const el = chatScrollRef.current;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distanceFromBottom < 80);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let aiResponse;
      if (onSendMessage) {
        aiResponse = await onSendMessage(input, messages);
      } else {
        aiResponse = "This is a demo response. Replace with your AI.";
      }
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: aiResponse.trim(), isAnimated: true },
      ]);
      setTypingMessageIdx(messages.length + 1);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Sorry, I couldn't get a response.",
          isAnimated: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToEnd = () => {
    setAtBottom(true);
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTypewriterChar = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTypewriterDone = () => setTypingMessageIdx(null);

  return (
<<<<<<< HEAD
    <div className="relative w-full flex flex-col h-full border-2 rounded-2xl shadow-lg overflow-hidden transition-all" style={{
      backgroundColor: "var(--bg-primary)",
      borderColor: "var(--accent-secondary)"
    }}>
=======
    <div className="relative w-full sm:max-w-xl mx-auto flex flex-col h-[88vh] sm:h-[34rem] border border-violet-400/20 rounded-3xl shadow-2xl bg-[#0a0a0a] backdrop-blur-xl overflow-hidden transition-all">
      {/* Ambient gradient glow behind chat */}
      <div className="absolute left-1/3 -top-4 w-96 h-64 rounded-full bg-gradient-to-br from-violet-500/15 via-blue-600/10 to-purple-400/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-7 py-4 border-b border-violet-400/15 bg-white/5 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-fuchsia-400 text-white font-bold shadow text-xl">
            🤖
          </span>
          <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-blue-300 bg-clip-text text-transparent tracking-tight">
            MEDHA AI Chatbot
          </span>
        </div>
        <span className="text-xs bg-gradient-to-r from-violet-400 to-blue-400 text-white px-3 py-1 rounded-full font-semibold shadow">
          Powered by AI
        </span>
      </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

      {/* Down Arrow Button */}
      {!atBottom && (
        <button
<<<<<<< HEAD
          className="absolute right-4 bottom-20 z-10 flex items-center justify-center text-white rounded-full shadow-xl w-10 h-10 hover:scale-[1.08] transition"
          style={{ backgroundColor: "var(--action-primary)" }}
=======
          className="absolute right-4 bottom-20 z-10 flex items-center justify-center bg-gradient-to-r from-violet-500 to-blue-600 text-white rounded-full shadow-xl w-10 h-10 hover:scale-[1.08] transition"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          onClick={scrollToEnd}
          title="Go to latest message"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}

      {/* Chat Area */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 custom-scrollbar"
        onScroll={handleScroll}
        style={{
          background:
            "linear-gradient(to bottom, rgba(45,24,95,0.16) 0%, rgba(10,10,10,0.98) 70%)",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            sender={msg.sender}
            text={msg.text}
            isTyping={msg.sender === "ai" && typingMessageIdx === i}
            speed={24}
            onChar={handleTypewriterChar}
            onDone={handleTypewriterDone}
          />
        ))}
        {loading && (
          <div className="flex items-center justify-start mb-3">
<<<<<<< HEAD
            <span className="mr-2 flex items-center justify-center h-8 w-8 rounded-full text-white font-bold shadow" style={{ background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))` }}>
              🤖
            </span>
            <div className="px-3 py-1 rounded-2xl text-white animate-pulse shadow border text-sm sm:text-base" style={{ 
              background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))`,
              borderColor: "var(--accent-secondary)"
            }}>
=======
            <span className="mr-2 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-violet-400 text-white font-bold shadow">
              🤖
            </span>
            <div className="px-3 py-1 rounded-2xl bg-gradient-to-r from-blue-300 via-violet-300 to-purple-300 text-white animate-pulse shadow border border-blue-100 text-sm sm:text-base">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              MEDHA is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSend}
<<<<<<< HEAD
        className="flex gap-2 sm:gap-3 border-t px-3 sm:px-5 py-4"
        style={{ borderColor: "var(--accent-secondary)" }}
      >
        <input
          className="flex-1 border-2 rounded-xl px-4 py-3 font-medium text-base focus:outline-none focus:ring-2 transition"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
=======
        className="flex gap-2 sm:gap-3 border-t border-violet-400/10 px-3 sm:px-7 py-4 bg-white/5 backdrop-blur"
      >
        <input
          className="flex-1 border-2 border-violet-400/25 bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 text-white font-medium placeholder-violet-300 text-base focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          type="text"
          placeholder="Ask about your notes…"
          autoFocus
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="submit"
<<<<<<< HEAD
=======
          className={`bg-gradient-to-r from-violet-500 via-blue-500 to-purple-500 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl shadow-xl hover:scale-[1.04] transition disabled:opacity-50 disabled:cursor-wait text-base`}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          disabled={loading || !input.trim()}
          loading={loading}
        >
          Send
        </Button>
      </form>
      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar { width: 6px;}
<<<<<<< HEAD
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-secondary);}
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--accent-secondary); border-radius:10px;}
=======
        .custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,255,255,0.06);}
        .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(155,118,255,0.22); border-radius:10px;}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        `}
      </style>
    </div>
  );
};

export default ChatbotWidget;
