import React, { useState, useRef, useEffect } from "react";
import Button from "../Common/Button";

// Typewriter component for streaming text effect
const TypewriterText = ({ text, speed = 15, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">▊</span>}
    </span>
  );
};

const ChatbotWidget = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState("");
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages?.length || 0);

  // Track new bot messages for typewriter effect
  // Only animate if exactly ONE new message was added (not bulk load from session)
  useEffect(() => {
    const currentLength = messages?.length || 0;
    const prevLength = prevMessagesLength.current;
    
    // Only trigger animation if exactly 1 message was added (real-time response)
    if (currentLength === prevLength + 1) {
      const newMessage = messages[messages.length - 1];
      if (newMessage.sender === "bot") {
        setAnimatingIndex(messages.length - 1);
      }
    } else if (currentLength !== prevLength) {
      // Bulk load (session switch) - reset animation
      setAnimatingIndex(-1);
    }
    
    prevMessagesLength.current = currentLength;
  }, [messages]);

  useEffect(() => {
    if (atBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, atBottom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleScroll = () => {
    if (chatScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatScrollRef.current;
      setAtBottom(scrollHeight - scrollTop - clientHeight < 50);
    }
  };

  const handleTypewriterComplete = () => {
    setAnimatingIndex(-1);
  };

  return (
    <div
      className="flex flex-col h-full rounded-2xl border-2 overflow-hidden"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Chat messages area */}
      <div
        ref={chatScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--accent-secondary) transparent",
        }}
      >
        {messages && messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            {/* Bot avatar */}
            {msg.sender === "bot" && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white text-lg">🤖</span>
              </div>
            )}
            
            <div
              className={`max-w-[70%] px-5 py-4 rounded-2xl shadow-md ${
                msg.sender === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={{
                backgroundColor:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, var(--action-primary), var(--accent-primary))"
                    : "var(--bg-secondary)",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "var(--bg-secondary)",
                color: msg.sender === "user" ? "#ffffff" : "var(--text-primary)",
                fontSize: "1rem",
                fontWeight: "500",
                lineHeight: "1.6",
                letterSpacing: "0.01em",
              }}
            >
              {msg.sender === "bot" && idx === animatingIndex ? (
                <TypewriterText 
                  text={msg.text} 
                  speed={12} 
                  onComplete={handleTypewriterComplete}
                />
              ) : (
                <span className="whitespace-pre-wrap">{msg.text}</span>
              )}
            </div>

            {/* User avatar */}
            {msg.sender === "user" && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center ml-3 shadow-lg">
                <span className="text-white text-lg">👤</span>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div
              className="px-5 py-4 rounded-2xl rounded-bl-sm shadow-md"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <span className="inline-flex gap-1.5 items-center">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t-2 flex gap-3"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--accent-secondary)",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        />
        <Button type="submit" variant="primary" className="px-6 shadow-lg hover:shadow-xl transition-all">
          <span className="flex items-center gap-2">
            Send
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </span>
        </Button>
      </form>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;
