import React, { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white bg-opacity-70 border-b border-blue-100 shadow transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between h-16 relative">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleLogoClick}
        >
          <img
            src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
            alt="MEDHA logo"
            className="w-9 h-9 sm:w-10 sm:h-10 mr-2 rounded-lg shadow-sm bg-white"
            draggable="false"
          />
          <span className="text-lg sm:text-xl font-extrabold text-blue-700 tracking-tight">
            MEDHA
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 lg:gap-5 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `font-medium px-2 py-1 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-blue-200 shadow text-blue-700 font-semibold"
                    : "text-blue-900/80 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {/* Profile & Logout */}
          <button
            onClick={handleProfileClick}
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-200 shadow transition"
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
          {user && (
            <button
              onClick={onLogout}
              className="ml-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg border border-blue-100 hover:bg-blue-50"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">Open Menu</span>
          <svg
            className="w-7 h-7 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex flex-col md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col pt-6 pb-4 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end mb-5 p-1 rounded hover:bg-blue-50"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="w-8 h-8 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `block font-medium text-lg px-3 py-2 rounded-lg mb-1 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-100 to-blue-200 shadow text-blue-700 font-semibold"
                        : "text-blue-900/90 hover:bg-blue-50 hover:text-blue-700"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              {/* Profile & Logout */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-200 shadow transition"
                  title="Profile"
                >
                  <img
                    alt="Profile"
                    src="https://ik.imagekit.io/ayushrathore1/user.png?updatedAt=1758550298840"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
                {user && (
                  <button
                    onClick={onLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Subtle shadow */}
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-blue-100 via-transparent to-blue-100 opacity-80 pointer-events-none" />
    </nav>
  );
};

export default Navbar;
