import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Zap, BookOpen, MessageSquare } from "lucide-react";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";

const Welcome = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
<<<<<<< HEAD
=======
    setIsVisible(true);
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
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
<<<<<<< HEAD
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background is handled by MainLayout usually, but for Welcome page we might want it explicit if it's outside MainLayout. 
          Assuming it's wrapped in MainLayout or we use the global background. 
          If this page is public and outside MainLayout, we might need to add the background here.
          For now, let's assume we want a clean look compatible with the new theme.
      */}
      
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
=======
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative font-inter">
      {/* Ambient glass blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-tr from-violet-400/24 to-blue-400/14 rounded-full blur-3xl opacity-25 animate-blob" />
        <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-gradient-to-br from-purple-400/24 to-fuchsia-400/13 rounded-full blur-2xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-44 left-60 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-blue-400/13 rounded-full blur-2xl opacity-22 animate-blob animation-delay-4000" />
        <style>{`
          @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.18) translate(30px,-50px);} 66% {transform: scale(0.90) translate(-20px,20px);} 100% {transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </div>
      <div className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-12 px-4 z-10">
        <div className="max-w-6xl w-full flex flex-col items-center">
          {/* Hero Image */}
          <div
            className={`relative mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{ willChange: "transform" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/18 to-purple-500/15 rounded-3xl blur-2xl pointer-events-none"></div>
              <div className="relative bg-[#18163a]/90 backdrop-blur-xl rounded-3xl p-8 border border-violet-400/20 shadow-2xl ring-2 ring-violet-400/10">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                <img
                  src="https://ik.imagekit.io/ayushrathore1/studyIllustration?updatedAt=1758344375764"
                  alt="Welcome illustration"
                  className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl"
                  draggable="false"
                />
              </Card>
              {/* Floating elements */}
<<<<<<< HEAD
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
=======
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full animate-ping shadow-lg"></div>
            </div>
          </div>
          {/* Hero Text */}
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[var(--action-primary)]/10 text-[var(--action-primary)] border border-[var(--action-primary)]/20 shadow-sm">
                🎓 Welcome to the Future of Learning
              </span>
            </div>
<<<<<<< HEAD
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-[var(--action-primary)] via-[var(--accent-indigo)] to-[var(--action-secondary)] bg-clip-text text-transparent mb-6 leading-tight select-none tracking-tight">
              MEDHA
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl font-medium text-[var(--text-secondary)] leading-relaxed mb-6">
=======
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight select-none">
              MEDHA
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl font-medium text-violet-200 leading-relaxed mb-4">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                Transform your learning experience with{" "}
                <span className="font-bold text-[var(--action-primary)]">
                  AI-powered note processing
                </span>
                , instant flashcard generation, intelligent quizzes, and your
                personal AI tutor.
              </p>
<<<<<<< HEAD
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
=======
              <p className="text-lg text-blue-200">
                <span className="font-semibold">Organized</span> •
                <span className="font-semibold mx-1 text-purple-400">
                  Efficient
                </span>
                •{" "}
                <span className="font-semibold text-emerald-300">
                  Intelligent
                </span>{" "}
                •
                <span className="font-semibold mx-1 text-orange-300">
                  Just for you!
                </span>
              </p>
            </div>
          </div>
          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-7 mb-16 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Link to="/register">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  🚀 Get Started Free
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link to="/login">
              <button className="group px-8 py-4 bg-[#18163a]/70 border border-violet-400/20 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:bg-[#18163a]/90 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <span className="flex items-center">
                  👋 Welcome Back
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
          {/* Features Grid */}
          <div
            className={`w-full max-w-6xl transition-all duration-1000 delay-600 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Why Students Love MEDHA
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                Experience the next generation of learning tools designed for
                modern students
              </p>
            </div>
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
=======
            <div className="grid grid-cols-1 md:grid-cols-2 gap-9 lg:gap-10">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  isActive={activeFeature === index}
                />
              ))}
            </div>
<<<<<<< HEAD
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
=======
          </div>
          {/* Stats */}
          <div
            className={`w-full max-w-4xl mt-20 transition-all duration-1000 delay-1000 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="bg-[#18163a]/80 backdrop-blur-lg rounded-3xl p-8 border border-violet-400/15 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <p className="text-blue-200 font-medium">Notes Processed</p>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    95%
                  </div>
                  <p className="text-blue-200 font-medium">Accuracy Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    24/7
                  </div>
                  <p className="text-blue-200 font-medium">AI Support</p>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
const FeatureCard = ({ icon, title, desc, color, bg, isActive }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 ${
      isActive
        ? "border-[var(--action-primary)] shadow-xl ring-1 ring-[var(--action-primary)]/20"
        : "border-white/40 shadow-lg hover:border-[var(--action-primary)]/50"
=======
const FeatureCard = ({ icon, title, desc, color, isActive }) => (
  <div
    className={`group relative bg-[#18163a]/80 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
      isActive
        ? "border-violet-400 scale-105 shadow-2xl bg-[#18163a]/95"
        : "border-violet-400/15 shadow-xl hover:border-violet-400/40"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
    }`}
    style={{
      boxShadow: isActive ? "0 0 56px 0 rgba(118,112,250,0.13)" : undefined,
    }}
  >
<<<<<<< HEAD
    <div className="relative z-10 flex items-start gap-6">
=======
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
    ></div>
    <div className="relative z-10">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
      <div
        className={`p-4 rounded-2xl ${bg} ${color} transform transition-all duration-500 ${isActive ? "scale-110 rotate-3" : "group-hover:scale-110"}`}
      >
        {icon}
      </div>
<<<<<<< HEAD
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
=======
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
        {title}
      </h3>
      <p className="text-blue-200 leading-relaxed group-hover:text-white transition-colors">
        {desc}
      </p>
      {isActive && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
      )}
    </div>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/18 to-purple-500/19 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </div>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
);

export default Welcome;
