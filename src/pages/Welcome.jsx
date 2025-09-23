import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate features every 3 seconds
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI Note Reader",
      desc: "Upload handwritten notes, get smart MCQs and flashcards instantly.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🧠",
      title: "Practice & Quiz",
      desc: "Revise with flashcards, take quizzes, and track your progress.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "📚",
      title: "Subject Organization",
      desc: "Keep notes, quizzes, and flashcards grouped by subject.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "💬",
      title: "Instant Chatbot",
      desc: "Ask your doubts and get instant explanations from your notes!",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl w-full flex flex-col items-center">
          {/* Hero Image */}
          <div
            className={`relative mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-2xl">
                <img
                  src="https://ik.imagekit.io/ayushrathore1/studyIllustration?updatedAt=1758344375764"
                  alt="Welcome illustration"
                  className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl"
                  draggable="false"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-400 rounded-full animate-ping shadow-lg"></div>
            </div>
          </div>

          {/* Hero Text */}
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/50 shadow-sm">
                🎓 Welcome to the Future of Learning
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              MEDHA
            </h1>

            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-4">
                Transform your learning experience with{" "}
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-powered note processing
                </span>
                , instant flashcard generation, intelligent quizzes, and your
                personal AI tutor.
              </p>
              <p className="text-lg text-slate-600">
                <span className="font-semibold text-blue-600">Organized</span> •{" "}
                <span className="font-semibold text-purple-600">Efficient</span>{" "}
                •{" "}
                <span className="font-semibold text-green-600">
                  Intelligent
                </span>{" "}
                •{" "}
                <span className="font-semibold text-orange-600">
                  Just for you!
                </span>
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 mb-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link to="/register">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 overflow-hidden">
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
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
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

          {/* Enhanced Features Grid */}
          <div
            className={`w-full max-w-6xl transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Why Students Love MEDHA
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Experience the next generation of learning tools designed
                specifically for modern students
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
          </div>

          {/* Stats Section */}
          <div
            className={`w-full max-w-4xl mt-20 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <p className="text-slate-600 font-medium">Notes Processed</p>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    95%
                  </div>
                  <p className="text-slate-600 font-medium">Accuracy Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    24/7
                  </div>
                  <p className="text-slate-600 font-medium">AI Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color, isActive }) => (
  <div
    className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
      isActive
        ? "border-blue-300 shadow-2xl scale-105 bg-white/90"
        : "border-white/50 shadow-xl hover:border-blue-200"
    }`}
  >
    {/* Background gradient on hover */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
    ></div>

    <div className="relative z-10">
      {/* Icon */}
      <div
        className={`text-5xl mb-6 transform transition-all duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
        {desc}
      </p>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </div>

    {/* Hover effect border */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </div>
);

export default Welcome;
