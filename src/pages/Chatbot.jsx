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
  <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden">
    {/* Animated BG Blobs - Responsive Sizes */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute -top-10 sm:-top-20 -left-10 sm:-left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl opacity-30 sm:opacity-35 animate-blob"></div>
      <div className="absolute top-16 sm:top-32 right-8 sm:right-16 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl opacity-25 sm:opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 sm:w-64 md:w-88 h-44 sm:h-64 md:h-88 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl opacity-20 sm:opacity-25 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0,0);}
          33% { transform: scale(1.1) translate(30px,-30px);}
          66% { transform: scale(0.9) translate(-20px,20px);}
          100% { transform: scale(1) translate(0,0);}
        }
        .animate-blob { 
          animation: blob 12s infinite; 
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-blob {
            animation: blob 8s infinite;
          }
        }
      `}</style>
    </div>

    {/* Main Content - Mobile First Layout */}
    <div className="relative z-10 w-full flex flex-col flex-1">
      {/* Header Section - Mobile Optimized */}
      <div className="flex-shrink-0 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-12 pb-4 sm:pb-6">
        <div className="max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
          <div className="bg-white/90 sm:bg-white/90 border border-blue-100 shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md">
            {/* Title - Responsive Typography */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-700 mb-2 sm:mb-3 text-center drop-shadow tracking-tight animate-fadein">
              <span className="sm:hidden">MEDHA AI</span>
              <span className="hidden sm:inline">MEDHA Chatbot</span>
            </h1>

            {/* Description - Mobile Optimized */}
            <p className="mb-4 sm:mb-6 text-blue-900 text-sm sm:text-base md:text-lg text-center max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto animate-fadein2 leading-relaxed">
              <span className="sm:hidden">
                Ask questions about your notes, get explanations, or quiz
                yourself!{" "}
                <span className="text-blue-600 font-semibold block mt-1">
                  Your AI homework assistant.
                </span>
              </span>
              <span className="hidden sm:inline">
                Ask your doubts from your uploaded notes, get explanations, or
                quiz yourself instantly!{" "}
                <span className="text-blue-600 font-semibold">
                  Your homework assistant, at your fingertips.
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Widget Container - Flexible Layout */}
      <div className="flex-1 flex flex-col px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto w-full flex-1 flex flex-col">
          <div className="bg-white/95 sm:bg-white/90 border border-blue-50 sm:border-blue-100 shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl flex-1 flex flex-col backdrop-blur-sm overflow-hidden">
            {/* Chat Header - Mobile Friendly */}
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base font-medium text-blue-800">
                    <span className="sm:hidden">AI Assistant Online</span>
                    <span className="hidden sm:inline">
                      MEDHA AI Assistant - Online
                    </span>
                  </span>
                </div>

                {/* Mobile Menu Button - Future Enhancement */}
                <div className="sm:hidden">
                  <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Widget - Responsive Container */}
            <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-4 lg:p-6">
              <div className="flex-1 max-w-full">
                <ChatbotWidget onSendMessage={sendToChatbotApi} />
              </div>
            </div>

            {/* Chat Footer - Mobile Helper */}
            <div className="flex-shrink-0 bg-slate-50/80 border-t border-slate-100 px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className="flex items-center">
                    <span className="mr-1">🤖</span>
                    <span className="hidden sm:inline">Powered by AI</span>
                    <span className="sm:hidden">AI Powered</span>
                  </span>
                  <span className="hidden sm:flex items-center">
                    <span className="mr-1">⚡</span>
                    Real-time responses
                  </span>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="hidden sm:inline">Press Enter to send</span>
                  <span className="sm:hidden text-xs">Tap to send</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Animations */}
    <style>{`
      .animate-fadein { 
        animation: fadein 0.6s ease both; 
      }
      .animate-fadein2 { 
        animation: fadein 1.2s ease both; 
      }
      
      @keyframes fadein {
        0% { 
          opacity: 0; 
          transform: translateY(20px) scale(0.95);
        }
        100% { 
          opacity: 1; 
          transform: translateY(0) scale(1);
        }
      }

      /* Mobile-specific optimizations */
      @media (max-width: 640px) {
        .animate-fadein, .animate-fadein2 {
          animation-duration: 0.4s;
        }
        
        /* Improve touch interactions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Optimize for mobile performance */
        .animate-blob {
          will-change: transform;
        }
      }

      /* Tablet optimizations */
      @media (min-width: 641px) and (max-width: 1024px) {
        .bg-white\\/90 {
          backdrop-filter: blur(12px);
        }
      }

      /* Desktop enhancements */
      @media (min-width: 1025px) {
        .bg-white\\/90 {
          backdrop-filter: blur(16px);
        }
      }
    `}</style>
  </div>
);

export default Chatbot;
