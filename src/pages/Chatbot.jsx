import React from "react";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";
import Card from "../components/Common/Card";

const sendToChatbotApi = async (input, contextMessages) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/chatbot/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input, contextMessages }),
    }
  );
  const data = await response.json();
  if (response.ok && data.answer) return data.answer;
  throw new Error(data.error || "Failed to get answer from MEDHA AI.");
};

const Chatbot = () => (
  <div className="min-h-screen w-full flex flex-col pt-20 pb-10 px-4">
    <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
      {/* Header */}
      <Card className="mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--action-primary)" }}>
            🤖 MEDHA Chatbot
          </h1>
          <p className="text-lg mb-2" style={{ color: "var(--text-secondary)" }}>
            Ask about your notes, get explanations, or quiz yourself!
          </p>
          <p className="font-semibold" style={{ color: "var(--accent-primary)" }}>
            Your homework AI assistant.
          </p>
        </div>
      </Card>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col min-h-[600px]" hoverEffect={false}>
        {/* Chat Header */}
        <div className="flex-shrink-0 border-b pb-4 mb-4" style={{ borderColor: "var(--accent-secondary)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="inline-flex h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent-primary)" }}></span>
              <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                AI Assistant Online
              </span>
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatbotWidget onSendMessage={sendToChatbotApi} />
        </div>

        {/* Chat Footer */}
        <div 
          className="flex-shrink-0 border-t pt-3 mt-3" 
          style={{ borderColor: "var(--accent-secondary)" }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-1">🤖</span>
                Powered by AI
              </span>
              <span className="flex items-center">
                <span className="mr-1">⚡</span>
                Real-time responses
              </span>
            </div>
            <span>Press Enter to send</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default Chatbot;
