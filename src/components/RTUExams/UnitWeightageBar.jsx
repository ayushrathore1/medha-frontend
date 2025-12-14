import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getBarGradient } from "../../utils/unitWeightageUtils";
import { FaYoutube, FaChevronDown, FaChevronUp, FaMagic, FaEye, FaSpinner, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * UnitWeightageBar - Visual bar component for unit weightage with AI solve feature
 */
const UnitWeightageBar = ({
  unitSerial,
  unitName,
  totalMarks,
  weightagePercentage,
  weightageRatio,
  youtubePlaylistUrl,
  questions = [],
  index = 0,
  subjectName = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [solutions, setSolutions] = useState({}); // Store solutions by question index
  const [loadingIdx, setLoadingIdx] = useState(null); // Currently loading question
  const [viewingIdx, setViewingIdx] = useState(null); // Currently viewing solution

  const barWidth = Math.min(weightagePercentage, 100);

  const handleWatchLecture = (e) => {
    e.stopPropagation();
    if (youtubePlaylistUrl) {
      window.open(youtubePlaylistUrl, "_blank", "noopener,noreferrer");
    }
  };

  const toggleExpand = () => {
    if (questions && questions.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  // Solve question using Medha AI
  const handleSolve = async (e, question, idx) => {
    e.stopPropagation();
    
    // If already solved, just show it
    if (solutions[idx]) {
      setViewingIdx(idx);
      return;
    }

    setLoadingIdx(idx);
    
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(
        `${BACKEND_URL}/api/chatbot/solve`,
        {
          question: question.text.replace(/<[^>]*>/g, ''), // Strip HTML
          subject: subjectName,
          unit: `Unit ${unitSerial} - ${unitName}`,
          marks: question.marks,
        },
        { headers, timeout: 120000 }
      );

      setSolutions(prev => ({
        ...prev,
        [idx]: response.data.solution
      }));
      setViewingIdx(idx);
    } catch (error) {
      console.error("Error solving question:", error);
      setSolutions(prev => ({
        ...prev,
        [idx]: "❌ Failed to generate solution. Please try again."
      }));
      setViewingIdx(idx);
    } finally {
      setLoadingIdx(null);
    }
  };

  // Close solution modal
  const closeSolution = (e) => {
    e.stopPropagation();
    setViewingIdx(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="unit-weightage-bar element-hover"
      onClick={toggleExpand}
      style={{
        padding: "16px",
        marginBottom: "16px",
        borderRadius: "16px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--accent-secondary)",
        cursor: questions.length > 0 ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Main Content Row */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Header Row */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <span
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "var(--text-primary)",
                lineHeight: "1.4",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Unit {unitSerial} – {unitName}
            </span>
            
            <div className="flex flex-wrap items-center gap-3">
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--action-primary)",
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                {totalMarks} marks ({weightagePercentage.toFixed(1)}%)
              </span>
              
              {youtubePlaylistUrl && (
                <button
                  onClick={handleWatchLecture}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#fff",
                    backgroundColor: "#FF0000",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  <FaYoutube /> Watch
                </button>
              )}
            </div>
          </div>

          {questions.length > 0 && (
            <div style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "5px",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
            style={{
              height: "100%",
              background: getBarGradient(weightagePercentage),
              borderRadius: "5px",
            }}
          />
        </div>
      </div>

      {/* Expanded Questions List */}
      <AnimatePresence>
        {isExpanded && questions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div 
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <h4 style={{ 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px"
              }}>
                Questions asked in 2024
              </h4>

              {questions.map((q, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span style={{ 
                      fontWeight: "700", 
                      color: "var(--action-primary)", 
                      fontSize: "14px"
                    }}>
                      {q.qCode}
                    </span>
                    <span style={{ 
                      fontSize: "12px", 
                      fontWeight: "600",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      color: "var(--text-primary)"
                    }}>
                      {q.marks} marks
                    </span>
                  </div>
                  
                  <div 
                    style={{ 
                      fontSize: "14px", 
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      marginBottom: "12px"
                    }}
                    className="question-content"
                    dangerouslySetInnerHTML={{ __html: q.text }}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    {/* Medha, solve it button */}
                    <button
                      onClick={(e) => handleSolve(e, q, idx)}
                      disabled={loadingIdx === idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#fff",
                        background: solutions[idx] 
                          ? "linear-gradient(135deg, #10b981, #059669)" 
                          : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                        border: "none",
                        borderRadius: "20px",
                        cursor: loadingIdx === idx ? "wait" : "pointer",
                        transition: "all 0.2s ease",
                        opacity: loadingIdx === idx ? 0.7 : 1,
                      }}
                    >
                      {loadingIdx === idx ? (
                        <>
                          <FaSpinner className="animate-spin" /> Solving...
                        </>
                      ) : solutions[idx] ? (
                        <>
                          <FaEye /> View Solution
                        </>
                      ) : (
                        <>
                          <FaMagic /> Medha, solve it
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution Modal */}
      <AnimatePresence>
        {viewingIdx !== null && solutions[viewingIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSolution}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "16px",
                maxWidth: "800px",
                width: "100%",
                maxHeight: "80vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--accent-secondary)",
              }}
            >
              {/* Modal Header */}
              <div 
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))",
                }}
              >
                <div>
                  <h3 style={{ 
                    fontSize: "18px", 
                    fontWeight: "700", 
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <FaMagic style={{ color: "#8b5cf6" }} />
                    Medha AI Solution
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {subjectName} • Unit {unitSerial}
                  </p>
                </div>
                <button
                  onClick={closeSolution}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                  }}
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div 
                style={{
                  padding: "20px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <div 
                  className="prose prose-invert max-w-none solution-content"
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.8",
                    color: "var(--text-primary)",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({node, ...props}) => <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "var(--action-primary)" }} {...props} />,
                      h2: ({node, ...props}) => <h2 style={{ fontSize: "20px", fontWeight: "600", marginTop: "20px", marginBottom: "12px", color: "var(--text-primary)" }} {...props} />,
                      h3: ({node, ...props}) => <h3 style={{ fontSize: "17px", fontWeight: "600", marginTop: "16px", marginBottom: "8px", color: "var(--text-primary)" }} {...props} />,
                      p: ({node, ...props}) => <p style={{ marginBottom: "12px" }} {...props} />,
                      ul: ({node, ...props}) => <ul style={{ marginBottom: "12px", paddingLeft: "20px", listStyleType: "disc" }} {...props} />,
                      ol: ({node, ...props}) => <ol style={{ marginBottom: "12px", paddingLeft: "20px", listStyleType: "decimal" }} {...props} />,
                      li: ({node, ...props}) => <li style={{ marginBottom: "6px" }} {...props} />,
                      strong: ({node, ...props}) => <strong style={{ color: "#a78bfa", fontWeight: "600" }} {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline ? (
                          <code style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "14px" }} {...props} />
                        ) : (
                          <code style={{ display: "block", backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", fontSize: "13px", overflowX: "auto", whiteSpace: "pre-wrap" }} {...props} />
                        ),
                      pre: ({node, ...props}) => <pre style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", marginBottom: "12px", overflowX: "auto" }} {...props} />,
                      // Table styling
                      table: ({node, ...props}) => (
                        <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }} {...props} />
                        </div>
                      ),
                      thead: ({node, ...props}) => <thead style={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }} {...props} />,
                      th: ({node, ...props}) => <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid rgba(255,255,255,0.2)", color: "var(--text-primary)" }} {...props} />,
                      td: ({node, ...props}) => <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }} {...props} />,
                      tr: ({node, ...props}) => <tr style={{ transition: "background 0.2s" }} {...props} />,
                      // Sub/superscript
                      sub: ({node, ...props}) => <sub style={{ fontSize: "0.75em", verticalAlign: "sub" }} {...props} />,
                      sup: ({node, ...props}) => <sup style={{ fontSize: "0.75em", verticalAlign: "super" }} {...props} />,
                      // Blockquote
                      blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: "3px solid #8b5cf6", paddingLeft: "16px", marginLeft: "0", fontStyle: "italic", color: "var(--text-secondary)" }} {...props} />,
                    }}
                  >
                    {solutions[viewingIdx]}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UnitWeightageBar;
