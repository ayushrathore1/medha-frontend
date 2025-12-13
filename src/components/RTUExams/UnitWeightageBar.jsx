import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBarGradient } from "../../utils/unitWeightageUtils";
import { FaYoutube, FaChevronDown, FaChevronUp } from "react-icons/fa";

/**
 * UnitWeightageBar - Visual bar component for unit weightage
 * @param {Object} props
 * @param {number} props.unitSerial - Unit number (1-5)
 * @param {string} props.unitName - Unit title
 * @param {number} props.totalMarks - Total marks for this unit
 * @param {number} props.weightagePercentage - Percentage of total (0-100)
 * @param {number} props.weightageRatio - Ratio of total (0-1)
 * @param {string} props.youtubePlaylistUrl - YouTube playlist URL for lectures
 * @param {Array} props.questions - List of questions for this unit
 * @param {number} props.index - Animation index for staggered entrance
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // For visual bar width, use percentage value (0-100)
  // Cap at 100% max just in case
  const barWidth = Math.min(weightagePercentage, 100);

  // Handle Watch Lecture button click - opens in new tab (or YouTube app on mobile)
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="unit-weightage-bar element-hover" // element-hover for hover effect
      onClick={toggleExpand}
      style={{
        padding: "16px",
        marginBottom: "16px",
        borderRadius: "16px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--accent-secondary)",
        cursor: questions.length > 0 ? "pointer" : "default",
        position: "relative",
        overflow: "hidden", // Ensure content doesn't spill out
      }}
    >
      {/* Main Content Row */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Header Row: Unit Name, Badge, Watch Button, Chevron */}
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
               {/* Marks Badge */}
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
              
              {/* Watch Lecture Button */}
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

          {/* Chevron Indicator */}
          {questions.length > 0 && (
            <div 
              style={{ 
                color: "var(--text-secondary)",
                marginTop: "4px"
              }}
            >
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
                      lineHeight: "1.6"
                    }}
                    className="question-content"
                    dangerouslySetInnerHTML={{ __html: q.text }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default UnitWeightageBar;

