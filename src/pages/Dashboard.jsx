import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import SubjectManager from "../components/Dashboard/SubjectManager";
import CalendarWidget from "../components/Dashboard/CalendarWidget";
import LiveClock from "../components/Dashboard/LiveClock";
import StudyTimer from "../components/Dashboard/StudyTimer";
import TodoList from "../components/Dashboard/TodoList";
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

      const res = await axios.get(`${baseUrl}/api/dashboard/stats`, { headers });
      
      setStats(res.data);
      setUserName(res.data.userName || "Student");
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

  // Group review items by topic
  const groupedReview = stats.reviewList.reduce((acc, item) => {
    const topic = item.topicName || "General";
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-lg opacity-80" style={{ color: "var(--text-secondary)" }}>
              Ready to conquer your subjects today?
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Subjects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Subject Manager */}
            <SubjectManager />

            {/* Topics to Review */}
            <Card>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Topics to Review
              </h2>
              {Object.keys(groupedReview).length === 0 ? (
                <p className="opacity-60">No topics marked for review. Great job!</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedReview).map(([topic, items]) => (
                    <div key={topic} className="p-4 rounded-xl border-2" style={{ borderColor: "var(--accent-secondary)" }}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                          {topic} <span className="text-sm font-normal opacity-70">({items.length} cards)</span>
                        </h3>
                        <Button 
                          onClick={() => handleDeleteTopic(topic)}
                          variant="danger"
                          className="!py-1 !px-3 text-sm"
                        >
                          <FaTrash className="mr-2" /> Delete Topic
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {items.slice(0, 3).map((item) => (
                          <div key={item._id} className="text-sm opacity-80 truncate pl-2 border-l-2 border-gray-500">
                            {item.question}
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-xs opacity-60 pl-2">...and {items.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Tools & Todo */}
          <div className="space-y-8">
            {/* Unified Widget Card */}
            <Card className="space-y-6">
              <LiveClock />
              <div className="border-t border-gray-700 pt-4">
                <CalendarWidget />
              </div>
              <div className="border-t border-gray-700 pt-4">
                <StudyTimer />
              </div>
            </Card>

            {/* Daily Plan Widget */}
            <div className="h-[300px]">
              <DailyPlanWidget />
            </div>

            {/* To-Do List */}
            <div className="h-[400px]">
              <TodoList />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
