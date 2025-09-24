import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

const ChatbotWidget = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I’m MEDHA AI. Ask me anything about your uploaded notes.",
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
          text: "Sorry, I couldn’t get a response.",
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
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-0 w-full sm:max-w-md mx-auto flex flex-col h-[88vh] sm:h-[34rem] border border-blue-100 relative transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-4 border-b border-blue-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-200 text-blue-700 font-bold shadow-lg text-lg sm:text-xl">
            🤖
          </span>
          <span className="font-bold text-blue-700 text-base sm:text-lg tracking-tight">
            MEDHA AI Chatbot
          </span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
          Powered by AI
        </span>
      </div>
      {/* Down Arrow Button */}
      {!atBottom && (
        <button
          className="absolute right-4 bottom-20 z-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg w-10 h-10 hover:bg-blue-700 transition"
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
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-3 scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-blue-50"
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
            <span className="mr-2 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold shadow">
              🤖
            </span>
            <div className="px-3 py-1 rounded-2xl bg-blue-100 text-blue-900 animate-pulse shadow border border-blue-100 text-sm sm:text-base">
              MEDHA is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Input Section */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 sm:gap-3 border-t border-blue-100 px-2 sm:px-5 py-3 sm:py-4 bg-white/80 backdrop-blur-md"
      >
        <input
          className="flex-1 border-2 border-blue-200 bg-blue-50 rounded-xl px-3 sm:px-4 py-2 text-blue-900 font-medium placeholder-blue-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="text"
          placeholder="Ask about your notes…"
          autoFocus
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-wait text-sm sm:text-base`}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
      <style>
        {`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-blue-100::-webkit-scrollbar-thumb {
          background-color: #bfdbfe;
        }
        .scrollbar-track-blue-50::-webkit-scrollbar-track {
          background-color: #eff6ff;
        }
        `}
      </style>
    </div>
  );
};

export default ChatbotWidget;
