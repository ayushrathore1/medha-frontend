import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaFire, FaBook, FaTrash, FaPlus, FaBrain, FaFolderOpen, FaLightbulb } from "react-icons/fa6";

import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import SubjectManager from "../components/Dashboard/SubjectManager";
import FloatingToolsSidebar from "../components/Dashboard/FloatingToolsSidebar";
import FeatureAnnouncementModal from "../components/Common/FeatureAnnouncementModal";
import DailyPlanWidget from "../components/Dashboard/DailyPlanWidget";
import TodoList from "../components/Dashboard/TodoList";
import DailyQuoteWidget from "../components/Dashboard/DailyQuoteWidget";
import ThoughtDumpCard from "../components/Dashboard/ThoughtDumpCard";
import ActivityCalendar from "../components/Dashboard/ActivityCalendar";

import { useTour } from "../context/TourContext";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

const Dashboard = () => {
  const { isGuestMode } = useTour();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    streak: isGuestMode ? 12 : 0,
    cardsLearned: isGuestMode ? 142 : 0,
    // accuracy removed
    reviewList: isGuestMode ? [
      { _id: '1', name: 'Photosynthesis', difficulty: 'medium' },
      { _id: '2', name: 'Quantum Mechanics', difficulty: 'hard' }
    ] : [],
    quizzesTaken: isGuestMode ? 15 : 0,
    notesCreated: isGuestMode ? 8 : 0,
  });
  const [loading, setLoading] = useState(!isGuestMode);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const [statsRes, userRes] = await Promise.all([
        axios.get(`${baseUrl}/api/dashboard/stats`, { headers }),
        axios.get(`${baseUrl}/api/users/me`, { headers })
      ]);
      
      setStats(statsRes.data);

      // Check for Feature Announcement Modal
      const user = userRes.data;
      const MAX_VIEWS = 3;
      const SESSION_KEY = "medha_feature_modal_shown";

      if (
        (user.featureNotificationViews || 0) < MAX_VIEWS && 
        !sessionStorage.getItem(SESSION_KEY)
      ) {
        setShowFeatureModal(true);
        sessionStorage.setItem(SESSION_KEY, "true");
        await axios.post(`${baseUrl}/api/users/increment-notification-view`, {}, { headers });
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicName) => {
    if (!window.confirm(`Are you sure you want to delete all flashcards for topic "${topicName}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/topic/${encodeURIComponent(topicName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  if (loading) return <Loader fullScreen />;

  const quickActions = [
    { label: "New Note", icon: <FaPlus />, to: "/notes", color: "text-[var(--action-primary)]", bg: "bg-[var(--action-primary)]/10" },
    { label: "Start Quiz", icon: <FaBrain />, to: "/quiz", color: "text-[var(--gradient-end)]", bg: "bg-[var(--gradient-end)]/10" },
    { label: "Archive", icon: <FaFolderOpen />, to: "/rtu-exams", color: "text-[var(--color-success-text)]", bg: "bg-[var(--color-success-bg)]" },
    { label: "AI Tutor", icon: <FaLightbulb />, to: "/chatbot", color: "text-[var(--color-warning-text)]", bg: "bg-[var(--color-warning-bg)]" },
  ];

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Daily Inspirational Quote */}
        <DailyQuoteWidget />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight mb-2">
              {greeting}, {isGuestMode ? "Alex" : (user?.name || "Student")}! <span className="inline-block animate-wave origin-bottom-right">👋</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-medium">
              Let's make today productive.
            </p>
          </motion.div>

          {/* Quick Stats Grid (Compact) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4"
          >
            <div 
              data-tour="streak-card"
              className="flex items-center gap-3 px-5 py-3 bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-default)]"
            >
              <div className="p-2 bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] rounded-lg">
                <FaFire size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-[var(--text-primary)]">{stats.streak}</div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Day Streak</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Bar */}
        <div 
          data-tour="quick-actions"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.to}>
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-default)] hover:shadow-md transition-all cursor-pointer"
              >
                <div className={`p-3 rounded-xl ${action.bg} ${action.color}`}>
                  {action.icon}
                </div>
                <span className="font-bold text-[var(--text-primary)]">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="space-y-8">
          {/* Top Section: Stats/Daily Plan + Sidebar */}
          <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pb-10">
            
            {/* Main Content (Stats & Daily Plan) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Cards Mastered + AI Daily Coach */}
              <div className="flex flex-col gap-6 h-full">
                {/* Stats Card */}
                <Card 
                  data-tour="cards-mastered"
                  className="flex items-center gap-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-none shrink-0"
                >
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaBook size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-black">{stats.cardsLearned}</div>
                    <div className="text-indigo-100 font-medium">Cards Mastered</div>
                  </div>
                </Card>

                {/* AI Daily Coach */}
                <div data-tour="ai-daily-coach" className="flex-1 min-h-0">
                  <DailyPlanWidget />
                </div>
              </div>

              {/* Right Column: Todo List */}
              <div data-tour="daily-plan" className="h-full">
                <TodoList />
              </div>
            </div>

          {/* Sidebar (Thought Dump) */}
            <div className="lg:col-span-1 h-full flex flex-col">
              <ThoughtDumpCard className="flex-1 min-h-[400px]" />
            </div>

            {/* Scroll Down Indicator - Overlay Centered */}
            <AnimatePresence>
              {showScrollIndicator && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: [0, 5, 0] }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    y: { delay: 2, duration: 2, repeat: Infinity } 
                  }}
                  className="absolute bottom-[11.5rem] left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-[var(--text-secondary)] text-xs font-bold z-20 bg-[var(--bg-primary)]/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-[var(--border-default)] ring-1 ring-transparent"
                >
                  <span>Scroll for more</span>
                  <svg className="w-3.5 h-3.5 animate-bounce text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Section: Subject Manager & Focus Areas (Full Width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div data-tour="manage-subjects" className="h-full">
              <SubjectManager />
            </div>
            
            {/* Review List / Focus Areas */}
            <Card data-tour="focus-areas" title="Topics to Review" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Focus Areas</h2>
                <span className="text-sm font-semibold text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">{stats.reviewList.length} Topics</span>
              </div>
              
              {stats.reviewList.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-tertiary)]">
                  <div className="inline-block p-4 bg-emerald-50 text-emerald-500 rounded-full mb-3"><FaBrain size={24}/></div>
                  <p>All caught up! No active review topics.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.reviewList.map((topic) => (
                    <motion.div 
                      key={topic._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-default)] hover:border-[var(--action-primary)]/30 transition-colors"
                    >
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)]">{topic.name}</h3>
                        <span className="text-xs font-bold bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] px-2 py-0.5 rounded border border-transparent uppercase mt-1 inline-block">
                          {topic.difficulty} Difficulty
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleDeleteTopic(topic.name)}
                        variant="ghost"
                        size="sm"
                        className="text-[var(--text-tertiary)] opacity-70 hover:opacity-100"
                      >
                        <FaTrash />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Activity Calendar - at the bottom */}
        {!isGuestMode && <ActivityCalendar />}
      </div>
      <FeatureAnnouncementModal 
        isOpen={showFeatureModal} 
        onClose={() => setShowFeatureModal(false)} 
      />
      
      {/* Floating Clock & Timer Sidebar */}
      <FloatingToolsSidebar />
    </div>
  );
};

export default Dashboard;
