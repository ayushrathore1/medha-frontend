import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import SubjectManager from "../components/Dashboard/SubjectManager";
import CalendarWidget from "../components/Dashboard/CalendarWidget";
import LiveClock from "../components/Dashboard/LiveClock";
import StudyTimer from "../components/Dashboard/StudyTimer";
import FeatureAnnouncementModal from "../components/Common/FeatureAnnouncementModal";
import { format } from "date-fns";
import TodoList from "../components/Dashboard/TodoList";
// import PlanModal from "../components/Dashboard/PlanModal"; // Commenting out PlanModalget";
import DailyPlanWidget from "../components/Dashboard/DailyPlanWidget";
import { FaFire, FaBook, FaChartLine, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    streak: 0,
    cardsLearned: 0,
    accuracy: 0,
    reviewList: [],
    quizzesTaken: 0,
    notesCreated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const [statsRes, userRes] = await Promise.all([
        axios.get(`${baseUrl}/api/dashboard/stats`, { headers }),
        axios.get(`${baseUrl}/api/users/me`, { headers })
      ]);
      
      setStats(statsRes.data);
      setUserName(statsRes.data.userName || "Student");

      // Check for Feature Announcement Modal
      const user = userRes.data;
      const MAX_VIEWS = 3;
      const SESSION_KEY = "medha_feature_modal_shown";

      if (
        (user.featureNotificationViews || 0) < MAX_VIEWS && 
        !sessionStorage.getItem(SESSION_KEY)
      ) {
        console.log("SHOWING FEATURE MODAL: Views =", user.featureNotificationViews);
        setShowFeatureModal(true);
        // Mark as shown in this session immediately to prevent re-show on refresh
        sessionStorage.setItem(SESSION_KEY, "true");
        
        // Increment view count in backend
        await axios.post(
          `${baseUrl}/api/users/increment-notification-view`, 
          {}, 
          { headers }
        );
      } else {
        console.log("NOT SHOWING MODAL. Views:", user.featureNotificationViews, "Session Shown:", sessionStorage.getItem(SESSION_KEY));
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicName) => {
    if (!window.confirm(`Are you sure you want to delete all flashcards for topic "${topicName}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/topic/${encodeURIComponent(topicName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  if (loading) return <Loader fullScreen />;



  return (
    <div className="min-h-screen w-full px-4 py-6 sm:p-6 pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-base sm:text-lg opacity-80" style={{ color: "var(--text-secondary)" }}>
              Ready to conquer your subjects today?
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Left Column: Stats, Plan, Todos, Subjects */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-500/20 text-orange-500">
                  <FaFire size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-70">Day Streak</p>
                  <p className="text-2xl font-bold">{stats.streak}</p>
                </div>
              </Card>
              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
                  <FaBook size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-70">Cards Learned</p>
                  <p className="text-2xl font-bold">{stats.cardsLearned}</p>
                </div>
              </Card>
              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20 text-green-500">
                  <FaChartLine size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-70">Avg Accuracy</p>
                  <p className="text-2xl font-bold">{stats.accuracy}%</p>
                </div>
              </Card>
            </div>

            {/* Daily Plan & Todo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Daily Plan Widget */}
               <div className="h-full">
                  <DailyPlanWidget />
               </div>
               {/* To-Do List */}
               <div className="h-full">
                  <TodoList />
               </div>
            </div>

            {/* Subject Manager */}
            <SubjectManager />

            {/* Topics to Review */}
            <Card>
              <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Topics to Review
              </h2>
              {stats.reviewList.length === 0 ? (
                <p className="opacity-60 text-sm sm:text-base">No topics marked for review. Great job!</p>
              ) : (
                <div className="space-y-4">
                  {stats.reviewList.map((topic) => (
                    <div key={topic._id} className="p-3 sm:p-4 rounded-xl border-2" style={{ borderColor: "var(--accent-secondary)" }}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                          {topic.name} <span className="text-sm font-normal opacity-70">({topic.difficulty})</span>
                        </h3>
                        <Button 
                          onClick={() => handleDeleteTopic(topic.name)}
                          variant="danger"
                          className="!py-1.5 !px-3 text-sm w-full sm:w-auto flex justify-center"
                        >
                          <FaTrash className="mr-2" /> Delete Topic
                        </Button>
                      </div>
                      <div className="text-sm opacity-70">
                         Marked as {topic.difficulty}. Review the flashcards in this topic to improve!
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Tools Only */}
          <div className="space-y-6 sm:space-y-8">
            {/* Unified Widget Card */}
            <Card className="space-y-6 sticky top-24">
              <LiveClock />
              <div className="border-t border-gray-700 pt-4">
                <CalendarWidget />
              </div>
              <div className="border-t border-gray-700 pt-4">
                <StudyTimer />
              </div>
            </Card>
          </div>

        </div>
      </div>
      <FeatureAnnouncementModal 
        isOpen={showFeatureModal} 
        onClose={() => setShowFeatureModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
