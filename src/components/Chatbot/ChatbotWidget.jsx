import React, { useState, useRef, useEffect } from "react";
import Button from "../Common/Button";

const ChatbotWidget = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);

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

  return (
    <div
      className="flex flex-col h-full rounded-2xl border-2 overflow-hidden"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)",
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
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                msg.sender === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={{
                backgroundColor:
                  msg.sender === "user"
                    ? "var(--action-primary)"
                    : "var(--bg-secondary)",
                color:
                  msg.sender === "user"
                    ? "#ffffff"
                    : "var(--text-primary)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="px-5 py-3 rounded-2xl rounded-bl-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <span className="inline-flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce animation-delay-200">●</span>
                <span className="animate-bounce animation-delay-400">●</span>
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
          className="flex-1 px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
        />
        <Button type="submit" variant="primary">
          Send
        </Button>
      </form>

      <style>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;
