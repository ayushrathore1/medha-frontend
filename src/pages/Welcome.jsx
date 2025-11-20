import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Zap, BookOpen, MessageSquare } from "lucide-react";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";

const Welcome = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap size={32} />,
      title: "AI Note Reader",
      desc: "Upload handwritten notes, get smart MCQs and flashcards instantly.",
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      icon: <Sparkles size={32} />,
      title: "Practice & Quiz",
      desc: "Revise with flashcards, take quizzes, and track your progress.",
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      icon: <BookOpen size={32} />,
      title: "Subject Organization",
      desc: "Keep notes, quizzes, and flashcards grouped by subject.",
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Instant Chatbot",
      desc: "Ask your doubts and get instant explanations from your notes!",
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <div className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-12 px-4 z-10">
        <div className="max-w-6xl w-full flex flex-col items-center">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--action-primary)]/20 to-[var(--accent-secondary)]/20 rounded-full blur-3xl pointer-events-none"></div>
              <Card className="relative !bg-white/60 !backdrop-blur-xl p-8 border-[var(--accent-secondary)]/20 shadow-2xl ring-4 ring-white/30">
                <img
                  src="https://ik.imagekit.io/ayushrathore1/studyIllustration?updatedAt=1758344375764"
                  alt="Welcome illustration"
                  className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl"
                  draggable="false"
                />
              </Card>
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full shadow-lg border-2 border-white"
              />
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full shadow-lg border-2 border-white"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full shadow-lg border-2 border-white"
              />
            </div>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[var(--action-primary)]/10 text-[var(--action-primary)] border border-[var(--action-primary)]/20 shadow-sm">
                🎓 Welcome to the Future of Learning
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-[var(--action-primary)] via-[var(--accent-indigo)] to-[var(--action-secondary)] bg-clip-text text-transparent mb-6 leading-tight select-none tracking-tight">
              MEDHA
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] leading-relaxed mb-6">
                Transform your learning experience with{" "}
                <span className="font-bold text-[var(--action-primary)]">
                  AI-powered note processing
                </span>
                , instant flashcard generation, intelligent quizzes, and your
                personal AI tutor.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg text-[var(--text-primary)]">
                <span className="flex items-center gap-1 font-semibold"><CheckCircle size={18} className="text-emerald-500" /> Organized</span>
                <span className="hidden md:inline text-gray-300">•</span>
                <span className="flex items-center gap-1 font-semibold"><CheckCircle size={18} className="text-purple-500" /> Efficient</span>
                <span className="hidden md:inline text-gray-300">•</span>
                <span className="flex items-center gap-1 font-semibold"><CheckCircle size={18} className="text-blue-500" /> Intelligent</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <Link to="/register">
              <Button 
                variant="primary" 
                size="large" 
                className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                icon={<ArrowRight size={20} />}
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="large" 
                className="text-lg px-8 py-4 bg-white/50 hover:bg-white/80 backdrop-blur-md border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Welcome Back
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-6xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Why Students Love MEDHA
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
                Experience the next generation of learning tools designed for
                modern students
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  isActive={activeFeature === index}
                />
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full max-w-4xl mt-20"
          >
            <Card className="!bg-white/40 !backdrop-blur-lg border-white/40 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center p-4">
                <div>
                  <div className="text-4xl font-extrabold text-[var(--action-primary)] mb-2">
                    10K+
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium">Notes Processed</p>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-emerald-500 mb-2">
                    95%
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium">Accuracy Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-purple-500 mb-2">
                    24/7
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium">AI Support</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color, bg, isActive }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 ${
      isActive
        ? "border-[var(--action-primary)] shadow-xl ring-1 ring-[var(--action-primary)]/20"
        : "border-white/40 shadow-lg hover:border-[var(--action-primary)]/50"
    }`}
    style={{
      boxShadow: isActive ? "0 0 56px 0 rgba(118,112,250,0.13)" : undefined,
    }}
  >
    <div className="relative z-10 flex items-start gap-6">
      <div
        className={`p-4 rounded-2xl ${bg} ${color} transform transition-all duration-500 ${isActive ? "scale-110 rotate-3" : "group-hover:scale-110"}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--action-primary)] transition-colors">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  </motion.div>
);

export default Welcome;
