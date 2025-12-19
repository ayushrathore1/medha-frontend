import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaQuoteLeft } from "react-icons/fa";

const DailyQuoteWidget = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/quote`
      );
      setQuote(res.data);
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      // Fallback quote
      setQuote({
        quote: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King",
        source: null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-4 flex justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full mb-6"
    >
      <div className="relative px-6 py-5 bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 rounded-2xl border border-indigo-100/50 shadow-sm overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex items-start gap-4">
          {/* Quote Icon */}
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-200/50">
            <FaQuoteLeft className="text-white text-lg" />
          </div>
          
          {/* Quote Content */}
          <div className="flex-1 min-w-0">
            <p className="text-slate-700 font-medium text-base md:text-lg leading-relaxed italic">
              "{quote.quote}"
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-bold text-indigo-600">
                — {quote.author}
              </span>
              {quote.source && (
                <span className="text-xs text-slate-400 font-medium">
                  ({quote.source})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyQuoteWidget;
