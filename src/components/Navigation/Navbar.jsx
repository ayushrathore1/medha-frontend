import React, { useState, useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCrown, FaMoon, FaSun, FaLock, FaUser, FaBell, FaComments } from "react-icons/fa6";
import { PlayCircle, Sparkles } from "lucide-react";
import { useTour } from "../../context/TourContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { useChatbot } from "../../context/ChatbotContext";
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
      examLabel = `${userUniversity} PYQ Analysis`;
    } else {
      examLabel = "PYQ Analysis";
    }
  } else {
    examLabel = "PYQ Analysis";
  }

  const items = [
    { path: "/dashboard", label: "Dashboard", isFree: false },
    { path: "/visualizations", label: "Visualizations", isFree: true, isUSP: true },
    { path: "/notes", label: "Notes Community", isFree: true },
    { path: "/exams", label: examLabel, isFree: true },
    { path: "/recommendations", label: "Recommendations", isFree: false },
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
  const { openChatbot } = useChatbot();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Messages
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Notifications
  const [imgError, setImgError] = useState(false);
  const [mobileImgError, setMobileImgError] = useState(false);
  const [showPremiumToast, setShowPremiumToast] = useState(false);
  const [premiumCount, setPremiumCount] = useState(0);
  const [hasNotifiedPremium, setHasNotifiedPremium] = useState(false);
  const prevUnreadNotifications = useRef(0);

  // Fetch premium stats on mount
  useEffect(() => {
    const fetchPremiumStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/premium/count`);
        setPremiumCount(res.data.count);
        
        if (user) {
          const statusRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/premium/status`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setHasNotifiedPremium(statusRes.data.hasRegistered);
        }
      } catch (err) {
        console.error("Failed to fetch premium stats", err);
      }
    };
    fetchPremiumStats();
  }, [user]);

  const handleNotifyPremium = async () => {
    if (!user) {
      showAuthModal();
      return;
    }
    
    try {
      setHasNotifiedPremium(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/premium/notify`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPremiumCount(res.data.count);
    } catch (err) {
       console.error("Failed to notify premium interest", err);
    }
  };

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
          {/* Logo - Rectangle SVG with overflow hidden */}
          <div className="h-12 sm:h-14 overflow-hidden flex items-center">
            <img
              src={
                theme === "premium-dark"
                  ? "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/4.svg?updatedAt=1767677218648" // Dark Mode Logo
                  : "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/2.svg?updatedAt=1767677218424" // Light Mode Logo
              }
              alt="MEDHA Revision"
              className="h-20 sm:h-24 object-contain"
              draggable="false"
            />
          </div>

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
                    {item.isUSP && <Sparkles size={16} className="text-[var(--accent-secondary)]" />}
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
              {/* AI Chat Button */}
              <button
                onClick={() => openChatbot()}
                className="relative ml-2 p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                title="Ask Medha AI"
              >
                <FaComments className="text-xl text-[var(--text-secondary)] hover:text-[var(--action-primary)]" />
              </button>

              {/* Notification Bell */}
              <NavLink
                to="/notifications"
                className="relative ml-2 p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                title="Notifications"
              >
                <FaBell className="text-xl text-[var(--text-secondary)] hover:text-[var(--action-primary)]" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[16px] text-center">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </NavLink>

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

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="ml-3 p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-all group"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <FaSun className="text-amber-400 group-hover:text-amber-300 transition-colors" size={18} />
                ) : (
                  <FaMoon className="text-amber-600 group-hover:text-amber-500 transition-colors" size={18} />
                )}
              </button>

              {/* Join Premium Button - Medha Theme */}
              <button
                onClick={() => setShowPremiumToast(true)}
                className="relative ml-3 px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden group shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: "linear-gradient(135deg, var(--action-primary) 0%, var(--accent-secondary) 100%)",
                  color: "#ffffff"
                }}
              >
                <span className="relative flex items-center gap-2 drop-shadow-sm">
                  <FaCrown className="text-white" />
                  <span>Join Premium</span>
                </span>
              </button>

              {/* Premium Coming Soon Modal - Using Portal */}
              {showPremiumToast && ReactDOM.createPortal(
                <div 
                  className="fixed inset-0 flex items-center justify-center"
                  style={{ zIndex: 999999 }}
                >
                  {/* Backdrop */}
                  <div 
                    className="absolute inset-0 bg-black/90"
                    style={{ backdropFilter: "blur(12px)" }}
                    onClick={() => setShowPremiumToast(false)}
                  />
                    {/* Portrait Medha Clean Card */}
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-[500px] overflow-hidden rounded-[2.5rem] transform scale-100"
                      style={{
                        background: "#ffffff",
                        boxShadow: "0 0 60px rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.1)",
                        border: "1px solid var(--border-default)",
                        height: "580px",
                      }}
                    >
                      {/* Top accent bar */}
                      <div className="h-2 w-full" style={{
                        background: "linear-gradient(90deg, var(--action-primary), var(--accent-secondary))",
                      }} />
                      
                      {/* Content */}
                      <div className="relative p-8 flex flex-col items-center h-[570px]">
                        {/* Premium Badge */}
                        <div className="mb-5 px-5 py-2 rounded-full border" style={{
                          background: "var(--bg-secondary)",
                          borderColor: "var(--action-primary)"
                        }}>
                          <span className="text-xs font-bold tracking-[0.2em] text-[var(--action-primary)] uppercase">✦ Premium ✦</span>
                        </div>
                        
                        {/* Crown icon with soft background */}
                        <div className="relative mb-5">
                          <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-[var(--bg-tertiary)] border-4 border-white shadow-lg">
                            <FaCrown className="text-5xl text-[var(--action-primary)]" />
                          </div>
                        </div>
                        
                        {/* Coming Soon Title */}
                        <h2 className="text-4xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)]">
                          Coming Soon
                        </h2>
                        
                        <p className="text-[var(--text-secondary)] text-sm font-medium text-center mb-6">
                          Premium features are being crafted for you
                        </p>
                        
                        {/* Features List */}
                        <div className="w-full space-y-2.5 mb-6 select-none relative">
                          <div style={{ filter: "blur(4px)" }}>
                            {[
                              "✦ Unlimited AI Generations",
                              "✦ Premium Visualizations",
                              "✦ Priority Support",
                              "✦ Ad-Free Experience",
                              "✦ Early Access Features",
                            ].map((feature, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 bg-[var(--bg-tertiary)] border-l-4 border-[var(--accent-secondary)]"
                              >
                                <span className="text-[var(--text-primary)] text-sm font-semibold">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {/* Lock overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/90 shadow-xl border border-[var(--border-default)]">
                              <FaLock className="text-[var(--accent-secondary)] text-2xl" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Notify Me Button */}
                        <button
                          onClick={handleNotifyPremium}
                          disabled={hasNotifiedPremium}
                          className={`mt-auto px-10 py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg ${
                            hasNotifiedPremium 
                            ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed shadow-none border border-[var(--border-default)]"
                            : "bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] text-white hover:scale-105 active:scale-95 hover:shadow-xl"
                          }`} 
                        >
                          {hasNotifiedPremium ? "Notified ✓" : `Notify Me (${premiumCount})`}
                        </button>
                      </div>
                    </div>
                </div>,
                document.body
              )}

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
