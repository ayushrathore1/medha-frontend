import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  FaFire, FaBook, FaChartLine, FaTrash, 
  FaPlus, FaBrain, FaFolderOpen, FaLightbulb 
} from "react-icons/fa";

import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import SubjectManager from "../components/Dashboard/SubjectManager";
import CalendarWidget from "../components/Dashboard/CalendarWidget";
import LiveClock from "../components/Dashboard/LiveClock";
import StudyTimer from "../components/Dashboard/StudyTimer";
import FeatureAnnouncementModal from "../components/Common/FeatureAnnouncementModal";
import DailyPlanWidget from "../components/Dashboard/DailyPlanWidget";
import TodoList from "../components/Dashboard/TodoList";

const Dashboard = () => {
  const [stats, setStats] = useState({
    streak: 0,
    cardsLearned: 0,
    accuracy: 0,
    reviewList: [],
    quizzesTaken: 0,
    notesCreated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");
  const [showFeatureModal, setShowFeatureModal] = useState(false);
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

      const [statsRes, userRes] = await Promise.all([
        axios.get(`${baseUrl}/api/dashboard/stats`, { headers }),
        axios.get(`${baseUrl}/api/users/me`, { headers })
      ]);
      
      setStats(statsRes.data);
      setUserName(statsRes.data.userName || "Student");

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
    { label: "New Note", icon: <FaPlus />, to: "/notes", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Start Quiz", icon: <FaBrain />, to: "/quiz", color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Archive", icon: <FaFolderOpen />, to: "/rtu-exams", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "AI Tutor", icon: <FaLightbulb />, to: "/chatbot", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {greeting}, {userName}! <span className="inline-block animate-wave origin-bottom-right">👋</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
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
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <FaFire size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{stats.streak}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day Streak</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.to}>
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className={`p-3 rounded-xl ${action.bg} ${action.color}`}>
                  {action.icon}
                </div>
                <span className="font-bold text-slate-700">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
               <Card className="flex items-center gap-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-none">
                 <div className="p-3 bg-white/20 rounded-xl">
                   <FaBook size={24} />
                 </div>
                 <div>
                   <div className="text-3xl font-black">{stats.cardsLearned}</div>
                   <div className="text-indigo-100 font-medium">Cards Mastered</div>
                 </div>
               </Card>
               <Card className="flex items-center gap-4 bg-white">
                 <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                   <FaChartLine size={24} />
                 </div>
                 <div>
                   <div className="text-3xl font-black text-slate-900">{stats.accuracy}%</div>
                   <div className="text-slate-500 font-medium">Avg Accuracy</div>
                 </div>
               </Card>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="h-full">
                  <DailyPlanWidget />
               </div>
               <div className="h-full">
                  <TodoList />
               </div>
            </div>

            <SubjectManager />

            {/* Review List */}
            <Card title="Topics to Review">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Focus Areas</h2>
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stats.reviewList.length} Topics</span>
              </div>
              
              {stats.reviewList.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
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
                      className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors"
                    >
                      <div>
                        <h3 className="font-bold text-slate-800">{topic.name}</h3>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase mt-1 inline-block">
                          {topic.difficulty} Difficulty
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleDeleteTopic(topic.name)}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-500"
                      >
                        <FaTrash />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="sticky top-24 space-y-6 p-6">
              <LiveClock />
              <div className="h-px bg-slate-100 w-full"></div>
              <CalendarWidget />
              <div className="h-px bg-slate-100 w-full"></div>
              <StudyTimer />
            </Card>
          </div>

        </div>
      </div>
      <FeatureAnnouncementModal 
        isOpen={showFeatureModal} 
        onClose={() => setShowFeatureModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
