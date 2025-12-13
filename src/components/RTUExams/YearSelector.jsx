import React from "react";
import { motion } from "framer-motion";
import Card from "../Common/Card";
import { FaCalendarAlt } from "react-icons/fa";

/**
 * YearSelector - Displays available years as selectable cards
 * @param {Object} props
 * @param {number[]} props.years - Array of available years
 * @param {number|null} props.selectedYear - Currently selected year
 * @param {function} props.onYearSelect - Callback when a year is selected
 * @param {boolean} props.loading - Loading state
 */
const YearSelector = ({ years, selectedYear, onYearSelect, loading }) => {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--accent-secondary)",
            borderTopColor: "var(--action-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!years || years.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "var(--text-secondary)",
        }}
      >
        No exam papers available for this subject yet.
      </div>
    );
  }

  return (
    <div className="year-selector">
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "var(--text-primary)",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        Select Exam Year
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {years.map((year, index) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              onClick={() => onYearSelect(year)}
              hoverEffect={true}
              className="cursor-pointer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
                gap: "8px",
                border:
                  selectedYear === year
                    ? "2px solid var(--action-primary)"
                    : undefined,
              }}
            >
              <FaCalendarAlt
                style={{
                  fontSize: "24px",
                  color: "var(--action-primary)",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                }}
              >
                {year}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}
              >
                RTU Paper
              </span>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;
