import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaInbox, FaEnvelopeOpen, FaBug, FaLightbulb, FaCheckCircle, 
  FaClock, FaSpinner, FaTrash, FaTimes, 
  FaFilter, FaSync, FaPaperPlane, FaUser, FaSortAlphaDown, FaCalendarAlt, FaSearch, FaMagic, FaEye
} from "react-icons/fa";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Global Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages"); // 'messages' or 'email'

  // Messages State
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState({ status: "", type: "", isRead: "" });
  
  // Email System State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [emailMode, setEmailMode] = useState("individual"); // 'all', 'individual', or 'unverified'
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("newest"); // 'name' or 'newest'
  const [universityFilter, setUniversityFilter] = useState(""); // University filter
  const [verificationFilter, setVerificationFilter] = useState(""); // 'verified', 'unverified', ''
  
  // AI Generator State
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Email History State
  const [emailHistory, setEmailHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null); // For viewing recipients

  // Password Reset State
  const [resettingPassword, setResettingPassword] = useState(null); // email of user being reset

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, { headers });
      if (!res.data.isAdmin) {
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      fetchMessages();
      fetchStats();
      // We'll fetch users only when Email tab is active or pre-fetch now
      fetchStats();
      // We'll fetch users only when Email tab is active or pre-fetch now
      fetchUsers();
      fetchEmailHistory();
    } catch (error) {
      navigate("/dashboard");
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAI(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/generate-email`, { prompt: aiPrompt }, { headers });
      
      // Update both subject and body
      if (res.data.subject) setEmailSubject(res.data.subject);
      if (res.data.html) setEmailBody(res.data.html);
      
      setAiPrompt(""); // Clear prompt after success
    } catch (error) {
      console.error("Error generating with AI:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // ==================== MESSAGES LOGIC ====================
  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.type) params.append("type", filter.type);
      if (filter.isRead) params.append("isRead", filter.isRead);

      const res = await axios.get(`${BACKEND_URL}/api/messages/admin/all?${params}`, { headers });
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/messages/admin/stats`, { headers });
      setStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/messages/admin/${id}/read`, {}, { headers });
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/messages/admin/${id}/status`, { status }, { headers });
      fetchMessages();
      fetchStats();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/messages/admin/${id}`, { headers });
      fetchMessages();
      fetchStats();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "bug_report": return <FaBug className="text-red-500" />;
      case "feature_request": return <FaLightbulb className="text-yellow-500" />;
      case "feedback": return <FaEnvelopeOpen className="text-blue-500" />;
      default: return <FaInbox className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      in_progress: "bg-blue-500/20 text-blue-400",
      resolved: "bg-green-500/20 text-green-400",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-500/20 text-gray-400"}`}>
        {(status || "").replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return <span className={`w-2 h-2 rounded-full ${styles[priority] || "bg-gray-500"}`}></span>;
  };

  // ==================== EMAIL SYSTEM LOGIC ====================
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/users`, { headers });
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSendEmail = async () => {
    // Guard against double submissions
    if (sendingEmail) return;
    
    if (!emailSubject || !emailBody) {
      alert("Please provide both subject and body.");
      return;
    }
    if (emailMode === "individual" && !selectedUser) {
      alert("Please select a user to send the email to.");
      return;
    }
    
    // Different confirmation messages based on mode
    const recipientText = emailMode === "all" 
      ? `ALL USERS (${users.length})` 
      : emailMode === "unverified"
        ? `UNVERIFIED USERS (${getVerificationStats().unverified})`
        : selectedUser?.email;
    
    if (!window.confirm(`Are you sure you want to send this email to ${recipientText}?`)) {
      return;
    }

    // Set sending state AFTER confirm but before API call
    setSendingEmail(true);
    try {
      await axios.post(`${BACKEND_URL}/api/admin/send-email`, {
        mode: emailMode,
        targetUserId: selectedUser?._id,
        subject: emailSubject,
        htmlBody: emailBody
      }, { headers });

      alert("Email(s) sent successfully!");
      setEmailSubject("");
      setEmailBody("");
      // Refresh history after sending
      fetchEmailHistory();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Check console for details.");
    } finally {
      setSendingEmail(false);
    }
  };

  const getFilteredUsers = () => {
    let result = [...users];
    
    // Search
    if (userSearch) {
      const lowerQ = userSearch.toLowerCase();
      result = result.filter(u => 
        (u.name && u.name.toLowerCase().includes(lowerQ)) || 
        (u.email && u.email.toLowerCase().includes(lowerQ))
      );
    }

    // University Filter
    if (universityFilter) {
      result = result.filter(u => u.university === universityFilter);
    }

    // Verification Filter
    if (verificationFilter === "verified") {
      result = result.filter(u => u.emailVerified === true);
    } else if (verificationFilter === "unverified") {
      result = result.filter(u => !u.emailVerified);
    }

    // Sort
    if (userSort === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  };

  // Get unique universities from users
  const getUniqueUniversities = () => {
    const universities = [...new Set(users.map(u => u.university).filter(Boolean))];
    return universities.sort();
  };

  // Get verification stats
  const getVerificationStats = () => {
    const verified = users.filter(u => u.emailVerified === true).length;
    const unverified = users.filter(u => !u.emailVerified).length;
    return { verified, unverified, total: users.length };
  };

  // Default email template for non-verified users
  const loadVerificationReminderTemplate = () => {
    setEmailSubject("Complete Your MEDHA Account Verification 🔐");
    setEmailBody(`<div style="font-family: 'Inter', Arial, sans-serif; background: #f8fafc; padding: 32px 24px; text-align: center;">
  <div style="background: #fff; border-radius: 16px; max-width: 500px; margin: auto; padding: 40px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="font-size: 48px; margin-bottom: 16px;">📧</div>
    <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px;">Complete Your Verification</h2>
    <p style="color: #4F46E5; font-size: 14px; margin: 0 0 24px 0; font-weight: 600;">MEDHA - Your AI Study Companion</p>
    
    <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
      Hey <b>{{name}}</b>! 👋<br><br>
      We noticed your MEDHA account isn't verified yet. Verify your email to unlock all features and keep your account secure!
    </p>
    
    <a href="https://medharevisionapp.pages.dev/verify-email" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
      Verify My Email →
    </a>
    
    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
      If you're having trouble, just reply to this email.<br>
      We're always here to help! 💜
    </p>
    
    <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Team MEDHA 🎓</p>
  </div>
</div>`);
    setEmailMode("unverified");
  };

  const fetchEmailHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/history`, { headers });
      setEmailHistory(res.data || []);
    } catch (error) {
      console.error("Error fetching email history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Check if a user has already received the current email being composed
  const hasUserReceivedCurrentEmail = (userEmail) => {
    if (!emailSubject || !emailBody || !userEmail) return false;
    
    // Find matching email in history by subject and body
    const matchingLog = emailHistory.find(
      log => log.subject === emailSubject && log.htmlBody === emailBody
    );
    
    if (!matchingLog || !matchingLog.recipients) return false;
    
    return matchingLog.recipients.includes(userEmail.toLowerCase());
  };

  // Handle password reset for a user (admin only)
  const handlePasswordReset = async (email, userName) => {
    if (!window.confirm(`Send password reset link to ${userName} (${email})?`)) return;
    
    setResettingPassword(email);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/admin/trigger-reset`, { email }, { headers });
      alert(`✅ ${res.data.message}`);
    } catch (error) {
      console.error("Error sending reset:", error);
      alert(`❌ Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setResettingPassword(null);
    }
  };

  // ==================== RENDER ====================

  if (loading) return <Loader fullScreen />;
  if (!isAdmin) return null;

  return (
    <div 
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Tabs */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage everything from here
            </p>
          </div>
          
          <div className="flex gap-2">
             <button 
               onClick={() => setActiveTab("messages")}
               className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === 'messages' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'}`}
             >
               Messages & Feedback
             </button>
             <button 
               onClick={() => setActiveTab("email")}
               className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === 'email' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'}`}
             >
               Email Console
             </button>
             <button 
               onClick={() => setActiveTab("history")}
               className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === 'history' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'}`}
             >
               <FaClock className="inline mr-2"/> History
             </button>
          </div>
        </header>

        {/* ======================= MESSAGES TAB ======================= */}
        {activeTab === "messages" && (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {/* ... (existing stats cards are fine, commonly white cards) ... */}
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
                  <div className="text-sm text-gray-500" style={{ color: "var(--text-secondary)" }}>Total</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-600">{stats.unread}</div>
                  <div className="text-sm text-gray-500" style={{ color: "var(--text-secondary)" }}>Unread</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-500" style={{ color: "var(--text-secondary)" }}>Pending</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-orange-600">{stats.featureRequests}</div>
                  <div className="text-sm text-gray-500" style={{ color: "var(--text-secondary)" }}>Features</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-red-600">{stats.bugReports}</div>
                  <div className="text-sm text-gray-500" style={{ color: "var(--text-secondary)" }}>Bugs</div>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Card className="mb-6 p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <FaFilter style={{ color: "var(--text-secondary)" }} />
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-bg-primary border outline-none focus:ring-1 focus:ring-purple-500"
                  style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)" }}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-bg-primary border outline-none focus:ring-1 focus:ring-purple-500"
                  style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)" }}
                >
                  <option value="">All Types</option>
                  <option value="feedback">Feedback</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="general">General</option>
                </select>
                <select
                  value={filter.isRead}
                  onChange={(e) => setFilter({ ...filter, isRead: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-bg-primary border outline-none focus:ring-1 focus:ring-purple-500"
                  style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)" }}
                >
                  <option value="">All</option>
                  <option value="false">Unread</option>
                  <option value="true">Read</option>
                </select>
                <button
                  onClick={fetchMessages}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm"
                >
                  <FaSync /> Refresh
                </button>
              </div>
            </Card>

            {/* Messages List */}
            <div className="space-y-3">
              {messages.length === 0 ? (
                <Card className="text-center py-12">
                  <FaInbox className="text-5xl mx-auto mb-4 opacity-50 text-gray-300" />
                  <p style={{ color: "var(--text-secondary)" }}>No messages found</p>
                </Card>
              ) : (
                messages.map((msg) => (
                  <Card 
                    key={msg._id}
                    className={`cursor-pointer transition-all hover:shadow-md border ${!msg.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'border-gray-100'}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.isRead) markAsRead(msg._id);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* ... (content same) ... */}
                      <div className="text-2xl">{getTypeIcon(msg.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                            {msg.userName}
                          </span>
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            ({msg.userEmail})
                          </span>
                          {getPriorityBadge(msg.priority)}
                        </div>
                        <h3 className="font-semibold mb-1 truncate" style={{ color: "var(--text-primary)" }}>
                          {msg.subject}
                        </h3>
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                          {msg.message}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {getStatusBadge(msg.status)}
                        <div className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* ======================= EMAIL CONSOLE TAB ======================= */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
            
            {/* Left Col: User List */}
            <Card className="lg:col-span-1 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <FaUser className="text-indigo-600" /> Users ({getFilteredUsers().length}/{users.length})
                </h2>
                
                {/* Verification Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-green-50 rounded-lg p-2 text-center border border-green-100">
                    <div className="text-lg font-bold text-green-600">{getVerificationStats().verified}</div>
                    <div className="text-xs text-green-700">Verified</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                    <div className="text-lg font-bold text-red-600">{getVerificationStats().unverified}</div>
                    <div className="text-xs text-red-700">Unverified</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-100">
                    <div className="text-lg font-bold text-purple-600">{getVerificationStats().total}</div>
                    <div className="text-xs text-purple-700">Total</div>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative mb-3">
                   <FaSearch className="absolute left-3 top-3 text-gray-400" />
                   <input 
                     type="text"
                     placeholder="Search name or email..."
                     value={userSearch}
                     onChange={(e) => setUserSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                   />
                </div>

                {/* University Filter */}
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 bg-gray-50 focus:outline-none focus:border-purple-500 text-sm"
                >
                  <option value="">All Universities</option>
                  {getUniqueUniversities().map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>

                {/* Verification Filter */}
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 bg-gray-50 focus:outline-none focus:border-purple-500 text-sm"
                >
                  <option value="">All Verification Status</option>
                  <option value="verified">✅ Verified Only</option>
                  <option value="unverified">❌ Unverified Only</option>
                </select>

                {/* Sort Toggle */}
                <div className="flex gap-2">
                   <button 
                     onClick={() => setUserSort("name")}
                     className={`flex-1 py-1 text-sm rounded border transition-colors ${userSort === 'name' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                   >
                     <FaSortAlphaDown className="inline mr-1" /> Name
                   </button>
                   <button 
                     onClick={() => setUserSort("newest")}
                     className={`flex-1 py-1 text-sm rounded border transition-colors ${userSort === 'newest' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                   >
                     <FaCalendarAlt className="inline mr-1" /> Newest
                   </button>
                </div>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                 {loadingUsers ? (
                   <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-2xl text-purple-500" /></div>
                 ) : (
                   getFilteredUsers().map(user => {
                     const alreadyReceived = hasUserReceivedCurrentEmail(user.email);
                     return (
                       <div 
                         key={user._id}
                         onClick={() => {
                           setEmailMode("individual");
                           setSelectedUser(user);
                         }}
                         className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedUser?._id === user._id && emailMode === "individual" ? "bg-white border-purple-500 shadow-sm ring-1 ring-purple-500" : alreadyReceived ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm"}`}
                       >
                         <div className="flex items-center justify-between gap-2">
                           <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{user.name}</div>
                           <div className="flex items-center gap-1 flex-shrink-0">
                             {alreadyReceived && (
                               <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">✓ Sent</span>
                             )}
                             {user.emailVerified ? (
                               <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Verified</span>
                             ) : (
                               <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Unverified</span>
                             )}
                           </div>
                         </div>
                          <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{user.email}</div>
                          <div className="flex items-center justify-between mt-1">
                            {user.university && (
                              <div className="text-xs text-purple-600 font-medium">{user.university}</div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePasswordReset(user.email, user.name);
                              }}
                              disabled={resettingPassword === user.email}
                              className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                              title="Send password reset link"
                            >
                              {resettingPassword === user.email ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                "🔑"
                              )}
                              Reset
                            </button>
                          </div>
                        </div>
                     );
                   })
                 )}
              </div>
            </Card>

            {/* Right Col: Compose */}
            <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden">
               <div className="p-4 border-b border-gray-200 bg-gray-50/80">
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-800">
                     <FaPaperPlane className="text-indigo-600" /> Compose Email
                  </h2>
                  
                  {/* Mode Toggle */}
                  <div className="flex flex-wrap gap-4 mb-4">
                     <label className="flex items-center cursor-pointer gap-2">
                       <input 
                         type="radio" 
                         name="mode" 
                         checked={emailMode === "individual"} 
                         onChange={() => setEmailMode("individual")}
                         className="accent-purple-600 w-4 h-4"
                       />
                       <span className="text-gray-700 font-medium">Single User</span>
                     </label>
                     <label className="flex items-center cursor-pointer gap-2">
                       <input 
                         type="radio" 
                         name="mode" 
                         checked={emailMode === "all"} 
                         onChange={() => setEmailMode("all")}
                         className="accent-purple-600 w-4 h-4"
                       />
                       <span className="text-gray-700 font-medium">All Users</span>
                     </label>
                     <label className="flex items-center cursor-pointer gap-2">
                       <input 
                         type="radio" 
                         name="mode" 
                         checked={emailMode === "unverified"} 
                         onChange={() => setEmailMode("unverified")}
                         className="accent-red-600 w-4 h-4"
                       />
                       <span className="text-red-600 font-medium">❌ Unverified Only ({getVerificationStats().unverified})</span>
                     </label>
                  </div>

                  {/* Quick Template Button for Unverified */}
                  {emailMode === "unverified" && (
                    <button
                      onClick={loadVerificationReminderTemplate}
                      className="mb-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium border border-red-200 transition-colors"
                    >
                      📧 Load Verification Reminder Template
                    </button>
                  )}

                  {/* Recipient Display */}
                  <div className="mb-4">
                     <span className="text-gray-500 font-medium mr-2">To:</span>
                     {emailMode === "all" ? (
                       <span className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded text-sm font-bold">ALL USERS ({users.length})</span>
                     ) : emailMode === "unverified" ? (
                       <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded text-sm font-bold">UNVERIFIED USERS ({getVerificationStats().unverified})</span>
                     ) : (
                       selectedUser ? (
                         <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded text-sm font-bold">{selectedUser.name} &lt;{selectedUser.email}&gt;</span>
                       ) : (
                         <span className="text-red-500 italic text-sm">Please select a user from the list</span>
                       )
                     )}
                  </div>

                     {/* Subject Input */}
                     <input 
                       type="text" 
                       placeholder="Subject..."
                       value={emailSubject}
                       onChange={(e) => setEmailSubject(e.target.value)}
                       className="w-full text-lg p-3 rounded border-none focus:ring-1 focus:ring-purple-500 mb-0 font-medium"
                       style={{
                         backgroundColor: "var(--bg-secondary)", 
                         color: "var(--text-primary)",
                         boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
                       }}
                     />
                  </div>
 
                  {/* AI Generator & Body Input */}
                  <div 
                    className="flex-1 flex flex-col p-0 overflow-hidden"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    
                    {/* AI Prompt Bar */}
                    <div className="p-3 flex gap-2 items-center border-b border-gray-200">
                       <FaMagic className="text-yellow-500" />
                       <input 
                         type="text" 
                         placeholder="Ask AI to write this email (e.g., 'Announce the new Chatbot feature')..."
                         value={aiPrompt}
                         onChange={(e) => setAiPrompt(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                         className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                         style={{ color: "var(--text-primary)" }}
                       />
                       <button 
                         onClick={handleGenerateAI}
                         disabled={generatingAI || !aiPrompt}
                         className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold text-white uppercase tracking-wider transition-colors disabled:opacity-50"
                       >
                         {generatingAI ? <FaSpinner className="animate-spin" /> : "Generate"}
                       </button>
                    </div>
 
                     <textarea 
                       value={emailBody}
                       onChange={(e) => setEmailBody(e.target.value)}
                       placeholder="Paste your HTML email content here or ask AI to generate it..."
                       className="w-full flex-1 p-4 bg-transparent border-none resize-none focus:outline-none font-mono text-sm"
                       style={{ color: "var(--text-primary)" }}
                     />
                  </div>
 
                  {/* Footer Action */}
                  <div className="p-4 border-t border-gray-200 flex justify-end items-center gap-3" style={{ backgroundColor: "var(--bg-secondary)" }}>
                     <div className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
                        {emailMode === "all" ? "Note: Massive bulk operations may take time." : "Preview before sending."}
                     </div>
                     
                     <button 
                       onClick={() => setShowPreview(true)}
                       disabled={!emailBody}
                       className="px-4 py-2 rounded-lg font-bold hover:shadow transition-colors disabled:opacity-50 flex items-center gap-2 border"
                       style={{ 
                         backgroundColor: "var(--bg-primary)", 
                         color: "var(--text-primary)", 
                         borderColor: "var(--accent-secondary)"
                       }}
                     >
                        <FaEye /> Preview
                     </button>
                     
                     <button 
                       onClick={handleSendEmail}
                       disabled={sendingEmail || (emailMode === "individual" && !selectedUser) || !emailSubject}
                       className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        {sendingEmail ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                        {sendingEmail ? "Sending..." : "Send Email"}
                     </button>
                  </div>
               </Card>
             </div>
           )}
 
       </div>

       {/* ======================= HISTORY TAB ======================= */}
       {activeTab === "history" && (
         <Card className="overflow-hidden">
           <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <FaClock className="text-purple-600" /> Sent Email History
             </h2>
             <button 
               onClick={fetchEmailHistory}
               className="p-2 hover:bg-gray-200 rounded-full transition-colors"
               title="Refresh History"
             >
               <FaSync className={loadingHistory ? "animate-spin text-purple-600" : "text-gray-500"} />
             </button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-100/50 text-gray-500 text-xs uppercase tracking-wider">
                   <th className="p-4 font-semibold">Subject</th>
                   <th className="p-4 font-semibold text-center">Times Sent</th>
                   <th className="p-4 font-semibold text-center">Recipients</th>
                   <th className="p-4 font-semibold text-right">Last Sent</th>
                   <th className="p-4 font-semibold text-center">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {loadingHistory ? (
                   <tr>
                     <td colSpan="5" className="p-8 text-center text-gray-500">
                       <FaSpinner className="animate-spin inline text-2xl" /> Loading history...
                     </td>
                   </tr>
                 ) : emailHistory.length === 0 ? (
                   <tr>
                     <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                       No email history found. Start sending emails to see logs here.
                     </td>
                   </tr>
                 ) : (
                   emailHistory.map((log) => (
                     <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>
                         {log.subject}
                       </td>
                       <td className="p-4 text-center">
                         <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                           {log.sentCount}
                         </span>
                       </td>
                       <td className="p-4 text-center">
                         <button
                           onClick={() => setSelectedHistoryItem(log)}
                           className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
                           title="Click to view recipients"
                         >
                           {log.recipients?.length || log.totalRecipients || 0} 📧
                         </button>
                       </td>
                       <td className="p-4 text-right text-sm text-gray-500">
                         {new Date(log.lastSentAt).toLocaleString()}
                       </td>
                       <td className="p-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => {
                               setEmailSubject(log.subject);
                               setEmailBody(log.htmlBody); // Load into state
                               setEmailMode("all"); // Default to dummy mode for preview
                               setShowPreview(true);
                             }}
                             className="text-purple-600 hover:text-purple-800 text-sm font-bold flex items-center gap-1"
                             title="Preview content"
                           >
                             <FaEye /> View
                           </button>
                           <button 
                             onClick={() => {
                               setEmailSubject(log.subject);
                               setEmailBody(log.htmlBody);
                               setActiveTab("email"); // Switch to Compose tab
                               // Optional: specific mode setting if desired, currently stays as is or user sets it
                             }}
                             className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
                             title="Load this template to Composer"
                           >
                             <FaPaperPlane className="transform rotate-12" /> Use
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         </Card>
       )}

       {/* Recipients Modal */}
       {selectedHistoryItem && (
         <div 
           className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
           onClick={() => setSelectedHistoryItem(null)}
         >
           <div 
             className="max-w-2xl w-full max-h-[80vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Modal Header */}
             <div className="p-4 border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white">
               <div className="flex justify-between items-center">
                 <div>
                   <span className="text-xs font-bold uppercase tracking-widest opacity-80">Email Recipients</span>
                   <h3 className="text-lg font-bold truncate max-w-md">
                      {selectedHistoryItem.subject}
                   </h3>
                 </div>
                 <button 
                   onClick={() => setSelectedHistoryItem(null)}
                   className="p-2 hover:bg-white/20 rounded-full transition-colors"
                 >
                   <FaTimes />
                 </button>
               </div>
             </div>
             
             {/* Stats Row */}
             <div className="p-4 bg-gray-50 border-b flex gap-4">
               <div className="flex-1 text-center">
                 <div className="text-2xl font-bold text-green-600">{selectedHistoryItem.recipients?.length || 0}</div>
                 <div className="text-xs text-gray-500">Delivered</div>
               </div>
               <div className="flex-1 text-center">
                 <div className="text-2xl font-bold text-gray-600">{users.length - (selectedHistoryItem.recipients?.length || 0)}</div>
                 <div className="text-xs text-gray-500">Not Received</div>
               </div>
               <div className="flex-1 text-center">
                 <div className="text-2xl font-bold text-purple-600">{users.length}</div>
                 <div className="text-xs text-gray-500">Total Users</div>
               </div>
             </div>
             
             {/* Recipients List */}
             <div className="flex-1 overflow-y-auto p-4">
               {selectedHistoryItem.recipients && selectedHistoryItem.recipients.length > 0 ? (
                 <>
                   <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                     <FaCheckCircle /> Received ({selectedHistoryItem.recipients.length})
                   </h4>
                   <div className="space-y-2 mb-6">
                     {selectedHistoryItem.recipients.map((email, idx) => {
                       const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
                       return (
                         <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-100">
                           <FaCheckCircle className="text-green-500 flex-shrink-0" />
                           <div className="flex-1 min-w-0">
                             <div className="font-medium text-sm truncate text-gray-800">{user?.name || 'Unknown'}</div>
                             <div className="text-xs truncate text-gray-500">{email}</div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                   
                   {/* Users who didn't receive */}
                   <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                     <FaTimes /> Not Received ({users.filter(u => !selectedHistoryItem.recipients.includes(u.email?.toLowerCase())).length})
                   </h4>
                   <div className="space-y-2">
                     {users
                       .filter(u => !selectedHistoryItem.recipients.includes(u.email?.toLowerCase()))
                       .map(user => (
                         <div key={user._id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100">
                           <FaTimes className="text-red-400 flex-shrink-0" />
                           <div className="flex-1 min-w-0">
                             <div className="font-medium text-sm truncate text-gray-800">{user.name}</div>
                             <div className="text-xs truncate text-gray-500">{user.email}</div>
                           </div>
                           <button
                             onClick={() => {
                               setSelectedUser(user);
                               setEmailMode("individual");
                               setEmailSubject(selectedHistoryItem.subject);
                               setEmailBody(selectedHistoryItem.htmlBody);
                               setActiveTab("email");
                               setSelectedHistoryItem(null);
                             }}
                             className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded font-bold transition-colors"
                           >
                             Send
                           </button>
                         </div>
                       ))}
                   </div>
                 </>
               ) : (
                 <div className="text-center text-gray-500 py-8">
                   <p>No recipient data available for this email.</p>
                   <p className="text-sm mt-2">Recipient tracking was added in a recent update.</p>
                 </div>
               )}
             </div>
             
             {/* Footer */}
             <div className="p-4 border-t bg-gray-50 flex justify-end">
               <button
                 onClick={() => setSelectedHistoryItem(null)}
                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}
       
       {/* Email Preview Modal */}
       {showPreview && (
         <div 
           className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
           onClick={() => setShowPreview(false)}
         >
           <div 
             className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Modal Header */}
             <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
               <div>
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Preview</span>
                 <h3 className="text-lg font-bold text-gray-800 truncate max-w-md">
                    {emailSubject || "No Subject"}
                 </h3>
               </div>
               <button 
                 onClick={() => setShowPreview(false)}
                 className="p-2 hover:bg-gray-200 rounded-full transition-colors"
               >
                 <FaTimes className="text-gray-600" />
               </button>
             </div>
             
             {/* Modal Content - The actual email preview */}
             <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center py-8">
               {/* Container for the email - acts as the email client viewport */}
               <div 
                  className="email-preview-content bg-white shadow-sm w-full max-w-[600px] min-h-[400px]"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  dangerouslySetInnerHTML={{ 
                    __html: emailBody
                      .replace(/\$\{userName\}/g, selectedUser?.name || (emailMode === "all" ? "Student" : "..."))
                      .replace(/{{name}}/g, selectedUser?.name || (emailMode === "all" ? "Student" : "..."))
                  }}
               />
             </div>
             
             <div className="p-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                Note: Actual rendering may vary slightly across different email clients.
             </div>
           </div>
         </div>
       )}
 
       {/* Message Detail Modal (For Messages Tab) */}
       {selectedMessage && (
         <div 
           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           onClick={() => setSelectedMessage(null)}
         >
           <div 
             className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl"
             style={{ backgroundColor: "var(--bg-primary)" }}
             onClick={(e) => e.stopPropagation()}
           >
             {/* Modal Header */}
             <div className="p-6 border-b" style={{ borderColor: "var(--accent-secondary)" }}>
               <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                   <div className="text-3xl">{getTypeIcon(selectedMessage.type)}</div>
                   <div>
                     <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                       {selectedMessage.subject}
                     </h2>
                     <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                       From: {selectedMessage.userName} ({selectedMessage.userEmail})
                     </p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedMessage(null)}>
                   <FaTimes style={{ color: "var(--text-secondary)" }} />
                 </button>
               </div>
             </div>
 
             {/* Modal Body */}
             <div className="p-6">
               <div className="flex gap-2 mb-4 flex-wrap">
                 {getStatusBadge(selectedMessage.status)}
                 <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400">
                   {selectedMessage.type.replace("_", " ").toUpperCase()}
                 </span>
                 <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                   {new Date(selectedMessage.createdAt).toLocaleString()}
                 </span>
               </div>
 
               <div 
                 className="p-4 rounded-lg mb-6"
                 style={{ backgroundColor: "var(--bg-secondary)" }}
               >
                 <p style={{ color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
                   {selectedMessage.message}
                 </p>
               </div>
 
               {/* Actions */}
               <div className="flex flex-wrap gap-3">
                 <button
                   onClick={() => updateStatus(selectedMessage._id, "pending")}
                   className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-600 text-sm font-medium"
                 >
                   <FaClock className="inline mr-2" /> Pending
                 </button>
                 <button
                   onClick={() => updateStatus(selectedMessage._id, "in_progress")}
                   className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-600 text-sm font-medium"
                 >
                   <FaSpinner className="inline mr-2" /> In Progress
                 </button>
                 <button
                   onClick={() => updateStatus(selectedMessage._id, "resolved")}
                   className="px-4 py-2 rounded-lg bg-green-500/20 text-green-600 text-sm font-medium"
                 >
                   <FaCheckCircle className="inline mr-2" /> Resolved
                 </button>
                 <button
                   onClick={() => deleteMessage(selectedMessage._id)}
                   className="px-4 py-2 rounded-lg bg-red-500/20 text-red-600 text-sm font-medium"
                 >
                   <FaTrash className="inline mr-2" /> Delete
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default AdminDashboard;
