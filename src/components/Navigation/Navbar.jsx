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
  inactive: { scale: 1, color: "var(--text-secondary)" },
  hover: {
    scale: 1.07,
    color: "var(--action-primary)",
    transition: { type: "spring", stiffness: 320 },
  },
  active: {
    scale: 1.12,
    color: "var(--action-primary)",
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
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 w-full z-30 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--accent-secondary)]/20 shadow-sm transition-all"
    >
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
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--action-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] bg-clip-text text-transparent">
            MEDHA
          </span>
        </div>

        {/* Desktop Nav with animated underline - Only show if user is logged in */}
        {user && (
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
                    className="relative block"
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={underlineVariants}
                        className="absolute left-0 right-0 -bottom-2 h-1 bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] rounded-xl shadow"
                      />
                    )}
                  </motion.span>
                )}
              </NavLink>
            ))}

            {/* Profile avatar */}
            <button
              onClick={handleProfileClick}
              className="ml-2 h-11 w-11 rounded-full border border-[var(--accent-secondary)]/30 bg-white/50 hover:bg-white/80 shadow-sm transition overflow-hidden flex items-center justify-center"
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
                <div className="h-full w-full rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[var(--action-primary)] to-[var(--accent-secondary)]">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </button>

            <button
              onClick={onLogout}
              className="ml-3 bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-secondary)] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:opacity-90 transition-all shadow-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
