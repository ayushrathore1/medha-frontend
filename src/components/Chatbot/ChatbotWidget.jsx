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
    <div className="relative w-full flex flex-col h-full border-2 rounded-2xl shadow-lg overflow-hidden transition-all" style={{
      backgroundColor: "var(--bg-primary)",
      borderColor: "var(--accent-secondary)"
    }}>

      {/* Down Arrow Button */}
      {!atBottom && (
        <button
          className="absolute right-4 bottom-20 z-10 flex items-center justify-center text-white rounded-full shadow-xl w-10 h-10 hover:scale-[1.08] transition"
          style={{ backgroundColor: "var(--action-primary)" }}
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
            <span className="mr-2 flex items-center justify-center h-8 w-8 rounded-full text-white font-bold shadow" style={{ background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))` }}>
              🤖
            </span>
            <div className="px-3 py-1 rounded-2xl text-white animate-pulse shadow border text-sm sm:text-base" style={{ 
              background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))`,
              borderColor: "var(--accent-secondary)"
            }}>
              MEDHA is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSend}
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
          type="text"
          placeholder="Ask about your notes…"
          autoFocus
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          loading={loading}
        >
          Send
        </Button>
      </form>
      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar { width: 6px;}
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-secondary);}
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--accent-secondary); border-radius:10px;}
        `}
      </style>
    </div>
  );
};

export default ChatbotWidget;
