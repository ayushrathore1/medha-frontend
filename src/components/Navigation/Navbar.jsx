import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCrown } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

const baseNavItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/notes", label: "Notes" },
  { path: "/rtu-exams", label: "RTU Exams" },
  { path: "/flashcards", label: "Flashcards" },
  { path: "/quiz", label: "Quiz" },
  { path: "/chatbot", label: "Chatbot" },
  { path: "/notifications", label: "Notifications" },
  { path: "/messages", label: "Messages" },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Messages
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Notifications
  const prevUnreadNotifications = useRef(0);

  // Sound effect for new notifications
  useEffect(() => {
    if (unreadNotifications > prevUnreadNotifications.current) {
      try {
        const audio = new Audio(NOTIFICATION_SOUND);
        audio.play().catch(e => console.log("Audio play failed:", e));
      } catch (err) {
        console.error("Error playing sound:", err);
      }
    }
    prevUnreadNotifications.current = unreadNotifications;
  }, [unreadNotifications]);

  // Check if user is admin and fetch unread counts
  useEffect(() => {
    const checkAdminAndUnread = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        // Check admin
        const adminRes = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAdmin(adminRes.data.isAdmin);

        // Get unread messages count
        const unreadRes = await axios.get(`${BACKEND_URL}/api/chats/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(unreadRes.data.unreadCount || 0);

        // Get unread notifications count
        const notifRes = await axios.get(`${BACKEND_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadNotifications(notifRes.data.unreadCount || 0);

      } catch {
        setIsAdmin(false);
        setUnreadCount(0);
        setUnreadNotifications(0);
      }
    };
    
    if (user) {
      checkAdminAndUnread();
      // Poll for unread count every 30 seconds
      const interval = setInterval(checkAdminAndUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Build nav items based on admin status
  const navItems = isAdmin 
    ? [...baseNavItems, { path: "/admin", label: "Admin", isAdmin: true }]
    : baseNavItems;

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[var(--bg-primary)]/90 border-b border-[var(--accent-secondary)]/20 shadow-sm transition-all"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 relative">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          onClick={handleLogoClick}
        >
          <img
            src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
            alt="MEDHA logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md bg-white"
            draggable="false"
          />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent hidden sm:inline">
            MEDHA
          </span>
        </div>

        {/* Desktop Nav */}
        {user && (
          <div className="hidden xl:flex gap-5 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ position: "relative", display: "inline-block" }}
                className={`font-medium px-3 py-2 rounded-xl transition-all duration-200 text-base whitespace-nowrap ${
                  item.isAdmin ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30" : ""
                }`}
              >
                {({ isActive }) => (
                  <motion.span
                    initial="inactive"
                    animate={isActive ? "active" : "inactive"}
                    whileHover="hover"
                    variants={item.isAdmin ? {
                      ...linkVariants,
                      inactive: { scale: 1, color: "#f59e0b" },
                      active: { scale: 1.12, color: "#f59e0b" },
                    } : linkVariants}
                    className="relative block flex items-center gap-1.5"
                  >
                    {item.isAdmin && <FaCrown className="text-amber-500" />}
                    {item.label}
                    {/* Notification badge for Messages */}
                    {item.path === "/messages" && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[18px] text-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                    {/* Notification badge for Notifications */}
                    {item.path === "/notifications" && unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full min-w-[18px] text-center">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={underlineVariants}
                        className={`absolute left-0 right-0 -bottom-2 h-1 rounded-xl shadow ${
                          item.isAdmin 
                            ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                            : "bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)]"
                        }`}
                      />
                    )}
                  </motion.span>
                )}
              </NavLink>
            ))}

            {/* Profile avatar */}
            <button
              onClick={handleProfileClick}
              className="ml-2 h-10 w-10 rounded-full border border-[var(--accent-secondary)]/30 bg-white/50 hover:bg-white/80 shadow-sm transition overflow-hidden flex items-center justify-center"
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
              onClick={() => {
                sessionStorage.removeItem("medha_feature_modal_shown");
                onLogout();
              }}
              className="ml-2 bg-gradient-to-r from-indigo-600 to-violet-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:opacity-90 transition-all shadow-md text-sm"
            >
              Logout
            </button>
          </div>
        )}

        {/* Non-logged in nav items */}
        {!user && (
          <div className="flex items-center gap-4">
            <NavLink to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block px-5 py-2.5 rounded-xl font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--accent-secondary)]/30 transition-all"
              >
                Log in
              </motion.button>
            </NavLink>
            <NavLink to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:shadow-xl hover:opacity-90 transition-all"
              >
                Join for Free
              </motion.button>
            </NavLink>
          </div>
        )}

        {/* Mobile Menu Toggle & Profile (Tablet/Phone) */}
        {user && (
          <div className="xl:hidden flex items-center gap-3">
             <button
              onClick={handleProfileClick}
              className="h-9 w-9 rounded-full border border-[var(--accent-secondary)]/30 bg-white/50 overflow-hidden"
            >
               {user?.avatar || user?.profilePic ? (
                <img
                  src={user.avatar || user.profilePic}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://ik.imagekit.io/ayushrathore1/image(1).png?updatedAt=1761828486524"; }}
                />
               ) : (
                 <div className="h-full w-full flex items-center justify-center bg-gray-200 text-xs font-bold">{user?.name?.[0]}</div>
               )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--accent-secondary)]/10"
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <span className={`block w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="xl:hidden overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--accent-secondary)]/20"
      >
        <div className="px-4 py-4 space-y-2 flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => handleMobileNavClick(item.path)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl font-medium transition-colors relative z-10 ${
                  isActive
                    ? "bg-[var(--action-primary)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--accent-secondary)]/10"
                }`
              }
              style={({ isActive }) => isActive ? { color: '#ffffff' } : {}}
            >
              <span className="relative z-20 flex items-center justify-between">
                {item.label}
                {/* Notification badge for Messages in mobile menu */}
                {item.path === "/messages" && unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                {/* Notification badge for Notifications in mobile menu */}
                {item.path === "/notifications" && unreadNotifications > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </span>
            </NavLink>
          ))}
          <button
            onClick={() => { 
              sessionStorage.removeItem("medha_feature_modal_shown");
              onLogout(); 
              setIsMobileMenuOpen(false); 
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 mt-2"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
