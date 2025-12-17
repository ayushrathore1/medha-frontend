import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaBell, FaCheck, FaCheckCircle, FaExclamationTriangle, 
  FaInfoCircle, FaHeart, FaRocket, FaEnvelope 
} from "react-icons/fa";
import Card from "../components/Common/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Original changelog data
const updates = [
  {
    version: "2.9.0",
    date: "December 2025",
    title: "Notes Sharing Platform",
    features: [
      "📤 Upload and share notes with the community",
      "📥 Download notes shared by other students",
      "🔍 Search notes by subject, topic, or keyword",
      "⭐ Rate and review shared notes",
      "📚 Subject-wise organization for easy browsing",
    ],
  },
  {
    version: "2.8.0",
    date: "December 2025",
    title: "Admin Dashboard & Email System",
    features: [
      "📧 AI-powered email composer for admin broadcasts",
      "📊 Email history tracking with re-send capability",
      "👥 User management with individual/bulk messaging",
      "🎨 Refreshed UI with light theme consistency",
      "🔒 Enhanced security with balanced rate limiting",
    ],
  },
  {
    version: "2.7.0",
    date: "December 2025",
    title: "RTU Exam Paper Analysis",
    features: [
      "📝 Digital Electronics 2024 & 2025 paper analysis",
      "📊 Unit-wise marks distribution with weightage %",
      "🎯 98 marks breakdown (including optional questions)",
      "📖 Complete documentation for adding new papers",
      "🧮 KaTeX math equation rendering in solutions",
    ],
  },
  {
    version: "2.6.0",
    date: "December 2025",
    title: "WhatsApp-Style Messaging",
    features: [
      "💬 Real-time chat with admin support",
      "📢 Broadcast announcements to all users",
      "🔔 Notification badges for new messages",
      "👥 Admin contact list & user management",
    ],
  },
  {
    version: "2.5.0",
    date: "December 2025",
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
    date: "December 2025",
    title: "RTU Exam Weightage",
    features: [
      "📝 Unit-wise weightage analysis for RTU papers",
      "🎯 Question bank with marks distribution",
      "📺 YouTube lecture links for each unit",
      "📈 Visualized progress bars",
    ],
  },
  {
    version: "2.3.0",
    date: "November 2025",
    title: "Enhanced Study Tools",
    features: [
      "🧠 AI Daily Coach with personalized study plans",
      "📚 Flashcard system with difficulty tracking",
      "✅ Topic-based review management",
      "🎯 Quiz generation from topics",
    ],
  },
  {
    version: "2.0.0",
    date: "October 2025",
    title: "Medha AI Launch",
    features: [
      "🚀 Initial release of Medha AI",
      "💬 AI chatbot for study assistance",
      "📚 Syllabus integration for RTU",
      "👤 User profiles and authentication",
    ],
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activity"); // "activity" | "changelog"
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id = "all") => {
    const token = localStorage.getItem("token");
    try {
      if (id === "all") {
        // Optimistic update
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        await axios.put(`${BACKEND_URL}/api/notifications/all/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
         const notif = notifications.find(n => n._id === id);
         if (notif && !notif.read) {
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            await axios.put(`${BACKEND_URL}/api/notifications/${id}/read`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
         }
      }
    } catch (err) {
      console.error("Error marking read");
    }
  };

  const getIconAndColor = (type) => {
    switch(type) {
      case "like": return { icon: <FaHeart />, color: "text-pink-500", bg: "bg-pink-100" };
      case "feature": return { icon: <FaRocket />, color: "text-purple-600", bg: "bg-purple-100" };
      case "success": return { icon: <FaCheckCircle />, color: "text-emerald-500", bg: "bg-emerald-100" };
      case "warning": return { icon: <FaExclamationTriangle />, color: "text-amber-500", bg: "bg-amber-100" };
      case "message": return { icon: <FaEnvelope />, color: "text-blue-500", bg: "bg-blue-100" };
      case "info": default: return { icon: <FaInfoCircle />, color: "text-indigo-500", bg: "bg-indigo-100" };
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 pb-12 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
            {activeTab === "activity" && notifications.length > 0 && unreadCount > 0 && (
              <button onClick={() => markRead("all")} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                 Mark all as read
              </button>
            )}
          </div>
          
          <div className="flex gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
             <button 
               onClick={() => setActiveTab("activity")}
               className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                 activeTab === "activity" 
                   ? "bg-slate-900 text-white shadow-lg" 
                   : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
               }`}
             >
               Activity
               {unreadCount > 0 && (
                 <span className="bg-red-500 text-white text-[10px] px-1.5 h-5 min-w-[20px] flex items-center justify-center rounded-full ml-1">
                   {unreadCount}
                 </span>
               )}
             </button>
             <button 
               onClick={() => setActiveTab("changelog")}
               className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                 activeTab === "changelog" 
                   ? "bg-slate-900 text-white shadow-lg" 
                   : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
               }`}
             >
               What's New
             </button>
          </div>
        </header>

        {activeTab === "activity" && (
           <div className="space-y-4">
             {loading ? (
                <div className="py-20 text-center text-slate-400">Loading...</div>
             ) : notifications.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                 <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                   <FaBell className="text-slate-300 text-2xl" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">All caught up!</h3>
                 <p className="text-slate-500 font-medium mt-1">No new notifications to show.</p>
               </div>
             ) : (
                <div className="space-y-3">
                  {notifications.map(n => {
                    const style = getIconAndColor(n.type);
                    return (
                      <div 
                        key={n._id} 
                        onClick={() => {
                          if (!n.read) markRead(n._id);
                          if (n.link) navigate(n.link);
                        }}
                        className={`group relative p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                          n.read ? "bg-white border-slate-200" : "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50"
                        }`}
                      >
                         {!n.read && (
                           <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-4 ring-white"></div>
                         )}
                         <div className="flex gap-4">
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg} ${style.color}`}>
                               {style.icon}
                            </div>
                            <div className="flex-1 pr-4">
                               <h4 className={`text-base ${n.read ? "font-bold text-slate-700" : "font-black text-slate-900"}`}>
                                 {n.title}
                               </h4>
                               <p className={`text-sm mt-1 leading-relaxed ${n.read ? "text-slate-500" : "text-slate-600 font-medium"}`}>
                                 {n.message}
                               </p>
                               <p className="text-xs font-bold text-slate-400 mt-3 flex items-center gap-1">
                                 {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </p>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
             )}
           </div>
        )}

        {activeTab === "changelog" && (
          <div className="space-y-6">
            {updates.map((update, idx) => (
              <Card key={idx} className="relative overflow-hidden border-slate-200/60 shadow-none hover:shadow-md transition-shadow">
                {idx === 0 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-bl-xl shadow-sm">
                    Latest Release
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 rounded-lg text-xs font-black tracking-wide"
                    style={{ backgroundColor: idx === 0 ? "rgba(79, 70, 229, 0.1)" : "rgba(241, 245, 249, 1)", color: idx === 0 ? "#4f46e5" : "#64748b" }}
                  >
                    v{update.version}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {update.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">
                  {update.title}
                </h3>
                <ul className="space-y-3">
                  {update.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-sm font-medium text-slate-600 flex items-start gap-3">
                      <div className="mt-0.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                        <FaCheck size={8} />
                      </div>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
