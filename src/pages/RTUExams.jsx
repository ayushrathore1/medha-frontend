import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import YearSelector from "../components/RTUExams/YearSelector";
import UnitWeightageBar from "../components/RTUExams/UnitWeightageBar";
import { FaArrowLeft, FaLayerGroup, FaCircleCheck, FaChartBar, FaEnvelope, FaBuildingColumns, FaBook, FaPlay, FaGraduationCap } from "react-icons/fa6";
import LearnConcepts from "../components/RTUExams/LearnConcepts";

import { useTour } from "../context/TourContext";
import useAuthGuard from "../hooks/useAuthGuard";

const RTUExams = () => {
  const { isGuestMode } = useTour();
  const { requireAuth } = useAuthGuard();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("archives"); // 'archives' or 'learn'
  const [viewState, setViewState] = useState("semesters");
  const [subjects, setSubjects] = useState(isGuestMode ? [
    { name: "Digital Electronics", difficulty: "medium", total: 10, viewed: 5 },
    { name: "Software Engineering", difficulty: "hard", total: 8, viewed: 2 },
    { name: "Data Structures", difficulty: "easy", total: 12, viewed: 12 }
  ] : []);
  const [loading, setLoading] = useState(!isGuestMode);

  const [selectedSubject, setSelectedSubject] = useState(isGuestMode ? { name: "Digital Electronics", difficulty: "medium" } : null);
  const [availableYears, setAvailableYears] = useState(isGuestMode ? [2024, 2023, 2022] : []);
  const [selectedYear, setSelectedYear] = useState(isGuestMode ? 2024 : null);
  const [unitWeightageData, setUnitWeightageData] = useState(isGuestMode ? {
    totalPaperMarks: 98,
    chatgptLink: null,
    claudeLink: null,
    units: [
      {
        unitSerial: 1,
        unitName: 'Number Systems & Boolean Algebra',
        totalMarks: 28,
        weightagePercentage: 28.5,
        weightageRatio: '28/98',
        youtubePlaylistUrl: null,
        questions: [
          { qCode: 'Q1(a)', text: 'Convert the decimal number 156.375 to binary and hexadecimal.', marks: 7 },
          { qCode: 'Q2(b)', text: 'Simplify the Boolean expression: F = AB\'C + ABC\' + A\'BC using K-Map.', marks: 7 },
        ]
      },
      {
        unitSerial: 2,
        unitName: 'Combinational Logic Circuits',
        totalMarks: 21,
        weightagePercentage: 21.4,
        weightageRatio: '21/98',
        youtubePlaylistUrl: null,
        questions: [
          { qCode: 'Q3(a)', text: 'Design a 4-bit binary adder using full adders.', marks: 7 },
        ]
      },
      {
        unitSerial: 3,
        unitName: 'Sequential Logic Circuits',
        totalMarks: 21,
        weightagePercentage: 21.4,
        weightageRatio: '21/98',
        youtubePlaylistUrl: null,
        questions: [
          { qCode: 'Q4(a)', text: 'Explain the working of a JK Flip-Flop with truth table and timing diagram.', marks: 7 },
        ]
      },
    ]
  } : null);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [weightageLoading, setWeightageLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // For admin image upload capability

  useEffect(() => {
    // Skip API calls if in guest mode (tour)
    if (isGuestMode) return;
    
    // Always fetch subjects for everyone (free feature)
    fetchSubjects();
    
    // Only check admin status if logged in
    const token = localStorage.getItem("token");
    if (token) {
      checkAdminStatus();
    }
  }, [isGuestMode]);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${baseUrl}/api/messages/check-admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Admin status check result:", res.data);
      setIsAdmin(res.data.isAdmin || false);
    } catch (e) {
      console.error("Admin status check failed:", e);
      setIsAdmin(false);
    }
  };

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

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setViewState("years");
    // Skip API call in guest mode - we already have dummy years
    if (!isGuestMode) {
      await fetchAvailableYears(subject.name);
    }
  };

  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    setViewState("unitWeightage");
    // Skip API call in guest mode - we already have dummy weightage data
    if (!isGuestMode) {
      await fetchUnitWeightage(selectedSubject.name, year);
    }
  };

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

  const getHeaderTitle = () => {
    if (activeTab === 'learn') return "Learn the Concepts";
    switch (viewState) {
      case "semesters": return "The Archives";
      case "subjects": return "3rd Semester";
      case "years": return selectedSubject?.name || "Select Year";
      case "unitWeightage": return `${selectedSubject?.name} (${selectedYear})`;
      default: return "RTU Exams";
    }
  };

  const getHeaderSubtitle = () => {
    if (activeTab === 'learn') return "Watch video lectures and download study materials.";
    switch (viewState) {
      case "semesters": return "Access previous year papers and smart analysis.";
      case "subjects": return "Choose a subject to explore exam patterns.";
      case "years": return "Pick an academic year to verify trends.";
      case "unitWeightage": return `Analysis based on ${unitWeightageData?.totalPaperMarks || 98} marks paper`;
      default: return "";
    }
  };

  if (loading && subjects.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center relative mb-12">
           {activeTab === 'archives' && viewState !== "semesters" && (
              <div className="absolute left-0 top-0">
                 <Button onClick={handleBack} variant="ghost" className="bg-[var(--bg-secondary)] shadow-sm border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                    <FaArrowLeft className="mr-2" /> Back
                 </Button>
              </div>
           )}
           
           <motion.div
             key={`${activeTab}-${viewState}`}
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-2xl"
             data-tour="rtu-exams"
           >
              <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
                 {getHeaderTitle()}
              </h1>
              <p className="text-lg text-[var(--text-secondary)] font-medium">
                 {getHeaderSubtitle()}
              </p>
           </motion.div>

           {/* Tab Navigation */}
           {(activeTab === 'learn' || (activeTab === 'archives' && viewState === 'semesters')) && (
             <div className="flex items-center gap-2 mt-8 bg-[var(--bg-secondary)] rounded-2xl p-2 shadow-sm border border-[var(--border-default)]">
               <button
                 onClick={() => { setActiveTab('archives'); setViewState('semesters'); }}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                   activeTab === 'archives'
                     ? 'bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-hover)] text-white shadow-md'
                     : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                 }`}
               >
                 <FaBuildingColumns size={16} />
                 The Archives
               </button>
               <button
                 onClick={() => setActiveTab('learn')}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                   activeTab === 'learn'
                     ? 'bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-hover)] text-white shadow-md'
                     : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                 }`}
               >
                 <FaGraduationCap size={16} />
                 Learn the Concepts
               </button>
             </div>
           )}
        </div>

        {/* Learn the Concepts Tab */}
        {activeTab === 'learn' && (
          <LearnConcepts />
        )}

        {/* Archives Tab */}
        {activeTab === 'archives' && (
        <>
        <AnimatePresence mode="wait">
           {/* Semesters View */}
          {viewState === "semesters" && (
             <motion.div
               key="semesters"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
             >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const isActive = sem === 3;
                  return (
                    <motion.div
                      key={sem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sem * 0.05 }}
                      data-tour={sem === 3 ? "rtu-semester" : undefined}
                      onClick={isActive ? () => setViewState("subjects") : undefined}
                      className={isActive ? "cursor-pointer group" : ""}
                    >
                      <Card className={`w-full flex flex-col items-center p-8 gap-3 transition-all bg-[var(--bg-secondary)] border-[var(--border-default)] ${
                        isActive 
                          ? "hover:border-[var(--action-primary)] hover:shadow-xl hover:-translate-y-1" 
                          : "opacity-70 cursor-not-allowed"
                      }`}>
                        <div className={`p-4 rounded-full transition-colors ${
                          isActive 
                            ? "bg-[var(--action-primary)]/10 text-[var(--action-primary)] group-hover:bg-[var(--action-primary)] group-hover:text-white" 
                            : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                        }`}>
                          <FaBuildingColumns size={32} />
                        </div>
                        <h2 className={`text-xl font-bold whitespace-nowrap ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
                          {sem === 1 ? "1st" : sem === 2 ? "2nd" : sem === 3 ? "3rd" : `${sem}th`} Semester
                        </h2>
                        <p className="text-[var(--text-tertiary)] font-medium text-sm text-center">Computer Science & Engineering</p>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                          isActive 
                            ? "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:bg-[var(--action-primary)]/10 group-hover:text-[var(--action-primary)]" 
                            : "bg-[var(--color-warning-bg)]/10 text-[var(--color-warning-text)]"
                        }`}>
                          {isActive ? "Click to Open" : "Coming Soon"}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
             </motion.div>
          )}

          {/* Subjects View */}
          {viewState === "subjects" && (
             <motion.div
               data-tour="rtu-subjects"
               key="subjects"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
                {subjects.map((subject, idx) => (
                   <motion.div
                     key={subject._id || subject.name}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                   >
                     <Card 
                       onClick={() => handleSubjectClick(subject)}
                       className="cursor-pointer group h-full flex flex-col justify-between hover:border-[var(--action-primary)] hover:shadow-lg transition-all bg-[var(--bg-secondary)] border-[var(--border-default)]"
                     >
                        <div>
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-2.5 bg-[var(--action-primary)]/10 text-[var(--action-primary)] rounded-xl">
                                 <FaBook size={20} />
                              </div>
                              {subject.viewed === subject.total && subject.total > 0 && (
                                 <FaCircleCheck className="text-emerald-500" title="Completed"/>
                              )}
                           </div>
                           <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2 leading-tight group-hover:text-[var(--action-primary)] transition-colors">
                              {subject.name}
                           </h3>
                           
                           {[
                              "Advanced Engineering Mathematics",
                              "Data Structures and Algorithms",
                              "Object Oriented Programming",
                              "Digital Electronics",
                              "Software Engineering",
                              "Technical Communication",
                              "Managerial Economics and Financial Accounting",
                           ].includes(subject.name) && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--action-primary)]/10 text-[var(--action-primary)] rounded-lg text-xs font-bold border border-[var(--action-primary)]/20 mb-4">
                                 <FaChartBar /> Includes Analysis
                              </div>
                           )}
                        </div>

                        <div className="pt-4 mt-2 border-t border-[var(--border-default)] flex gap-2" onClick={(e) => e.stopPropagation()}>
                           {['easy', 'medium', 'hard'].map(d => (
                              <button
                                key={d}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    requireAuth(() => handleDifficultyChange(subject.name, d), 'Voting Difficulty');
                                }}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                  subject.difficulty === d 
                                    ? (d === 'easy' 
                                        ? 'bg-[var(--color-success-bg)]/20 text-[var(--color-success-text)]' 
                                        : d === 'medium' 
                                            ? 'bg-[var(--color-warning-bg)]/20 text-[var(--color-warning-text)]' 
                                            : 'bg-[var(--color-danger-bg)]/20 text-[var(--color-danger-text)]')
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]/80'
                                }`}
                              >
                                {d}
                              </button>
                           ))}
                        </div>
                     </Card>
                   </motion.div>
                ))}
             </motion.div>
          )}

          {/* Years View */}
          {viewState === "years" && (
             <motion.div data-tour="rtu-years" key="years" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
             <motion.div key="unitWeightage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {weightageLoading ? (
                   <div className="flex justify-center py-20"><Loader /></div>
                ) : unitWeightageData ? (
                   <div className="max-w-4xl mx-auto">
                      <div data-tour="rtu-weightage" className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8 shadow-md border-2 border-[var(--action-primary)]/20 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--action-primary)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                         <h3 className="text-xl font-bold text-[var(--text-primary)] relative z-10">Exam Strategy Analysis</h3>
                         <p className="text-[var(--text-secondary)] text-sm relative z-10 mt-1">
                            Units are sorted by weightage. Focus on the top units first to maximize your score.
                         </p>
                         <div className="mt-4 p-3 bg-[var(--color-warning-bg)]/10 border border-[var(--color-warning-bg)]/20 rounded-xl relative z-10">
                            <p className="text-xs text-[var(--color-warning-text)] font-medium">
                               <span className="font-bold">📋 Note:</span> The {unitWeightageData?.totalPaperMarks || 98} marks shown include all questions (including optional ones). 
                               Students typically attempt only 70 marks worth based on paper instructions.
                            </p>
                         </div>
                      </div>

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
                            subjectName={selectedSubject?.name || ""}
                            year={selectedYear}
                            isAdmin={isAdmin}
                            chatgptLink={unitWeightageData.chatgptLink}
                            claudeLink={unitWeightageData.claudeLink}
                            onQuestionsUpdated={() => fetchUnitWeightage(selectedSubject.name, selectedYear)}
                            onLinksUpdated={() => fetchUnitWeightage(selectedSubject.name, selectedYear)}
                         />
                      ))}
                   </div>
                ) : (
                   <div className="text-center py-20">
                      <p className="text-xl font-bold text-[var(--text-tertiary)]">No analysis data available yet.</p>
                   </div>
                )}
             </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-20 text-center pb-8 border-t border-[var(--border-default)] pt-8 max-w-xl mx-auto">
           <p className="text-[var(--text-tertiary)] font-medium mb-4">
              Missing analysis for your year?
           </p>
           <button
              onClick={() => navigate("/messages")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-hover)] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
           >
              <FaEnvelope className="text-xl" />
              <span>Request via Messages</span>
           </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default RTUExams;
