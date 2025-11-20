import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Zap,
  CheckCircle,
  Sparkles,
  Layout,
  MessageSquare,
  MoreVertical,
} from "lucide-react";

import Loader from "../components/Common/Loader";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Footer from "../components/Common/Footer";

const SubjectList = ({ subjects }) => {
  return (
    <div className="space-y-3">
      {subjects.map((subject, i) => (
        <motion.div
          key={subject._id || i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ x: 4 }}
          className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 border border-[var(--accent-secondary)]/20 rounded-xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-secondary)]/20 to-[var(--action-primary)]/10 flex items-center justify-center text-[var(--action-primary)]">
              <BookOpen size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)]">
                {subject.name || "Untitled Subject"}
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                {subject.topicsCount || 0} Topics
              </p>
            </div>
          </div>
          <Button variant="ghost" size="small" className="!p-2">
            <MoreVertical size={16} />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

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
      const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const [userRes, subjRes, notesRes, quizRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quizzes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          navigate("/welcome");
          return;
        }

        const subjData = await subjRes.json();
        setSubjects(Array.isArray(subjData.subjects) ? subjData.subjects : []);

        const notesData = await notesRes.json();
        setNotesCount(
          Array.isArray(notesData.notes) ? notesData.notes.length : 0
        );

        const quizData = await quizRes.json();
        setRecentQuizzes(
          Array.isArray(quizData.quizzes) ? quizData.quizzes.slice(0, 5) : []
        );

        await minLoadTime;
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

  if (loading || !user) return <Loader fullScreen />;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 text-[var(--text-primary)]">
              Your Learning <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)]">
                Command Center
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed">
              You're doing great! You have{" "}
              <strong className="text-[var(--action-primary)]">{subjects.length} subjects</strong> active and have
              completed <strong className="text-[var(--action-primary)]">{recentQuizzes.length} quizzes</strong>.
            </p>
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-3">
            {[
              {
                to: "/notes",
                label: "Notes",
                icon: BookOpen,
                color: "text-[var(--action-primary)]",
                bg: "bg-[var(--action-primary)]/10",
              },
              {
                to: "/flashcards",
                label: "Cards",
                icon: Layout,
                color: "text-[var(--accent-primary)]",
                bg: "bg-[var(--accent-primary)]/10",
              },
              {
                to: "/quiz",
                label: "Quiz",
                icon: CheckCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-100",
              },
              {
                to: "/chatbot",
                label: "AI Tutor",
                icon: MessageSquare,
                color: "text-[var(--action-secondary)]",
                bg: "bg-[var(--action-secondary)]/20",
              },
            ].map((btn, i) => (
              <Link key={i} to={btn.to}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${btn.bg} ${btn.color} backdrop-blur-sm border border-white/20 shadow-sm`}
                >
                  <btn.icon size={18} />
                  {btn.label}
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              label: "Subjects",
              value: subjects.length,
              icon: BookOpen,
              sub: "Active Courses",
            },
            {
              label: "Notes",
              value: notesCount,
              icon: Layout,
              sub: "Created So Far",
            },
            {
              label: "Quizzes",
              value: recentQuizzes.length,
              icon: CheckCircle,
              sub: "Completed",
            },
            {
              label: "Avg Score",
              value: `${averageScore}%`,
              icon: Brain,
              sub: averageScore >= 75 ? "Excellent!" : "Keep Going",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="flex flex-col items-center text-center group hover:bg-white/80 transition-colors"
            >
              <div
                className={`mb-3 p-3 rounded-full bg-gradient-to-br from-[var(--bg-primary)] to-white shadow-sm text-[var(--action-primary)]`}
              >
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-extrabold text-[var(--text-primary)] mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-xs text-[var(--text-secondary)]/70 mt-1 font-medium">
                {stat.sub}
              </div>
            </Card>
          ))}
        </motion.section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Subjects Column */}
          <Card
            className="p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles size={20} className="text-[var(--action-secondary)]" /> Subjects
              </h2>
              <Link to="/subjects">
                <Button variant="secondary" size="small" className="text-xs">
                  Manage
                </Button>
              </Link>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <BookOpen size={48} className="mx-auto mb-3 text-[var(--accent-secondary)]" />
                <p className="text-[var(--text-secondary)] font-medium">No subjects yet.</p>
                <Link
                  to="/subjects"
                  className="text-[var(--action-primary)] text-sm font-bold mt-2 inline-block hover:underline"
                >
                  Add your first subject
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <SubjectList subjects={subjects} />
              </div>
            )}
          </Card>

          {/* Recent Quizzes Column */}
          <Card
            className="p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Zap size={20} className="text-[var(--action-secondary)]" /> Recent Quizzes
              </h2>
              <Link to="/quiz">
                <Button variant="success" size="small" className="text-xs bg-emerald-100 text-emerald-600 hover:bg-emerald-200 shadow-none">
                  Take Quiz
                </Button>
              </Link>
            </div>

            {recentQuizzes.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <Brain size={48} className="mx-auto mb-3 text-[var(--accent-secondary)]" />
                <p className="text-[var(--text-secondary)] font-medium">No quizzes taken.</p>
                <Link
                  to="/quiz"
                  className="text-emerald-600 text-sm font-bold mt-2 inline-block hover:underline"
                >
                  Start a quiz now
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {recentQuizzes.map((quiz, i) => {
                  const percentage = Math.round(
                    (quiz.score / quiz.total) * 100
                  );
                  const scoreColor =
                    percentage >= 80
                      ? "text-emerald-500"
                      : percentage >= 60
                        ? "text-yellow-500"
                        : "text-red-400";

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ x: 4 }}
                      className="bg-white/50 border border-[var(--accent-secondary)]/20 rounded-xl p-4 flex justify-between items-center shadow-sm"
                    >
                      <div>
                        <div className="font-bold text-[var(--text-primary)] text-sm md:text-base">
                          {quiz.subject}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          {new Date(quiz.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-extrabold ${scoreColor}`}>
                          {quiz.score}/{quiz.total}
                        </div>
                        <div className="text-[10px] font-bold uppercase text-gray-400">
                          {percentage}%
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Medha footer branding */}
        <div className="flex justify-center py-12">
          <h1 className="text-8xl font-black opacity-5 select-none tracking-tighter text-[var(--text-primary)]">
            MEDHA
          </h1>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
