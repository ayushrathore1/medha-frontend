import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your AI study assistant. Ask me anything about your notes!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message) => {
    // Add user message
    setMessages([...messages, { sender: "user", text: message }]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chatbot/ask`,
        { input: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add bot response
      setMessages(prev => [...prev, { sender: "bot", text: response.data.answer }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                AI Study Assistant
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                Ask questions about your notes and get instant answers
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                Online
              </span>
            </div>
          </div>
        </Card>

        <div style={{ height: "600px" }}>
          <ChatbotWidget
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
