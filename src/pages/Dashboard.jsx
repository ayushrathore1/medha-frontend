import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubjectList from "../components/Subject/SubjectList";
import Button from "../components/Common/Button";
import Footer from "../components/Common/Footer";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/welcome");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserAndDashboardData = async () => {
      setLoading(true);
      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          navigate("/welcome");
          return;
        }

        const subjRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const subjData = await subjRes.json();
        setSubjects(Array.isArray(subjData.subjects) ? subjData.subjects : []);

        const notesRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/notes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const notesData = await notesRes.json();
        setNotesCount(
          Array.isArray(notesData.notes) ? notesData.notes.length : 0
        );

        const quizRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const quizData = await quizRes.json();
        setRecentQuizzes(
          Array.isArray(quizData.quizzes) ? quizData.quizzes.slice(0, 5) : []
        );
      } catch (error) {
        console.error("Dashboard API error:", error);
        localStorage.removeItem("token");
        navigate("/welcome");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDashboardData();
  }, [navigate]);

  const averageScore =
    recentQuizzes.length > 0
      ? Math.round(
          (recentQuizzes.reduce(
            (acc, quiz) => acc + quiz.score / quiz.total,
            0
          ) /
            recentQuizzes.length) *
            100
        )
      : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-2 border-transparent border-t-violet-500 rounded-full mx-auto mb-6"
          />
          <p className="text-gray-400 text-sm tracking-wider">
            Loading your space...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur opacity-40" />
              <img
                src={
                  user?.avatar ||
                  "https://ik.imagekit.io/ayushrathore1/image(1).png?updatedAt=1761828486524"
                }
                alt="Avatar"
                className="w-11 h-11 rounded-full object-cover border border-white/10 relative"
              />
            </motion.div>
            <div>
              <p className="text-sm text-gray-500 font-light">
                {getGreeting()}
              </p>
              <p className="text-base font-semibold tracking-tight">
                {user.name}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { to: "/notes", label: "Notes", color: "text-violet-400" },
              { to: "/subjects", label: "Subjects", color: "text-blue-400" },
              { to: "/quiz", label: "Quiz", color: "text-emerald-400" },
              { to: "/chatbot", label: "AI Tutor", color: "text-orange-400" },
            ].map((item, i) => (
              <Link key={i} to={item.to}>
                <motion.span
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`text-sm font-medium text-gray-400 hover:${item.color} transition-colors cursor-pointer`}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="mb-20">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
                  Your Learning
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Command Center
                  </span>
                </motion.h1>

                <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                  {subjects.length} subjects · {notesCount} notes ·{" "}
                  {recentQuizzes.length} quizzes completed
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    {
                      to: "/notes",
                      icon: "📝",
                      label: "Notes",
                      bg: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20",
                      color: "text-violet-400",
                    },
                    {
                      to: "/flashcards",
                      icon: "🎴",
                      label: "Flashcards",
                      bg: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
                      color: "text-purple-400",
                    },
                    {
                      to: "/quiz",
                      icon: "🧠",
                      label: "Quiz",
                      bg: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
                      color: "text-emerald-400",
                    },
                    {
                      to: "/chatbot",
                      icon: "🤖",
                      label: "AI Tutor",
                      bg: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
                      color: "text-blue-400",
                    },
                  ].map((btn, i) => (
                    <Link key={i} to={btn.to}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`${btn.bg} border backdrop-blur-xl px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${btn.color}`}
                      >
                        <span className="mr-2">{btn.icon}</span>
                        {btn.label}
                      </motion.button>
                    </Link>
                  ))}
                </div>
              </div>

              <motion.div variants={itemVariants} className="flex-1 relative">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl blur-2xl"
                  />
                  <motion.img
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    src="https://ik.imagekit.io/ayushrathore1/studyIllustration?updatedAt=1758344375764"
                    alt="Study"
                    className="relative w-full max-w-md mx-auto rounded-3xl"
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Stats Grid */}
          <motion.section variants={itemVariants} className="mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  value: subjects.length,
                  label: "Subjects",
                  sublabel: subjects.length === 0 ? "Add some now!" : "Active",
                  from: "from-violet-500",
                  to: "to-purple-500",
                },
                {
                  value: notesCount,
                  label: "Notes",
                  sublabel: "Created",
                  from: "from-blue-500",
                  to: "to-cyan-500",
                },
                {
                  value: recentQuizzes.length,
                  label: "Quizzes",
                  sublabel: "Taken",
                  from: "from-emerald-500",
                  to: "to-teal-500",
                },
                {
                  value: `${averageScore}%`,
                  label: "Avg Score",
                  sublabel:
                    averageScore >= 75
                      ? "Excellent"
                      : averageScore > 0
                        ? "Growing"
                        : "Start now",
                  from: "from-orange-500",
                  to: "to-yellow-500",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${stat.from} ${stat.to} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-300">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.sublabel}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Content Grid */}
          <motion.section variants={itemVariants}>
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              {/* Subjects */}
              <motion.div
                whileHover={{ y: -2 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Subjects
                  </h2>
                  <Link to="/subjects">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-sm font-medium text-blue-300 transition-colors"
                    >
                      Manage
                    </motion.button>
                  </Link>
                </div>

                {subjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📚</div>
                    <p className="text-gray-400 mb-4">No subjects yet</p>
                    <Link to="/subjects">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-white transition-colors"
                      >
                        Add Subject
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <SubjectList subjects={subjects} />
                )}
              </motion.div>

              {/* Recent Quizzes */}
              <motion.div
                whileHover={{ y: -2 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Recent Quizzes
                  </h2>
                  <Link to="/quiz">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-300 transition-colors"
                    >
                      Take Quiz
                    </motion.button>
                  </Link>
                </div>
                {recentQuizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-400 mb-4">No quizzes yet</p>
                    <Link to="/quiz">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium text-white transition-colors"
                      >
                        Start Quiz
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {recentQuizzes.map((quiz, i) => {
                      const percentage = Math.round(
                        (quiz.score / quiz.total) * 100
                      );
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{
                            x: 4,
                            backgroundColor: "rgba(255,255,255,0.08)",
                          }}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center transition-all"
                        >
                          <div>
                            <div className="font-semibold text-base mb-1 text-white">
                              {quiz.subject}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(quiz.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">
                              {quiz.score}/{quiz.total}
                            </div>
                            <div
                              className={`text-xs font-medium ${
                                percentage >= 80
                                  ? "text-emerald-400"
                                  : percentage >= 60
                                    ? "text-yellow-400"
                                    : "text-red-400"
                              }`}
                            >
                              {percentage}%
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-6 tracking-tight text-white">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  to: "/notes",
                  icon: "📝",
                  label: "Create Note",
                  color: "violet",
                  text: "text-violet-400",
                },
                {
                  to: "/quiz",
                  icon: "🧠",
                  label: "Take Quiz",
                  color: "emerald",
                  text: "text-emerald-400",
                },
                {
                  to: "/flashcards",
                  icon: "🎴",
                  label: "Study Cards",
                  color: "purple",
                  text: "text-purple-400",
                },
                {
                  to: "/chatbot",
                  icon: "🤖",
                  label: "Ask AI",
                  color: "blue",
                  text: "text-blue-400",
                },
              ].map((action, i) => (
                <Link key={i} to={action.to}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`backdrop-blur-xl bg-${action.color}-500/5 border border-${action.color}-500/20 rounded-2xl p-6 text-center cursor-pointer transition-all group ${action.text}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-3xl mb-2 transition-transform"
                    >
                      {action.icon}
                    </motion.div>
                    <div className="text-sm font-medium">{action.label}</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          <div className="w-full flex justify-center py-32">
            <div className="h-80 w-full max-w-3xl bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-purple-500/10 rounded-3xl blur-2xl opacity-60"></div>
          </div>

          <Footer />
        </motion.div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};

export default Dashboard;
