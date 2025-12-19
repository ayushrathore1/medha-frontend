import React, { useContext } from "react";
import Navbar from "./Navigation/Navbar";
import { AuthContext } from "../AuthContext";
import TourOverlay from "./Common/TourOverlay";

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden relative">
      {/* Tour Overlay */}
      <TourOverlay />

      {/* Organic Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-primary)]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-secondary)]/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-[var(--accent-tertiary)]/10 blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Navbar */}
      <Navbar user={user} onLogout={logout} />

      {/* Main Content */}
      <main className="flex-grow relative z-10 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
