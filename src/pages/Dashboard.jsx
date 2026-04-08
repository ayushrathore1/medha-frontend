import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFire, FaPlus, FaFolderOpen } from "react-icons/fa6";

import Loader from "../components/Common/Loader";
import SubjectManager from "../components/Dashboard/SubjectManager";
import TodoList from "../components/Dashboard/TodoList";
import DailyQuoteWidget from "../components/Dashboard/DailyQuoteWidget";

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
    notesCreated: isGuestMode ? 8 : 0,
  });
  const [loading, setLoading] = useState(!isGuestMode);
  const [greeting, setGreeting] = useState("Good Morning");



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

      const [statsRes] = await Promise.all([
        axios.get(`${baseUrl}/api/dashboard/stats`, { headers }),
      ]);
      
      setStats(statsRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <Loader fullScreen />;

  const quickActions = [
    { label: "New Note", icon: <FaPlus />, to: "/notes", color: "text-[var(--action-primary)]", bg: "bg-[var(--action-primary)]/10" },
    { label: "Archive", icon: <FaFolderOpen />, to: "/rtu-exams", color: "text-[var(--color-success-text)]", bg: "bg-[var(--color-success-bg)]" },
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
          {/* Todo List + Subject Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div data-tour="daily-plan" className="h-full">
              <TodoList />
            </div>
            <div data-tour="manage-subjects" className="h-full">
              <SubjectManager />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
