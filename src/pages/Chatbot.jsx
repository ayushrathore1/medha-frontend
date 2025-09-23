import React from "react";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";

const sendToChatbotApi = async (input, contextMessages) => {
  const response = await fetch(
    "https://medha-backend.onrender.com/api/chatbot/ask",
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
  <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden">
    {/* Animated Blobs on white background */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute -top-20 -left-20 w-[24rem] h-[24rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-35 animate-blob"></div>
      <div className="absolute top-32 right-16 w-[20rem] h-[20rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-blob animation-delay-4000"></div>
      <style>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0,0);}
          33% { transform: scale(1.1) translate(30px,-30px);}
          66% { transform: scale(0.9) translate(-20px,20px);}
          100% { transform: scale(1) translate(0,0);}
        }
        .animate-blob { animation: blob 12s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
    {/* Main Content */}
    <div className="relative z-10 w-full px-2 pt-28 pb-16 flex flex-col items-center">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <div className="bg-white/90 border border-blue-100 shadow-xl rounded-2xl p-8 w-full mb-10 mt-6 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3 text-center drop-shadow tracking-tight animate-fadein">
            MEDHA Chatbot
          </h1>
          <p className="mb-6 text-blue-900 text-lg text-center max-w-xl mx-auto animate-fadein2">
            Ask your doubts from your uploaded notes, get explanations, or quiz
            yourself instantly!{" "}
            <span className="text-blue-600 font-semibold">
              Your homework assistant, at your fingertips.
            </span>
          </p>
          <div className="w-full max-w-2xl mx-auto">
            <ChatbotWidget onSendMessage={sendToChatbotApi} />
          </div>
        </div>
      </div>
    </div>
    <style>{`
      .animate-fadein {
        animation: fadein 0.5s ease both;
      }
      .animate-fadein2 {
        animation: fadein 1.1s ease both;
      }
      @keyframes fadein {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: none;}
      }
    `}</style>
  </div>
);

export default Chatbot;
