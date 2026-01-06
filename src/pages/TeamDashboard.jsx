import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaMagnifyingGlass, FaArrowDownAZ, FaCalendarDays, FaSpinner, 
  FaBook, FaLightbulb, FaCloudArrowUp
} from "react-icons/fa6";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";
import Button from "../components/Common/Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeamDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'content'
  
  // User Directory State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("newest");
  const [universityFilter, setUniversityFilter] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    checkTeamAndFetch();
  }, []);

  const checkTeamAndFetch = async () => {
    try {
      // Reuse the check-admin endpoint or try a new check-team one?
      // Since teamAuth allows admin too, we can verify via user info
      // Ideally we should have a /api/team/check endpoint, but let's just fetch users and catch error
      const res = await axios.get(`${BACKEND_URL}/api/admin/users`, { headers });
      setUsers(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Access denied:", error);
      navigate("/dashboard");
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

    // Sort
    if (userSort === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  };

  const getUniqueUniversities = () => {
    return [...new Set(users.map(u => u.university).filter(Boolean))].sort();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div 
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
              Team Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage content and view community members
            </p>
          </div>
          
          <div className="flex gap-2">
             <button 
               onClick={() => setActiveTab("users")}
               className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === 'users' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'}`}
             >
               <FaUser className="inline mr-2"/> Users
             </button>
             <button 
               onClick={() => setActiveTab("content")}
               className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === 'content' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'}`}
             >
               <FaBook className="inline mr-2"/> Content
             </button>
          </div>
        </header>

        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <Card className="lg:col-span-1 p-4 h-fit">
              <h2 className="font-bold mb-4 text-[var(--text-primary)]">Filters</h2>
              <div className="space-y-4">
                <div className="relative">
                   <FaMagnifyingGlass className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                   <input 
                     type="text"
                     placeholder="Search..."
                     value={userSearch}
                     onChange={(e) => setUserSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                   />
                </div>
                
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                >
                  <option value="">All Universities</option>
                  {getUniqueUniversities().map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                   <button 
                     onClick={() => setUserSort("name")}
                     className={`flex-1 py-2 text-sm rounded border ${userSort === 'name' ? 'bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/30' : 'border-[var(--border-default)] text-[var(--text-secondary)]'}`}
                   >
                     <FaArrowDownAZ className="inline mr-1" /> Name
                   </button>
                   <button 
                     onClick={() => setUserSort("newest")}
                     className={`flex-1 py-2 text-sm rounded border ${userSort === 'newest' ? 'bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/30' : 'border-[var(--border-default)] text-[var(--text-secondary)]'}`}
                   >
                     <FaCalendarDays className="inline mr-1" /> Newest
                   </button>
                </div>
              </div>
            </Card>

            {/* User List */}
            <div className="lg:col-span-3 space-y-3">
              {getFilteredUsers().map(user => (
                <div 
                  key={user._id}
                  className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{user.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      {user.university && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--action-primary)]/10 text-[var(--action-primary)] rounded-full">
                          {user.university}
                        </span>
                      )}
                      {user.role === 'team' && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">TEAM MEMBER</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[var(--text-tertiary)]">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "content" && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="p-8 text-center border-dashed border-2 border-[var(--border-default)] hover:border-[var(--action-primary)] transition-all cursor-pointer group"
                onClick={() => navigate("/notes")}
             >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                  <FaCloudArrowUp />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Upload Public Notes</h3>
                <p className="text-[var(--text-secondary)]">Share study materials with the community.</p>
             </Card>

             <Card className="p-8 text-center border-dashed border-2 border-[var(--border-default)] hover:border-[var(--action-primary)] transition-all cursor-pointer group"
                onClick={() => navigate("/learn")}
             >
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                  <FaLightbulb />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Manage Learning Concepts</h3>
                <p className="text-[var(--text-secondary)]">Create and edit educational content.</p>
             </Card>
           </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;
