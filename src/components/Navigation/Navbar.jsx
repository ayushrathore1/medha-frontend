import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/notes", label: "Notes" },
  { path: "/flashcards", label: "Flashcards" },
  { path: "/quiz", label: "Quiz" },
  { path: "/chatbot", label: "Chatbot" },
  { path: "/feedback", label: "Feedback" },
];

const linkVariants = {
<<<<<<< HEAD
  inactive: { scale: 1, color: "var(--text-secondary)" },
  hover: {
    scale: 1.07,
    color: "var(--action-primary)",
=======
  inactive: { scale: 1, color: "#e1e7ff" },
  hover: {
    scale: 1.07,
    color: "#fff",
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
    transition: { type: "spring", stiffness: 320 },
  },
  active: {
    scale: 1.12,
<<<<<<< HEAD
    color: "var(--action-primary)",
=======
    color: "#3b82f6",
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
    transition: { type: "spring", stiffness: 320 },
  },
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { type: "spring", stiffness: 230 } },
};

const Navbar = ({ user, onLogout }) => {

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");

  };

  const handleProfileClick = () => {
    navigate("/profile");

  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
<<<<<<< HEAD
      className="fixed top-0 left-0 w-full z-30 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--accent-secondary)]/20 shadow-sm transition-all"
    >
=======
      className="fixed top-0 left-0 w-full z-30 backdrop-blur-2xl bg-[#10102a]/95 border-b border-white/10 shadow-xl transition-all"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/ayushrathore1/bg-texture.png?updatedAt=1758343718570')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.22, 0.16] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute left-0 top-0 w-72 h-32 bg-gradient-to-r from-violet-500/30 to-blue-600/10 rounded-b-3xl blur-2xl"
        />
        <motion.div
          animate={{ scale: [1, 1.13, 1], opacity: [0.18, 0.26, 0.2] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute right-0 top-0 w-48 h-20 bg-gradient-to-l from-blue-500/20 to-fuchsia-500/30 rounded-b-xl blur-2xl"
        />
      </div>

>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 relative">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleLogoClick}
        >
          <img
            src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
            alt="MEDHA logo"
            className="w-10 h-10 rounded-xl shadow-md bg-white"
            draggable="false"
          />
<<<<<<< HEAD
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--action-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] bg-clip-text text-transparent">
=======
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            MEDHA
          </span>
        </div>

        {/* Desktop Nav with animated underline */}
        <div className="hidden md:flex gap-2 lg:gap-7 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ position: "relative", display: "inline-block" }}
              className="font-medium px-4 py-2 rounded-xl transition-all duration-200"
            >
              {({ isActive }) => (
                <motion.span
                  initial="inactive"
                  animate={isActive ? "active" : "inactive"}
                  whileHover="hover"
                  variants={linkVariants}
<<<<<<< HEAD
                  className="relative block"
=======
                  className="relative"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={underlineVariants}
<<<<<<< HEAD
                      className="absolute left-0 right-0 -bottom-2 h-1 bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] rounded-xl shadow"
=======
                      className="absolute left-0 right-0 -bottom-2 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 rounded-xl shadow"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                    />
                  )}
                </motion.span>
              )}
            </NavLink>
          ))}

<<<<<<< HEAD
          {/* Profile avatar */}
          <button
            onClick={handleProfileClick}
            className="ml-2 h-11 w-11 rounded-full border border-[var(--accent-secondary)]/30 bg-white/50 hover:bg-white/80 shadow-sm transition overflow-hidden flex items-center justify-center"
=======
          {/* Profile avatar - Fixed sizing and overflow */}
          <button
            onClick={handleProfileClick}
            className="ml-2 h-11 w-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 shadow-lg transition overflow-hidden flex items-center justify-center"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            title="Profile"
          >
            {user?.avatar || user?.profilePic ? (
              <img
                alt="Profile"
                src={user.avatar || user.profilePic}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://ik.imagekit.io/ayushrathore1/image(1).png?updatedAt=1761828486524";
                }}
                draggable="false"
              />
            ) : (
<<<<<<< HEAD
              <div className="h-full w-full rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[var(--action-primary)] to-[var(--accent-secondary)]">
=======
              <div className="h-full w-full rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-400 via-blue-600/60 to-purple-500/60">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </button>

          {user && (
            <button
              onClick={onLogout}
<<<<<<< HEAD
              className="ml-3 bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-secondary)] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:opacity-90 transition-all shadow-md"
=======
              className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-fuchsia-700 transition-shadow shadow-xl backdrop-blur-lg border border-white/10"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            >
              Logout
            </button>
          )}
        </div>
<<<<<<< HEAD
      </div>
=======
        {/* Mobile hamburger/drawer code (unchanged, reuse same color updates for links). */}
      </div>
      {/* Subtle bottom gradient shadow for glass effect */}
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-violet-400 via-transparent to-blue-400 opacity-80 pointer-events-none rounded-b-xl" />
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
    </motion.nav>
  );
};

export default Navbar;
