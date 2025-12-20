import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaFire, FaCalendarAlt } from "react-icons/fa";
import Card from "../Common/Card";

const ActivityCalendar = () => {
  const [activityData, setActivityData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityHistory();
  }, []);

  const fetchActivityHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/activity-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivityData(response.data.activityHistory || []);
      setStreak(response.data.streak || 0);
    } catch (error) {
      console.error("Error fetching activity history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate last 12 weeks (84 days) of calendar data
  const generateCalendarData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weeks = [];
    
    // Convert activity dates to Set for O(1) lookup
    const activeDatesSet = new Set(
      activityData.map(d => new Date(d).toISOString().split('T')[0])
    );

    // Start from 11 weeks ago (to show 12 weeks total)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 83); // 84 days = 12 weeks
    
    // Align to start of week (Sunday)
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentDate = new Date(startDate);
    
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isActive = activeDatesSet.has(dateStr);
        const isToday = currentDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
        const isFuture = currentDate > today;
        
        weekData.push({
          date: new Date(currentDate),
          dateStr,
          isActive,
          isToday,
          isFuture,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(weekData);
    }
    
    return weeks;
  };

  const weeks = generateCalendarData();
  const totalActiveDays = activityData.length;
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-32 bg-slate-100 rounded-xl"></div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <FaCalendarAlt size={16} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Activity</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <FaFire className="text-orange-500" />
            <span className="font-bold text-slate-700">{streak} day streak</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {totalActiveDays} active days
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((label, idx) => (
            <div 
              key={idx} 
              className="w-3 h-3 flex items-center justify-center text-[8px] font-bold text-slate-400"
            >
              {idx % 2 === 1 ? label : ""}
            </div>
          ))}
        </div>
        
        {/* Weeks */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <motion.div
                key={dayIdx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: weekIdx * 0.02 + dayIdx * 0.01 }}
                title={`${day.date.toLocaleDateString()} ${day.isActive ? '- Active' : ''}`}
                className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125 ${
                  day.isFuture
                    ? "bg-slate-100"
                    : day.isToday
                    ? day.isActive
                      ? "bg-emerald-500 ring-2 ring-emerald-300"
                      : "bg-slate-200 ring-2 ring-indigo-300"
                    : day.isActive
                    ? "bg-emerald-500 hover:bg-emerald-400"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-slate-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-slate-200"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-300"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
        <span>More</span>
      </div>
    </Card>
  );
};

export default ActivityCalendar;
