import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCrown, FaMoon, FaSun, FaLock, FaUser } from "react-icons/fa6";
import { PlayCircle } from "lucide-react";
import { useTour } from "../../context/TourContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { getAvatarByIndex } from "../../utils/avatarUtils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CHARCHA_ENABLED = import.meta.env.VITE_ENABLE_CHARCHA === 'true';
const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

// Known universities for label display
const KNOWN_UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];

const getBaseNavItems = (userUniversity) => {
  // Determine exam tab label based on user's university
  let examLabel = "Exams";
  if (userUniversity) {
    if (KNOWN_UNIVERSITIES.includes(userUniversity)) {
      examLabel = `${userUniversity} Exams`;
    } else {
      examLabel = "University Exams";
    }
  } else {
    examLabel = "Exams";
  }

  const items = [
    { path: "/dashboard", label: "Dashboard", isFree: false },
    { path: "/notes", label: "Notes", isFree: true },
    { path: "/exams", label: examLabel, isFree: true },
    { path: "/flashcards", label: "Flashcards", isFree: false },
    { path: "/quiz", label: "Quiz", isFree: false },
    { path: "/chatbot", label: "Chatbot", isFree: false },
    { path: "/notifications", label: "Notifications", isFree: false },
  ];

  // Only add Charcha if feature flag is enabled
  if (CHARCHA_ENABLED) {
    items.push({ path: "/charcha", label: "Charcha", isFree: false });
  }

  return items;
};

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
  const { theme, toggleTheme, isDarkThemeEnabled } = useTheme();
  const { isGuestMode, startTour, isTourEnabled } = useTour();
  const { showAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Messages
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Notifications
  const [imgError, setImgError] = useState(false);
  const [mobileImgError, setMobileImgError] = useState(false);
  const prevUnreadNotifications = useRef(0);

  // Reset image errors when user profile changes
  useEffect(() => {
    setImgError(false);
    setMobileImgError(false);
  }, [user?.avatar, user?.avatarIndex, user?.gender, user?.email]);

  // Generate nav items based on user's university
  const baseNavItems = getBaseNavItems(user?.university);

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

  // Check if user is admin (only on mount or user change)
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
        return;
      }
      
      // Use cached value immediately to prevent flickering
      const cachedAdmin = localStorage.getItem("isAdmin") === "true";
      if (cachedAdmin) {
        setIsAdmin(true);
      }
      
      try {
        const adminRes = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const adminStatus = adminRes.data.isAdmin;
        setIsAdmin(adminStatus);
        localStorage.setItem("isAdmin", adminStatus ? "true" : "false");
      } catch {
        // Only reset if we don't have a cached value
        if (!cachedAdmin) {
          setIsAdmin(false);
        }
      }
    };
    
    if (user) {
      checkAdmin();
    } else {
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
    }
  }, [user]);

  // Fetch unread counts separately (doesn't affect admin status)
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
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
        setUnreadCount(0);
        setUnreadNotifications(0);
      }
    };
    
    if (user) {
      fetchUnreadCounts();
      // Poll for unread count every 30 seconds
      const interval = setInterval(fetchUnreadCounts, 30000);
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

  // Helper: Get the correct avatar URL for the user
  const getProfileAvatarUrl = () => {
    // 1. Use custom avatar if uploaded
    if (user?.avatar) {
      return user.avatar;
    }
    // 2. Fallback is now handled by conditional rendering (FaUser icon)
    return null;
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
          {/* Logo Icon */}
          <img
            src={
              theme === "premium-dark"
                ? "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/8.svg?updatedAt=1767677218616" // Dark Mode Icon
                : "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473" // Light Mode Icon
            }
            alt="MEDHA Icon"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            draggable="false"
          />
          

        </div>

        {/* Desktop Nav - Always show for all users */}
        <div className="hidden xl:flex gap-5 items-center">
          {navItems.map((item) => {
            // Check if item is locked for guests
            const isLocked = !user && !item.isFree;
            
            // Handle click for locked items
            const handleClick = (e) => {
              if (isLocked) {
                e.preventDefault();
                showAuthModal(item.label);
              }
            };

            return (
              <NavLink
                key={item.path}
                to={isLocked ? "#" : item.path}
                onClick={handleClick}
                data-tour={item.path === '/dashboard' ? 'dashboard-link' : 
                           item.path === '/chatbot' ? 'ai-tutor' : 
                           item.path === '/flashcards' ? 'flashcards' : 
                           item.path === '/rtu-exams' ? 'rtu-exams' : undefined}
                style={{ position: "relative", display: "inline-block" }}
                className={`font-medium px-3 py-2 rounded-xl transition-all duration-200 text-base whitespace-nowrap ${
                  item.isAdmin ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30" : ""
                } ${isLocked ? "opacity-70" : ""}`}
              >
                {({ isActive }) => (
                  <motion.span
                    initial="inactive"
                    animate={isActive && !isLocked ? "active" : "inactive"}
                    whileHover="hover"
                    variants={item.isAdmin ? {
                      ...linkVariants,
                      inactive: { scale: 1, color: "#f59e0b" },
                      active: { scale: 1.12, color: "#f59e0b" },
                    } : linkVariants}
                    className="relative block flex items-center gap-1.5"
                  >
                    {item.isAdmin && <FaCrown className="text-amber-500" />}
                    {isLocked && <FaLock className="text-gray-400 text-[10px]" />}
                    {item.label}
                    {/* Notification badge for Messages */}
                    {item.path === "/charcha" && unreadCount > 0 && !isLocked && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[18px] text-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                    {/* Notification badge for Notifications */}
                    {item.path === "/notifications" && unreadNotifications > 0 && !isLocked && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full min-w-[18px] text-center">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                    {isActive && !isLocked && (
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
            );
          })}

          {/* Right side elements for logged-in users */}
          {user && (
            <>
              {/* Profile avatar */}
              <button
                onClick={handleProfileClick}
                data-tour="profile"
                className="ml-2 h-10 w-10 rounded-full border border-[var(--accent-secondary)]/30 bg-white/50 hover:bg-white/80 shadow-sm transition overflow-hidden flex items-center justify-center"
                title="Profile"
              >
                {!imgError && getProfileAvatarUrl() ? (
                  <img
                    alt="Profile"
                    src={getProfileAvatarUrl()}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                    draggable="false"
                  />
                ) : (
                  <div className="h-full w-full rounded-full flex items-center justify-center text-xl text-white bg-gradient-to-br from-[var(--action-primary)] to-[var(--accent-secondary)]">
                    <FaUser />
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
            </>
          )}

          {/* Right side elements for guests */}
          {!user && (
            <>
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
                  className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:shadow-xl hover:opacity-90 transition-all"
                >
                  Join for Free
                </motion.button>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle & Profile (Tablet/Phone) */}
        {/* Mobile Menu Toggle - Always show */}
        <div className="xl:hidden flex items-center gap-3">
          {/* Profile button only for logged in */}
          {user && (
            <button
              onClick={handleProfileClick}
              className="h-9 w-9 rounded-full border border-[var(--accent-secondary)]/30 bg-white/50 overflow-hidden flex items-center justify-center"
            >
              {!mobileImgError && getProfileAvatarUrl() ? (
                <img
                  src={getProfileAvatarUrl()}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => setMobileImgError(true)}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                  <FaUser size={16} />
                </div>
              )}
            </button>
          )}
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
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="xl:hidden overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--accent-secondary)]/20"
      >
        <div className="px-4 py-4 space-y-2 flex flex-col">
          {navItems.map((item) => {
            const isLocked = !user && !item.isFree;
            
            const handleMobileItemClick = (e) => {
              if (isLocked) {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                showAuthModal(item.label);
              } else {
                handleMobileNavClick();
              }
            };
            
            return (
              <NavLink
                key={item.path}
                to={isLocked ? "#" : item.path}
                onClick={handleMobileItemClick}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl font-medium transition-colors relative z-10 ${
                    isActive && !isLocked
                      ? "bg-[var(--action-primary)] text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--accent-secondary)]/10"
                  } ${isLocked ? "opacity-70" : ""}`
                }
                style={({ isActive }) => isActive && !isLocked ? { color: '#ffffff' } : {}}
              >
                <span className="relative z-20 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {isLocked && <FaLock className="text-gray-400 text-xs" />}
                    {item.label}
                  </span>
                  {/* Notification badge for Messages in mobile menu */}
                  {item.path === "/charcha" && unreadCount > 0 && !isLocked && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                  {/* Notification badge for Notifications in mobile menu */}
                  {item.path === "/notifications" && unreadNotifications > 0 && !isLocked && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  )}
                </span>
              </NavLink>
            );
          })}

          {/* Theme Toggle Mobile - only show when dark theme is enabled */}
          {isDarkThemeEnabled && (
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--accent-secondary)]/10 flex items-center gap-2"
            >
              {theme === "premium-dark" ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
              {theme === "premium-dark" ? "Light Mode" : "Dark Mode"}
            </button>
          )}
          
          {/* Logout button - only for logged in users */}
          {user && (
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
          )}

          {/* Sign in/up for guests in mobile menu */}
          {!user && (
            <div className="space-y-2 mt-4 pt-4 border-t border-[var(--accent-secondary)]/20">
              <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center px-4 py-3 rounded-xl font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--accent-secondary)]/30">
                  Log in
                </button>
              </NavLink>
              <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]">
                  Join for Free
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
