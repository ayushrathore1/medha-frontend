import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import YearSelector from "../components/RTUExams/YearSelector";
import UnitWeightageBar from "../components/RTUExams/UnitWeightageBar";
import { FaArrowLeft, FaLayerGroup, FaCheckCircle, FaChartBar, FaLinkedin } from "react-icons/fa";

const RTUExams = () => {
  const navigate = useNavigate(); // Initialize hook
  // Enhanced viewState: "semesters", "subjects", "years", "unitWeightage"
  const [viewState, setViewState] = useState("semesters");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // New state for subject → year → unit flow
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [unitWeightageData, setUnitWeightageData] = useState(null);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [weightageLoading, setWeightageLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    fetchSubjects();
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(`${baseUrl}/api/rtu/3rd-sem`, { headers });
      setSubjects(res.data.topics);
    } catch (error) {
      console.error("Error fetching RTU subjects:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch available years for a subject
  const fetchAvailableYears = async (subjectName) => {
    try {
      setYearsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(
        `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years`,
        { headers }
      );

      if (res.data.success) {
        setAvailableYears(res.data.years);
      }
    } catch (error) {
      console.error("Error fetching available years:", error);
      setAvailableYears([]);
    } finally {
      setYearsLoading(false);
    }
  };

  // Fetch unit weightage data for a specific year
  const fetchUnitWeightage = async (subjectName, year) => {
    try {
      setWeightageLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(
        `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/weightage`,
        { headers }
      );

      if (res.data.success) {
        setUnitWeightageData(res.data);
      }
    } catch (error) {
      console.error("Error fetching unit weightage:", error);
      setUnitWeightageData(null);
    } finally {
      setWeightageLoading(false);
    }
  };

  // Handle subject click - navigate to years view
  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setViewState("years");
    await fetchAvailableYears(subject.name);
  };

  // Handle year selection - navigate to unit weightage view
  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    setViewState("unitWeightage");
    await fetchUnitWeightage(selectedSubject.name, year);
  };

  // Handle back navigation
  const handleBack = () => {
    if (viewState === "unitWeightage") {
      setViewState("years");
      setSelectedYear(null);
      setUnitWeightageData(null);
    } else if (viewState === "years") {
      setViewState("subjects");
      setSelectedSubject(null);
      setAvailableYears([]);
    } else if (viewState === "subjects") {
      setViewState("semesters");
    }
  };

  const handleDifficultyChange = async (topicName, difficulty) => {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.name === topicName ? { ...sub, difficulty } : sub
      )
    );

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/topic/${encodeURIComponent(topicName)}/difficulty`,
        { difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating difficulty:", error);
      fetchSubjects();
    }
  };

  // Get header title based on view state
  const getHeaderTitle = () => {
    switch (viewState) {
      case "semesters":
        return "RTU Exams";
      case "subjects":
        return "3rd Semester";
      case "years":
        return selectedSubject?.name || "Select Year";
      case "unitWeightage":
        return `${selectedSubject?.name} - ${selectedYear}`;
      default:
        return "RTU Exams";
    }
  };

  // Get header subtitle based on view state
  const getHeaderSubtitle = () => {
    switch (viewState) {
      case "semesters":
        return "Select your semester to view available subjects.";
      case "subjects":
        return "Select a subject to view exam analysis.";
      case "years":
        return "Select a year to view unit-wise marks distribution.";
      case "unitWeightage":
        return `Unit-wise weightage analysis (Total: ${unitWeightageData?.totalPaperMarks || 98} marks)`;
      default:
        return "";
    }
  };

  if (loading && subjects.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 max-w-7xl mx-auto pb-12">
      {/* Header with Back Button logic */}
      <header className="mb-10 flex flex-col items-center relative">
        {viewState !== "semesters" && (
          <div className="self-start md:self-auto md:absolute md:left-0 md:top-4 mb-4 md:mb-0">
            <Button onClick={handleBack} variant="ghost">
              <FaArrowLeft className="mr-2" /> Back
            </Button>
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent mb-4 text-center px-4 leading-tight">
          {getHeaderTitle()}
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto text-center">
          {getHeaderSubtitle()}
        </p>
      </header>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Semesters View */}
          {viewState === "semesters" && (
            <motion.div
              key="semesters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                onClick={() => setViewState("subjects")}
                className="cursor-pointer hover:border-violet-500 transition-all group relative flex flex-col items-center justify-center py-12 gap-4"
                hoverEffect={true}
              >
                <div className="p-4 rounded-full bg-violet-500/20 text-violet-500">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  3rd Semester
                </h2>
                <p
                  className="text-sm opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Click to view subjects
                </p>
              </Card>
            </motion.div>
          )}

          {/* Subjects View */}
          {viewState === "subjects" && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {subjects.map((subject) => (
                <Card
                  key={subject._id || subject.name}
                  className="cursor-pointer hover:border-violet-500 transition-all group relative"
                  hoverEffect={true}
                  onClick={() => handleSubjectClick(subject)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <FaLayerGroup className="text-violet-500" />
                      <h3
                        className="text-xl font-bold line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {subject.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-70">
                      {subject.viewed || 0} / {subject.total || 0} Viewed
                    </span>
                    {subject.viewed === subject.total && subject.total > 0 && (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </div>

                  {/* Analysis indicator for subjects with data */}
                  {[
                    "Advanced Engineering Mathematics",
                    "Data Structures and Algorithms",
                    "Object Oriented Programming",
                    "Digital Electronics",
                    "Software Engineering",
                    "Technical Communication",
                    "Managerial Economics and Financial Accounting",
                  ].includes(subject.name) && (
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--action-primary)" }}
                    >
                      <FaChartBar />
                      <span>Analysis Available</span>
                    </div>
                  )}

                  {/* Difficulty Controls */}
                  <div
                    className="flex gap-2 mt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleDifficultyChange(subject.name, "easy")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        subject.difficulty === "easy"
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => handleDifficultyChange(subject.name, "medium")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        subject.difficulty === "medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => handleDifficultyChange(subject.name, "hard")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        subject.difficulty === "hard"
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      Difficult
                    </button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Years View */}
          {viewState === "years" && (
            <motion.div
              key="years"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <YearSelector
                years={availableYears}
                selectedYear={selectedYear}
                onYearSelect={handleYearSelect}
                loading={yearsLoading}
              />
            </motion.div>
          )}

          {/* Unit Weightage View */}
          {viewState === "unitWeightage" && (
            <motion.div
              key="unitWeightage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {weightageLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Loader />
                </div>
              ) : unitWeightageData ? (
                <div>
                  {/* Summary Card */}
                  <Card
                    hoverEffect={false}
                    style={{ marginBottom: "24px", textAlign: "center" }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                      }}
                    >
                      Unit-wise Marks Distribution
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      Sorted by weightage (highest to lowest)
                    </p>
                  </Card>

                  {/* Unit Bars */}
                  {unitWeightageData.units.map((unit, index) => (
                    <UnitWeightageBar
                      key={unit.unitSerial}
                      unitSerial={unit.unitSerial}
                      unitName={unit.unitName}
                      totalMarks={unit.totalMarks}
                      weightagePercentage={unit.weightagePercentage}
                      weightageRatio={unit.weightageRatio}
                      youtubePlaylistUrl={unit.youtubePlaylistUrl}
                      questions={unit.questions}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--text-secondary)",
                  }}
                >
                  No analysis data available for this year.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-16 mb-8 text-center flex flex-col items-center justify-center">
        <p className="text-[var(--text-secondary)] font-medium mb-4">
          Want your branch or year’s paper analysis added? Contact us!
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
    </div>
  );
};

export default RTUExams;
