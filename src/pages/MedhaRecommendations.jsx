import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Play,
  ExternalLink,
  ThumbsUp,
  Eye,
  Clock,
  Star,
  TrendingUp,
  BookOpen,
  ChevronDown,
  Shield,
  Zap,
  Filter,
  Loader2,
  AlertCircle,
  Youtube,
  GraduationCap,
  Lightbulb,
  CheckCircle,
  Brain,
  FileText,
} from "lucide-react";
import api from "../api/api";

// ─── Score Circle SVG ───────────────────────────────────────
const ScoreCircle = ({ score, size = 48 }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.3,
          fontWeight: 700,
          color: getColor(),
        }}
      >
        {score}
      </span>
    </div>
  );
};

// ─── Video Card ─────────────────────────────────────────────
const VideoCard = ({ video, index, isTopPick }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="lecture-video-card"
      style={{
        background: isTopPick
          ? "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))"
          : "rgba(255,255,255,0.03)",
        border: isTopPick
          ? "1px solid rgba(34,197,94,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        gap: "16px",
        position: "relative",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.2)" }}
      onClick={() =>
        window.open(
          `https://youtube.com/watch?v=${video.videoId}`,
          "_blank"
        )
      }
    >
      {isTopPick && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "16px",
            background: "linear-gradient(135deg, #22c55e, #10b981)",
            color: "#fff",
            padding: "3px 12px",
            borderRadius: "100px",
            fontSize: "11px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
          }}
        >
          <Star size={12} /> TOP PICK
        </div>
      )}

      {/* Thumbnail */}
      <div style={{ flexShrink: 0, width: "180px", position: "relative" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        {video.duration && (
          <span
            style={{
              position: "absolute",
              bottom: "6px",
              right: "6px",
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {video.duration}
          </span>
        )}
        {video.isTrustedChannel && (
          <span
            style={{
              position: "absolute",
              top: "6px",
              left: "6px",
              background: "rgba(34,197,94,0.9)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Shield size={10} /> Verified
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#f1f5f9",
            marginBottom: "4px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          {video.title}
        </h4>
        <p
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginBottom: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Youtube size={12} /> {video.channelTitle || video.channelName}
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: "11px",
            color: "#64748b",
            marginBottom: "8px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <Eye size={11} /> {formatNumber(video.viewCount)}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <ThumbsUp size={11} /> {formatNumber(video.likeCount)}
          </span>
        </div>

        {/* AI explanation */}
        {video.explanation && (
          <p
            style={{
              fontSize: "11px",
              color: "#a78bfa",
              fontStyle: "italic",
              marginBottom: "6px",
              lineHeight: 1.4,
            }}
          >
            <Sparkles
              size={11}
              style={{ display: "inline", marginRight: "4px" }}
            />
            {video.explanation}
          </p>
        )}

        {/* Matched topics */}
        {video.matchedTopics?.length > 0 && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {video.matchedTopics.slice(0, 3).map((t, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(139,92,246,0.15)",
                  color: "#a78bfa",
                  padding: "2px 8px",
                  borderRadius: "100px",
                  fontSize: "10px",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Score */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <ScoreCircle score={video.aiScore || 0} />
        <span style={{ fontSize: "9px", color: "#64748b", fontWeight: 500 }}>
          RELEVANCE
        </span>
      </div>
    </motion.div>
  );
};

// ─── GFG Card ───────────────────────────────────────────────
const GfgCard = ({ article, index }) => (
  <motion.a
    href={article.link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    style={{
      display: "flex",
      gap: "12px",
      padding: "14px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      textDecoration: "none",
      transition: "all 0.3s ease",
      alignItems: "center",
    }}
    whileHover={{ borderColor: "rgba(34,197,94,0.3)", y: -1 }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #22c55e, #10b981)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <FileText size={18} color="#fff" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#e2e8f0",
          marginBottom: "3px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {article.title}
      </h4>
      <p
        style={{
          fontSize: "11px",
          color: "#64748b",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.snippet}
      </p>
      {article.explanation && (
        <p
          style={{
            fontSize: "10px",
            color: "#a78bfa",
            fontStyle: "italic",
            marginTop: "3px",
          }}
        >
          <Sparkles size={10} style={{ display: "inline", marginRight: "3px" }} />
          {article.explanation}
        </p>
      )}
    </div>
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
      <ScoreCircle score={article.aiScore || 0} size={36} />
      <ExternalLink size={14} color="#64748b" />
    </div>
  </motion.a>
);

// ─── Loading Steps ──────────────────────────────────────────
const LoadingSteps = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Search, text: "Searching approved channels…", color: "#3b82f6" },
    { icon: Youtube, text: "Fetching YouTube results…", color: "#ef4444" },
    { icon: BookOpen, text: "Loading syllabus context…", color: "#eab308" },
    { icon: Brain, text: "AI scoring against syllabus…", color: "#a78bfa" },
    { icon: Sparkles, text: "Ranking & preparing results…", color: "#22c55e" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <Loader2
        size={40}
        style={{ color: "#a78bfa", animation: "spin 1s linear infinite" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "320px" }}>
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: isDone || isActive ? 1 : 0.3,
                x: isActive ? 8 : 0,
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: isDone ? "#22c55e" : isActive ? s.color : "#475569",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {isDone ? (
                <CheckCircle size={16} color="#22c55e" />
              ) : (
                <Icon
                  size={16}
                  style={
                    isActive
                      ? { animation: "pulse 1.5s ease-in-out infinite" }
                      : {}
                  }
                />
              )}
              {s.text}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Page Component ────────────────────────────────────
export default function MedhaRecommendations() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [trending, setTrending] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const inputRef = useRef(null);

  // Fetch subjects + trending on mount
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [subRes, trendRes] = await Promise.all([
          api.get("/recommendations/subjects").catch(() => ({ data: { subjects: [] } })),
          api.get("/recommendations/trending").catch(() => ({ data: { topics: [] } })),
        ]);
        setSubjects(subRes.data.subjects || []);
        setTrending(trendRes.data.topics || []);
      } catch {
        // Silently fail
      }
    };
    fetchInit();
  }, []);

  // Fetch units when subject changes
  useEffect(() => {
    if (!subject) {
      setUnits([]);
      setUnit("");
      return;
    }
    const fetchUnits = async () => {
      try {
        const res = await api.get(
          `/recommendations/units/${encodeURIComponent(subject)}`
        );
        setUnits(res.data.units || []);
      } catch {
        setUnits([]);
      }
    };
    fetchUnits();
  }, [subject]);

  // Search handler
  const handleSearch = async (searchTopic) => {
    const q = (searchTopic || topic).trim();
    if (q.length < 2) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await api.post("/recommendations/search", {
        topic: q,
        subject,
        unit,
      });
      setResults(res.data.data);
      setTab("all");
    } catch (err) {
      setError(
        err.response?.data?.message || "Search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Filter results by tab
  const displayYT = results?.youtube || [];
  const displayGfg = results?.gfg || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
        padding: "24px",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .lecture-video-card:hover {
          background: rgba(255,255,255,0.06) !important;
        }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #a78bfa, #22c55e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            <GraduationCap
              size={28}
              style={{ display: "inline", marginRight: "8px", color: "#a78bfa" }}
            />
            Smart Lecture Finder
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            AI-curated lectures from approved channels, scored against your
            syllabus
          </p>
        </motion.div>

        {/* Subject & Unit Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: subjects.length > 0 ? "1fr 1fr" : "1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {subjects.length > 0 && (
            <div style={{ position: "relative" }}>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} (Sem {s.semester})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}

          {units.length > 0 && (
            <div style={{ position: "relative" }}>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">All Units</option>
                {units.map((u) => (
                  <option key={u.unitNumber} value={u.title}>
                    Unit {u.unitNumber}: {u.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any topic — e.g. 'SQL Joins', 'Binary Trees', 'ER Model'"
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e2e8f0",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(167,139,250,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || topic.trim().length < 2}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background:
                loading || topic.trim().length < 2
                  ? "rgba(139,92,246,0.2)"
                  : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor:
                loading || topic.trim().length < 2
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
              opacity: loading || topic.trim().length < 2 ? 0.5 : 1,
            }}
          >
            {loading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Sparkles size={16} />
            )}
            Search
          </button>
        </motion.div>

        {/* Topic chips from syllabus units or trending */}
        {!results && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "24px" }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#475569",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <TrendingUp size={12} />
              {units.length > 0 ? "Topics from syllabus:" : "Trending searches:"}
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(units.length > 0
                ? units.flatMap((u) => u.topics.slice(0, 2))
                : trending
              )
                .slice(0, 12)
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTopic(t);
                      handleSearch(t);
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "100px",
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#a78bfa",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(139,92,246,0.2)";
                      e.target.style.borderColor = "rgba(139,92,246,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(139,92,246,0.1)";
                      e.target.style.borderColor = "rgba(139,92,246,0.2)";
                    }}
                  >
                    {t}
                  </button>
                ))}
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && <LoadingSteps />}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#fca5a5",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Results */}
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Study tip */}
            {results.studyTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,197,94,0.05))",
                  border: "1px solid rgba(139,92,246,0.2)",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <Lightbulb
                  size={18}
                  style={{ color: "#eab308", flexShrink: 0, marginTop: "1px" }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#a78bfa",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    AI Study Tip
                  </span>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#cbd5e1",
                      marginTop: "4px",
                      lineHeight: 1.5,
                    }}
                  >
                    {results.studyTip}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tab filter + result count */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { key: "all", label: "All", count: displayYT.length + displayGfg.length },
                  { key: "youtube", label: "YouTube", count: displayYT.length },
                  { key: "gfg", label: "GFG", count: displayGfg.length },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "100px",
                      background:
                        tab === t.key
                          ? "rgba(139,92,246,0.2)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        tab === t.key
                          ? "1px solid rgba(139,92,246,0.4)"
                          : "1px solid rgba(255,255,255,0.08)",
                      color: tab === t.key ? "#a78bfa" : "#64748b",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t.label}{" "}
                    <span style={{ opacity: 0.6, fontSize: "11px" }}>
                      ({t.count})
                    </span>
                  </button>
                ))}
              </div>
              {results.channelsUsed?.length > 0 && (
                <span style={{ fontSize: "11px", color: "#475569" }}>
                  {results.channelsUsed.length} channels searched
                </span>
              )}
            </div>

            {/* YouTube results */}
            {(tab === "all" || tab === "youtube") && displayYT.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                {tab === "all" && (
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#94a3b8",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Youtube size={16} color="#ef4444" /> YouTube Lectures
                  </h3>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {displayYT.map((video, i) => (
                    <VideoCard
                      key={video.videoId}
                      video={video}
                      index={i}
                      isTopPick={
                        results.topPick === `YT_${i}` ||
                        (i === 0 && !results.topPick?.startsWith("GFG"))
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* GFG results */}
            {(tab === "all" || tab === "gfg") && displayGfg.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                {tab === "all" && (
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#94a3b8",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <BookOpen size={16} color="#22c55e" /> GeeksforGeeks Articles
                  </h3>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {displayGfg.map((article, i) => (
                    <GfgCard key={i} article={article} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {displayYT.length === 0 && displayGfg.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  color: "#475569",
                }}
              >
                <Search size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontSize: "14px" }}>
                  No results found. Try a different topic or subject.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Initial empty state */}
        {!results && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#334155",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,197,94,0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <GraduationCap size={36} style={{ color: "#7c3aed" }} />
            </div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
              Search for any engineering topic
            </p>
            <p style={{ fontSize: "12px", color: "#475569" }}>
              Select a subject to get syllabus-matched results, or search
              directly
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
