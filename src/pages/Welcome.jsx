import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Zap, BookOpen, MessageSquare, Brain, Target, Users, Star, Rocket, Layers } from "lucide-react";
import { useTour } from "../context/TourContext";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Components (Assuming these exist based on context)
// If not, we can use simple HTML, but the original file imported them.
// Button and Card were imported but not heavily used in the main structure I wrote.

const Welcome = () => {
  const { startTour } = useTour();
  const [activeFeature, setActiveFeature] = useState(0);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/stats`);
        setUserCount(res.data.totalUsers);
      } catch (err) {
        console.error("Failed to fetch user stats");
      }
    };
    fetchUserCount();
  }, []);

  const features = [
    {
      icon: <Zap size={28} />,
      title: "AI Note Intelligence",
      desc: "Turn messy handwritten notes into structured summaries, flashcards, and quizzes in seconds.",
      color: "#f59e0b",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: <Brain size={28} />,
      title: "Smart Exam Prep",
      desc: "Custom quizzes and AI-generated exam strategies based on your specific university syllabus.",
      color: "#8b5cf6",
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      icon: <Layers size={28} />,
      title: "The Archive",
      desc: "Access years of past papers, unit-wise weightage, and solved answers. (Starting with RTU, scaling globally).",
      color: "#10b981",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "24/7 AI Tutor",
      desc: "Stuck at 2 AM? Get instant, accurate explanations for any concept from your own notes.",
      color: "#3b82f6",
      gradient: "from-blue-400 to-cyan-500",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CSE, 3rd Semester",
      text: "MEDHA completely changed how I prepare for exams. The PYQ analysis and AI solutions saved me during my midsems!",
      avatar: "PS",
      rating: 5,
      uni: "RTU"
    },
    {
      name: "Rohan Verma",
      role: "AIDS, 3rd Semester",
      text: "The AI tutor explains DSA concepts better than YouTube tutorials. I finally understood recursion thanks to MEDHA!",
      avatar: "RV",
      rating: 5,
      uni: "RTU"
    },
    {
      name: "Ananya Singh",
      role: "CSE, 5th Semester",
      text: "Unit-wise weightage analysis is a game changer. I know exactly what topics to focus on. My grades have improved so much!",
      avatar: "AS",
      rating: 5,
      uni: "RTU"
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/50"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-8"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span className="text-sm font-bold text-indigo-900 tracking-wide uppercase">The Future of Exam Prep</span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-gray-900">
                Conquer <br className="hidden lg:block"/>
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  The Chaos.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Stop drowning in notes. MEDHA turns your scattered study materials into <span className="text-indigo-600 font-bold">interactive intelligence</span>. 
                Flashcards, quizzes, and exam strategies—generated instantly by AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                <Link to="/register">
                  <motion.button
                    data-tour="hero-section"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white font-bold text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-black transition-all group"
                  >
                    Start Learning Free
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-5 bg-white/60 backdrop-blur-md text-gray-800 font-bold text-lg rounded-2xl border border-gray-200 shadow-lg flex items-center justify-center gap-3 hover:border-gray-300 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-gray-500">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p>Trusted by {userCount ? `${userCount.toLocaleString()}+` : '...'} students</p>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 relative w-full"
            >
              <div className="relative z-10 perspective-1000">
                <motion.div
                  animate={{ y: [0, -15, 0], rotateX: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-2 overflow-hidden"
                >
                  <img
                    src="https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss" 
                    alt="MEDHA Interface"
                    className="w-full h-auto rounded-[1.5rem]"
                  />
                  
                  {/* Floating UI Elements */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                    className="absolute -right-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 max-w-[200px]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={16}/></div>
                       <div className="text-xs font-bold text-gray-800">Exam Ready!</div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[95%]"></div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute -left-6 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
                  >
                     <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Brain size={20}/></div>
                     <div>
                       <div className="text-xs text-gray-500">AI Tutor</div>
                       <div className="text-sm font-bold">Concept Cleared</div>
                     </div>
                  </motion.div>

                </motion.div>
                
                {/* Glow behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[100px] -z-10 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              Is This Your <span className="text-gray-600 decoration-4 underline decoration-red-400/50">Reality?</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">We know the struggle because we are students too.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "The Note Chaos", emoji: "🤯", desc: "Hundreds of PDFs, scattered handwritten pages, and zero organization. Finding that one topic takes hours." },
              { title: "Exam Anxiety", emoji: "😰", desc: "The syllabus is huge, time is short, and you have no idea what's actually important for the exam." },
              { title: "Passive Reading", emoji: "😴", desc: "Reading the same page 10 times but remembering nothing. Study burnout hits different at 3 AM." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100 hover:border-red-200 transition-colors"
              >
                <div className="text-6xl mb-6">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block p-1 rounded-full bg-gray-100">
               <ArrowRight className="rotate-90 text-gray-400 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-24 px-4 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ color: 'white' }}>
                <span className="text-gray-100">Enter the </span>
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">MEDHA Era.</span>
              </h2>
              <p className="text-xl text-gray-300">
                A complete ecosystem designed to replace the chaos with clarity. 
                One platform for your entire academic life.
              </p>
            </div>
            <Link to="/register">
              <button className="hidden md:flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-500/30">
                Get Started Now <ArrowRight size={20}/>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 hover:border-gray-500 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white" style={{ color: 'white' }}>{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-32 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto space-y-32">
          
          <FeatureShowcase 
            title="Your Syllabus, Decoded."
            subtitle="INTELLIGENT DASHBOARD"
            desc="Imagine a dashboard that knows your exam dates, tracks your study streaks, and tells you exactly what to study today. It's not magic, it's MEDHA."
            image="https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss"
            tags={["Progress Tracking", "Study Streaks", "Daily Goals"]}
            align="right"
          />

          <FeatureShowcase 
            title="The Ultimate Exam Archive."
            subtitle="UNIVERSITY INTEL"
            desc="Stop begging seniors for past papers. Access unit-wise weightage, solved PYQs, and marks distribution. Starting with RTU, but we’re expanding to universities worldwide."
            image="https://ik.imagekit.io/ayushrathore1/Medha/rtuExams_ss.png"
            tags={["Solved Papers", "Mark Distribution", "Unit Analysis"]}
            align="left"
          />

          <FeatureShowcase 
            title="Conversations with Your Notes."
            subtitle="AI CHATBOT"
            desc="Upload your handwritten notes and just ask: 'Explain the second law of thermodynamics from page 4.' Receive instant, context-aware answers. It's like your professor is on speed dial."
            image="https://ik.imagekit.io/ayushrathore1/Medha/chatbot_ss.png"
            tags={["Context Aware", "OCR Technology", "Instant Answers"]}
            align="right"
          />

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">Student Stories</h2>
            <p className="text-gray-500 mt-4">Real results from real campuses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative"
              >
                <div className="absolute top-8 right-8 text-indigo-100"><MessageSquare size={40}/></div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#FBBF24" className="text-amber-400"/>)}
                </div>
                <p className="text-gray-700 font-medium leading-relaxed mb-6 relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs font-bold text-indigo-600">{t.uni} • {t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/30 blur-[120px] rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8" style={{ color: 'white' }}>
              Your GPA is Waiting.
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join the platform that turns study stress into academic success. 
              The future of learning is here, and it's free.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white text-gray-900 font-bold text-xl rounded-2xl shadow-2xl hover:bg-gray-100 transition-colors inline-flex items-center gap-3"
              >
                Start Your Journey <Rocket size={24} className="text-indigo-600"/>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="py-12 text-center text-gray-400 text-sm bg-white">
        <p>© {new Date().getFullYear()} MEDHA AI. Crafted for students, by students.</p>
      </footer>
    </div>
  );
};

const FeatureShowcase = ({ title, subtitle, desc, image, tags, align }) => (
  <div className={`flex flex-col ${align === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
    <div className="flex-1 w-full relative group perspective-1000">
       <div className={`absolute -inset-4 bg-gradient-to-r ${align === 'right' ? 'from-indigo-100 to-purple-100' : 'from-emerald-100 to-teal-100'} rounded-[2rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500`}></div>
       <img 
        src={image} 
        alt={title} 
        className="relative w-full rounded-2xl shadow-2xl border border-gray-200 transform group-hover:scale-[1.02] transition-transform duration-500"
       />
    </div>
    <div className="flex-1 text-center lg:text-left">
      <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-4 block">{subtitle}</span>
      <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{title}</h3>
      <p className="text-xl text-gray-600 leading-relaxed mb-8">{desc}</p>
      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
        {tags.map((tag, i) => (
          <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm border border-gray-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default Welcome;
