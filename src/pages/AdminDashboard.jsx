import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaInbox, FaEnvelopeOpen, FaBug, FaLightbulb, FaCheckCircle, 
  FaClock, FaSpinner, FaTrash, FaEye, FaTimes, FaChartBar,
  FaFilter, FaSync
} from "react-icons/fa";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState({ status: "", type: "", isRead: "" });

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
    } catch (error) {
      navigate("/dashboard");
    }
  };

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.type) params.append("type", filter.type);
      if (filter.isRead) params.append("isRead", filter.isRead);

      const res = await axios.get(`${BACKEND_URL}/api/messages/admin/all?${params}`, { headers });
      setMessages(res.data.messages);
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
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return <span className={`w-2 h-2 rounded-full ${styles[priority]}`}></span>;
  };

  if (loading) return <Loader fullScreen />;
  if (!isAdmin) return null;

  return (
    <div 
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage user messages and feedback
          </p>
        </header>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-purple-400">{stats.total}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Total</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-blue-400">{stats.unread}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Unread</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Pending</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-orange-400">{stats.featureRequests}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Features</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-red-400">{stats.bugReports}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Bugs</div>
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
              className="px-3 py-2 rounded-lg bg-transparent border"
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
              className="px-3 py-2 rounded-lg bg-transparent border"
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
              className="px-3 py-2 rounded-lg bg-transparent border"
              style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)" }}
            >
              <option value="">All</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white flex items-center gap-2"
            >
              <FaSync /> Refresh
            </button>
          </div>
        </Card>

        {/* Messages List */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <Card className="text-center py-12">
              <FaInbox className="text-5xl mx-auto mb-4 opacity-50" style={{ color: "var(--text-secondary)" }} />
              <p style={{ color: "var(--text-secondary)" }}>No messages found</p>
            </Card>
          ) : (
            messages.map((msg) => (
              <Card 
                key={msg._id}
                className={`cursor-pointer transition-all hover:border-purple-500 ${!msg.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) markAsRead(msg._id);
                }}
              >
                <div className="flex items-start gap-4">
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
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl"
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
                  className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium"
                >
                  <FaClock className="inline mr-2" /> Pending
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage._id, "in_progress")}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium"
                >
                  <FaSpinner className="inline mr-2" /> In Progress
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage._id, "resolved")}
                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium"
                >
                  <FaCheckCircle className="inline mr-2" /> Resolved
                </button>
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium"
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
