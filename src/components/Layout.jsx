import React, { useContext } from "react";
import Navbar from "./Navigation/Navbar";
import { AuthContext } from "../AuthContext";
import TourOverlay from "./Common/TourOverlay";
import ChatbotWidget from "./Common/ChatbotWidget";
import ThemeSetupPrompt from "./Common/ThemeSetupPrompt";

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col text-[var(--text-primary)] overflow-x-hidden relative">
      {/* Tour Overlay */}
      <TourOverlay />
      <ThemeSetupPrompt />


      {/* Navbar */}
      <Navbar user={user} onLogout={logout} />

      {/* Main Content */}
      <main className="flex-grow relative z-10 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Global Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;

