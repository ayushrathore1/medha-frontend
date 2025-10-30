import React from "react";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";

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
  <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col relative overflow-hidden font-inter">
    {/* Glassy animated BG gradient blobs */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute -top-20 left-0 w-2/5 h-72 bg-gradient-to-tr from-violet-500/35 via-blue-600/20 to-purple-400/10 rounded-full blur-3xl opacity-25 animate-blob" />
      <div className="absolute top-1/3 right-0 h-60 w-1/3 bg-gradient-to-br from-blue-400/20 to-fuchsia-400/15 rounded-full blur-2xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-6/12 h-56 bg-gradient-to-r from-emerald-400/20 to-purple-400/10 rounded-full blur-2xl opacity-20 animate-blob animation-delay-4000" />

      <style>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0,0);}
          33% { transform: scale(1.1) translate(30px,-30px);}
          66% { transform: scale(0.92) translate(-24px,20px);}
          100% { transform: scale(1) translate(0,0);}
        }
        .animate-blob { animation: blob 14s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>

    {/* Main Content + Header */}
    <div className="relative z-10 w-full flex flex-col flex-1">
      <div className="flex-shrink-0 px-4 pt-10 pb-4">
        <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-[#18163a]/90 backdrop-blur-xl border border-violet-400/15 rounded-3xl shadow-2xl px-7 py-9">
            <h1 className="text-3xl font-extrabold text-center mb-3 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              MEDHA Chatbot
            </h1>
            <p className="mb-3 text-lg text-violet-300 text-center max-w-md mx-auto leading-relaxed">
              Ask about your notes, get explanations, or quiz yourself!
              <span className="block mt-2 text-blue-400 font-semibold">
                Your homework AI assistant.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Widget Container - Glassmorphic */}
      <div className="flex flex-col flex-1 px-4 pb-10">
        <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto w-full flex-1 flex flex-col">
          <div className="bg-[#18163a]/80 backdrop-blur-2xl border border-violet-400/20 rounded-3xl flex-1 flex flex-col shadow-2xl">
            {/* Chat Header - Glassy */}
            <div className="flex-shrink-0 border-b border-violet-400/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-base font-semibold text-white tracking-tight">
                    AI Assistant Online
                  </span>
                </div>
              </div>
            </div>
            {/* Chat Widget */}
            <div className="flex-1 flex flex-col min-h-0 p-2 md:p-3">
              <ChatbotWidget onSendMessage={sendToChatbotApi} />
            </div>
            {/* Chat Footer - Glassy */}
            <div className="flex-shrink-0 border-t border-violet-400/10 px-6 py-3 bg-white/10 backdrop-blur rounded-b-3xl">
              <div className="flex items-center justify-between text-xs text-violet-300">
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
          </div>
        </div>
      </div>
    </div>
    {/* Enhanced Animations for fade-in */}
    <style>{`
      .animate-fadein { animation: fadein 0.8s cubic-bezier(.22,1,.36,1) both; }
      @keyframes fadein {
        0% { opacity: 0; transform: translateY(32px) scale(.96);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
    `}</style>
  </div>
);

export default Chatbot;
