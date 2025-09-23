import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/notes", label: "Notes" },
  { path: "/flashcards", label: "Flashcards" },
  { path: "/quiz", label: "Quiz" },
  { path: "/chatbot", label: "Chatbot" },
  { path: "/feedback", label: "Feedback" },
];

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white bg-opacity-70 border-b border-blue-100 shadow transition-all">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleLogoClick}
        >
          <img
            src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
            alt="MEDHA logo"
            className="w-10 h-10 mr-2 rounded-lg shadow-sm bg-white"
            draggable="false"
          />
          <span className="text-xl font-extrabold text-blue-700 tracking-tight">
            MEDHA
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-3 md:gap-5 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `font-medium px-3 py-1 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-blue-200 shadow text-blue-700 font-semibold"
                    : "text-blue-900/80 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {/* Profile Picture Button */}
          <button
            onClick={handleProfileClick}
            className="ml-2 flex items-center justify-center h-10 w-10 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-200 shadow transition"
            title="Profile"
          >
            <img
              alt="Profile"
              src="https://ik.imagekit.io/ayushrathore1/user.png?updatedAt=1758550298840"
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://ik.imagekit.io/ayushrathore1/profile_default.png";
              }}
            />
          </button>
          {/* Logout Button */}
          {user && (
            <button
              onClick={onLogout}
              className="ml-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {/* A subtle bottom shadow for glass effect */}
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-blue-100 via-transparent to-blue-100 opacity-80 pointer-events-none" />
    </nav>
  );
};

export default Navbar;
