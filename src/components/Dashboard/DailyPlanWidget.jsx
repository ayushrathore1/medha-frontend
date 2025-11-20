import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Common/Card";
import Button from "../Common/Button";
import { FaRobot, FaMagic, FaEdit } from "react-icons/fa";

const DailyPlanWidget = () => {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlan(res.data.plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/plan`,
        { prompt: customPrompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(res.data.plan);
      setShowPrompt(false);
      setCustomPrompt("");
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <FaRobot size={100} />
      </div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <FaMagic className="text-purple-500" /> AI Daily Coach
        </h2>
        <Button 
          variant="secondary" 
          className="!py-1 !px-3 text-sm"
          onClick={() => setShowPrompt(!showPrompt)}
        >
          <FaEdit className="mr-2" /> {plan ? "Update Plan" : "Create Plan"}
        </Button>
      </div>

      <div className="flex-1 relative z-10">
        {showPrompt ? (
          <div className="space-y-4 animate-fade-in">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., 'Focus on Data Structures today' or 'I have a math exam tomorrow'"
              className="w-full p-3 rounded-lg border-2 h-32 focus:outline-none focus:ring-2 resize-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowPrompt(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={handleGenerate}
                loading={generating}
                disabled={generating}
              >
                Generate Plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            ) : plan ? (
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {plan}
              </p>
            ) : (
              <div className="text-center py-8 opacity-60">
                <p>No plan for today yet.</p>
                <p className="text-sm mt-2">Add some tasks and click "Create Plan"!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyPlanWidget;
