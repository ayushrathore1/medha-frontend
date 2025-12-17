import React from "react";
import { motion } from "framer-motion";
import Card from "../Common/Card";
import Loader from "../Common/Loader";
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
    return <div className="flex justify-center py-20 px-8"><Loader /></div>;
  }

  if (!years || years.length === 0) {
    return (
      <div className="text-center py-20 px-8">
        <div className="flex justify-center mb-4 text-slate-300 text-4xl">
          <FaCalendarAlt />
        </div>
        <p className="text-lg font-bold text-slate-500">
          No exam papers available for this subject yet.
        </p>
        <p className="text-slate-400">Check back later or contact admin.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
        Select Exam Year
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {years.map((year, index) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              onClick={() => onYearSelect(year)}
              className={`cursor-pointer flex flex-col items-center justify-center p-6 gap-3 transition-all hover:border-indigo-400 hover:shadow-lg ${selectedYear === year ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50' : 'bg-white'}`}
            >
              <div className={`p-3 rounded-full ${selectedYear === year ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                <FaCalendarAlt size={24} />
              </div>
              <div className="text-3xl font-black text-slate-800">
                {year}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
