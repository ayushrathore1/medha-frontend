import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaBug, FaLightbulb, FaEnvelope, FaLinkedin, FaPaperPlane, FaCheckCircle, FaHistory, FaCrown, FaInbox, FaArrowRight } from "react-icons/fa";
import Card from "../components/Common/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Medha Updates - Changelog
const updates = [
  {
    version: "2.5.0",
    date: "December 2024",
    title: "AI-Powered Exam Solutions",
    features: [
      "🤖 'Medha, solve it' - AI generates exam-ready solutions",
      "🌐 Real-time web search for current topics",
      "📊 Enhanced markdown rendering with tables & math equations",
      "💬 Chat history with session management",
    ],
  },
  {
    version: "2.4.0",
    date: "December 2024",
    title: "RTU Exam Analysis",
    features: [
      "📝 Unit-wise weightage analysis for RTU papers",
      "🎯 Question bank with marks distribution",
      "📺 YouTube lecture links for each unit",
      "📈 Visualized progress bars",
    ],
  },
  {
    version: "2.3.0",
    date: "November 2024",
    title: "Enhanced Study Tools",
    features: [
      "🧠 AI Daily Coach with personalized study plans",
      "📚 Flashcard system with difficulty tracking",
      "✅ Topic-based review management",
      "🎯 Quiz generation from topics",
    ],
  },
  {
    version: "2.2.0",
    date: "November 2024",
    title: "Notes & OCR",
    features: [
      "📄 OCR-powered note extraction from images",
      "✏️ Rich text notes editor",
      "📁 Subject-wise organization",
      "🔍 Search across all notes",
    ],
  },
  {
    version: "2.0.0",
    date: "October 2024",
    title: "Medha AI Launch",
    features: [
      "🚀 Initial release of Medha AI",
      "💬 AI chatbot for study assistance",
      "📚 Syllabus integration for RTU",
      "👤 User profiles and authentication",
    ],
  },
];

const Updates = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "feedback",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);

  // Check if user is admin and fetch stats
  useEffect(() => {
    const checkAdminAndFetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.isAdmin) {
          setIsAdmin(true);
          // Fetch stats
          const statsRes = await axios.get(`${BACKEND_URL}/api/messages/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdminStats(statsRes.data.stats);
        }
      } catch (error) {
        console.error("Admin check error:", error);
      }
    };

    checkAdminAndFetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to send a message");
        setLoading(false);
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/messages`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(true);
      setFormData({ type: "feedback", subject: "", message: "", priority: "medium" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Admin Quick Access Panel */}
        {isAdmin && (
          <div 
            className="mb-8 p-4 rounded-2xl border-2"
            style={{ 
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))",
              borderColor: "rgba(245, 158, 11, 0.3)"
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FaCrown className="text-2xl text-amber-500" />
                <div>
                  <h3 className="text-lg font-bold text-amber-400">Admin Dashboard</h3>
                  <p className="text-sm text-amber-300/70">
                    {adminStats ? `${adminStats.unread} unread • ${adminStats.pending} pending` : "Loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {adminStats && (
                  <div className="flex gap-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      <FaInbox className="inline mr-1" /> {adminStats.total} total
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                      <FaBug className="inline mr-1" /> {adminStats.bugReports} bugs
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                      <FaLightbulb className="inline mr-1" /> {adminStats.featureRequests} ideas
                    </span>
                  </div>
                )}
                <button
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  Open Dashboard <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-4">
            Updates & Contact
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Stay updated with new features and share your thoughts with us
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Changelog */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
                <FaHistory className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                What's New in Medha
              </h2>
            </div>

            <div className="space-y-4">
              {updates.map((update, idx) => (
                <Card key={idx} className="relative overflow-hidden">
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      LATEST
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{ backgroundColor: "rgba(139, 92, 246, 0.2)", color: "#a78bfa" }}
                    >
                      v{update.version}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {update.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {update.title}
                  </h3>
                  <ul className="space-y-2">
                    {update.features.map((feature, fIdx) => (
                      <li 
                        key={fIdx} 
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Contact Us
              </h2>
            </div>

            <Card>
              {success ? (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Thank you for your feedback. We'll review it soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Message Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                      What's this about?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "feedback", label: "Feedback", icon: <FaEnvelope /> },
                        { value: "feature_request", label: "Feature Idea", icon: <FaLightbulb /> },
                        { value: "bug_report", label: "Bug Report", icon: <FaBug /> },
                        { value: "general", label: "General", icon: <FaRocket /> },
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                            formData.type === type.value 
                              ? "border-purple-500 bg-purple-500/20" 
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          <span className={formData.type === type.value ? "text-purple-400" : "text-gray-400"}>
                            {type.icon}
                          </span>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: formData.type === type.value ? "#a78bfa" : "var(--text-secondary)" }}
                          >
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief summary of your message"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ 
                        borderColor: "var(--accent-secondary)", 
                        color: "var(--text-primary)" 
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                      Your Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your feedback, feature idea, or bug..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      style={{ 
                        borderColor: "var(--accent-secondary)", 
                        color: "var(--text-primary)" 
                      }}
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                      Priority
                    </label>
                    <div className="flex gap-3">
                      {[
                        { value: "low", label: "Low", color: "bg-green-500" },
                        { value: "medium", label: "Medium", color: "bg-yellow-500" },
                        { value: "high", label: "High", color: "bg-red-500" },
                      ].map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: p.value })}
                          className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                            formData.priority === p.value 
                              ? "border-purple-500" 
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          style={{ color: "var(--text-primary)" }}
                        >
                          <span className={`w-2 h-2 rounded-full ${p.color}`}></span>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Connect Section */}
              <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col items-center">
                <p className="text-sm text-center mb-4" style={{ color: "var(--text-secondary)" }}>
                  Or connect with us directly
                </p>
                <a
                  href="https://www.linkedin.com/in/ayushrathore1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0077b5] text-white !text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#006097] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative z-10"
                  style={{ color: 'white' }}
                >
                  <FaLinkedin className="text-xl" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Updates;
