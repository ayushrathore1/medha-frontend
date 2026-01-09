/**
 * MedhaAnimationViewer - "The Compiler's Atelier" (Apple Edition)
 * True Black. High Contrast. Precision.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaMicrophone,
  FaStickyNote,
  FaEyeSlash,
  FaEye,
  FaFilePdf,
  FaEdit,
  FaUpload,
  FaList,
  FaArrowLeft,
  FaGlobe,
} from "react-icons/fa";
import { getAnimation } from "./animations";
import SlideNoteCard from "./animations/SlideNoteCard";
import CinematicIntro from "./animations/CinematicIntro";
import VoiceChatbot from "./animations/VoiceChatbot";

const APPLE_THEME = {
  bg: "#000000",
  surface: "#1c1c1e", // Apple Dark Gray
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#0A84FF", // System Blue
  text: "#F5F5F7",
  textSec: "#86868B",
  success: "#30D158",
  danger: "#FF453A",
};

const MedhaAnimationViewer = ({
  animationId,
  contentId,
  title,
  isOpen,
  onClose,
  totalSteps: propTotalSteps,
  audioHindiUrl: initialAudioHindi,
  audioEnglishUrl: initialAudioEnglish,
  isAdmin = false,
  isTeam = false,
}) => {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const voiceNoteRef = useRef(null);

  // Animation Data
  const animation = getAnimation(animationId);
  const rawSteps = animation?.AnimationSteps || [];
  const normalizedSteps = rawSteps.map((s) =>
    s.component ? s : { component: s, title: "Step" }
  );
  const totalSteps = normalizedSteps.length;

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [showNoteCard, setShowNoteCard] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showGlobalUpload, setShowGlobalUpload] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(true); // User can hide/show notes
  const [showFullscreenNote, setShowFullscreenNote] = useState(false); // Premium fullscreen view

  const [slideData, setSlideData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pending global audio files for upload
  const [pendingHindiFile, setPendingHindiFile] = useState(null);
  const [pendingEnglishFile, setPendingEnglishFile] = useState(null);

  // Update state when props change
  const [audioHindiUrl, setAudioHindiUrl] = useState(initialAudioHindi);
  const [audioEnglishUrl, setAudioEnglishUrl] = useState(initialAudioEnglish);

  useEffect(() => {
    setAudioHindiUrl(initialAudioHindi);
    setAudioEnglishUrl(initialAudioEnglish);
  }, [initialAudioHindi, initialAudioEnglish]);

  // Fetch audio URLs from backend if not provided via props (happens on refresh)
  useEffect(() => {
    if (!isOpen || !animationId) return;
    // Skip if we already have audio URLs from props
    if (initialAudioHindi || initialAudioEnglish) return;

    const fetchAudioUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(
          `${baseUrl}/api/learn/animation/${animationId}/audio`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data.success) {
          if (res.data.audioHindiUrl) setAudioHindiUrl(res.data.audioHindiUrl);
          if (res.data.audioEnglishUrl)
            setAudioEnglishUrl(res.data.audioEnglishUrl);
        }
      } catch (error) {
        // Content may not exist yet, that's okay
        console.log("No audio data found for animation:", animationId);
      }
    };
    fetchAudioUrls();
  }, [isOpen, animationId, initialAudioHindi, initialAudioEnglish]);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLang, setAudioLang] = useState("hindi");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showAudioHint, setShowAudioHint] = useState(false);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const canEdit = isAdmin || isTeam;
  const hasAudio = audioHindiUrl || audioEnglishUrl;
  const currentAudioUrl =
    audioLang === "hindi" ? audioHindiUrl : audioEnglishUrl;

  // Keyboard Controls
  useEffect(() => {
    if (!isOpen || showIntro) return; // Disable controls during intro

    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case " ":
          e.preventDefault();
          if (hasAudio) {
            setIsPlaying((prev) => !prev);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrev();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (hasAudio) {
            setPlaybackSpeed((prev) => Math.min(prev + 0.25, 2));
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (hasAudio) {
            setPlaybackSpeed((prev) => Math.max(prev - 0.25, 0.5));
          }
          break;
        case "Escape":
          e.preventDefault();
          // Close fullscreen note first, then main viewer
          if (showFullscreenNote) {
            setShowFullscreenNote(false);
          } else {
            onClose();
          }
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case "m":
        case "M":
          e.preventDefault();
          if (hasAudio) {
            setAudioLang((prev) => (prev === "hindi" ? "english" : "hindi"));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    showIntro,
    currentStep,
    totalSteps,
    hasAudio,
    showFullscreenNote,
  ]);

  // Content ID state for when we auto-create content
  const [localContentId, setLocalContentId] = useState(contentId);

  useEffect(() => {
    setLocalContentId(contentId);
  }, [contentId]);

  // Fetch slide data - try by contentId first, then by animationId
  useEffect(() => {
    if (!isOpen) return;

    const fetchSlideData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        if (localContentId) {
          // Fetch by contentId
          const res = await axios.get(
            `${baseUrl}/api/learn/${localContentId}/slides`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) setSlideData(res.data.slideData || []);
        } else if (animationId) {
          // Fetch by animationId
          const res = await axios.get(
            `${baseUrl}/api/learn/animation/${animationId}/slides`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          if (res.data.success) {
            setSlideData(res.data.slideData || []);
            if (res.data.contentId) setLocalContentId(res.data.contentId);
          }
        }
      } catch (error) {
        console.error("Error fetching slide data:", error);
      }
    };
    fetchSlideData();
  }, [isOpen, localContentId, animationId]);

  // Voice note auto-play (Slide Level)
  useEffect(() => {
    // Only play slide audio if Global Audio is NOT playing or available?
    // Usually Global Audio replaces per-slide audio.
    // Let's assume slide audio plays if Global Audio is not playing.
    if (!isPlaying) {
      const data = slideData.find((s) => s.stepNumber === currentStep);
      if (data?.voiceNoteUrl && voiceNoteRef.current) {
        voiceNoteRef.current.src = data.voiceNoteUrl;
        voiceNoteRef.current.play().catch(console.error);
      }
    }
  }, [currentStep, slideData, isPlaying]);

  // Global audio playback control
  useEffect(() => {
    if (!audioRef.current || !currentAudioUrl) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentAudioUrl]);

  // Update playback speed when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Show audio hint after intro completes
  useEffect(() => {
    if (!showIntro && hasAudio) {
      setShowAudioHint(true);
      const timer = setTimeout(() => setShowAudioHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showIntro, hasAudio]);

  // Navigation
  // Wrap in useCallback to use in useEffect
  const goToStep = useCallback(
    (step) => {
      if (step >= 1 && step <= totalSteps) {
        const data = slideData.find((s) => s.stepNumber === step);
        if (canEdit || !data?.isHidden) setCurrentStep(step);
      }
    },
    [totalSteps, slideData, canEdit]
  );

  const handleNext = () =>
    goToStep(currentStep < totalSteps ? currentStep + 1 : currentStep);
  const handlePrev = () =>
    goToStep(currentStep > 1 ? currentStep - 1 : currentStep);

  // Global Audio Upload
  const handleGlobalUpload = async (file, language) => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    if (!animationId) {
      alert("Cannot upload: No animation ID available.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("audioFile", file);
      formData.append("language", language);

      let res;

      if (contentId) {
        // Use existing content endpoint
        res = await axios.post(
          `${baseUrl}/api/learn/${contentId}/global-voice`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Use animation-based endpoint (auto-creates content if needed)
        formData.append("animationId", animationId);
        formData.append("title", title || animationId);
        formData.append("totalSteps", totalSteps);

        res = await axios.post(
          `${baseUrl}/api/learn/animation/global-voice`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (res.data.success) {
        if (language === "hindi") {
          setAudioHindiUrl(res.data.audioUrl);
          setPendingHindiFile(null);
        } else {
          setAudioEnglishUrl(res.data.audioUrl);
          setPendingEnglishFile(null);
        }
        alert("Audio uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Admin Functions
  const handleVoiceUpload = async (file) => {
    if (!contentId || !file) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("voiceNote", file);

      const res = await axios.post(
        `${baseUrl}/api/learn/${contentId}/slide/${currentStep}/voice`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setSlideData((prev) => {
          const newData = [...prev];
          const idx = newData.findIndex((s) => s.stepNumber === currentStep);
          if (idx >= 0) {
            newData[idx] = {
              ...newData[idx],
              voiceNoteUrl: res.data.voiceNoteUrl,
            };
          } else {
            newData.push({
              stepNumber: currentStep,
              voiceNoteUrl: res.data.voiceNoteUrl,
            });
          }
          return newData;
        });
        alert("Voice note uploaded!");
      }
    } catch (err) {
      console.error("Voice upload error:", err);
      alert("Upload failed");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) =>
        chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-step-${currentStep}.webm`, {
          type: "audio/webm",
        });
        await handleVoiceUpload(file);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleVisibility = async () => {
    if (!localContentId && !animationId) return;
    const currentSlideData =
      slideData.find((s) => s.stepNumber === currentStep) || {};
    const newHiddenState = !currentSlideData.isHidden;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      let res;
      if (localContentId) {
        res = await axios.patch(
          `${baseUrl}/api/learn/${localContentId}/slide/${currentStep}`,
          { isHidden: newHiddenState },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.patch(
          `${baseUrl}/api/learn/animation/${animationId}/slide/${currentStep}`,
          { isHidden: newHiddenState, title, totalSteps },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.contentId) setLocalContentId(res.data.contentId);
      }

      setSlideData((prev) => {
        const newData = [...prev];
        const idx = newData.findIndex((s) => s.stepNumber === currentStep);
        if (idx >= 0) {
          newData[idx] = { ...newData[idx], isHidden: newHiddenState };
        } else {
          newData.push({ stepNumber: currentStep, isHidden: newHiddenState });
        }
        return newData;
      });
    } catch (err) {
      console.error("Toggle visibility error:", err);
    }
  };

  const handleSaveNote = async (noteData) => {
    if (!localContentId && !animationId) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      let res;
      if (localContentId) {
        res = await axios.patch(
          `${baseUrl}/api/learn/${localContentId}/slide/${currentStep}`,
          { notes: noteData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.patch(
          `${baseUrl}/api/learn/animation/${animationId}/slide/${currentStep}`,
          { notes: noteData, title, totalSteps },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.contentId) setLocalContentId(res.data.contentId);
      }

      setSlideData((prev) => {
        const newData = [...prev];
        const idx = newData.findIndex((s) => s.stepNumber === currentStep);
        if (idx >= 0) {
          newData[idx] = { ...newData[idx], notes: noteData };
        } else {
          newData.push({ stepNumber: currentStep, notes: noteData });
        }
        return newData;
      });
      setShowNoteCard(false);
    } catch (err) {
      console.error("Save note error:", err);
    }
  };

  const handleNoteImageUpload = async (file) => {
    if (!contentId || !file) return null;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `${baseUrl}/api/learn/${contentId}/slide/${currentStep}/note-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.success ? res.data.imageUrl : null;
    } catch (err) {
      console.error("Image upload error:", err);
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

      for (let i = 1; i <= totalSteps; i++) {
        const data = slideData.find((s) => s.stepNumber === i);
        if (data?.isHidden) continue;
        if (i > 1) pdf.addPage();

        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, w, h, "F");

        pdf.setTextColor(10, 132, 255);
        pdf.setFontSize(24);
        pdf.text(`Step ${i}`, 20, 30);

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.text(title, 20, 45);

        if (data?.notes?.content) {
          pdf.setTextColor(200, 200, 200);
          const lines = pdf.splitTextToSize(data.notes.content, w - 40);
          pdf.text(lines, 20, 60);
        }
      }
      pdf.save(`${title.replace(/\s+/g, "_")}_Notes.pdf`);
    } catch (e) {
      console.error("PDF generation error:", e);
    }
    setLoading(false);
  };

  if (!isOpen || !animation) return null;
  const currentStepObj = normalizedSteps[currentStep - 1] || {};
  const CurrentStepComponent = currentStepObj.component;
  const currentData = slideData.find((s) => s.stepNumber === currentStep) || {};

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex flex-col font-sans"
      style={{ background: APPLE_THEME.bg, color: APPLE_THEME.textSec }}
    >
      <audio ref={voiceNoteRef} className="hidden" />

      {/* CINEMATIC INTRO */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            title={title}
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* AUDIO FEATURE HINT - Shows after intro */}
      <AnimatePresence>
        {showAudioHint && hasAudio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaPlay className="text-blue-400" size={14} />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">
                    🎧 Audio Available
                  </div>
                  <div className="text-gray-400 text-xs">
                    Control with keyboard shortcuts
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    Space
                  </kbd>
                  <span className="text-gray-400">Play / Pause</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    M
                  </kbd>
                  <span className="text-gray-400">Toggle HI/EN</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    ↑
                  </kbd>
                  <span className="text-gray-400">Speed Up</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    ↓
                  </kbd>
                  <span className="text-gray-400">Speed Down</span>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🍎 TOP BAR (Transparent, Glassy) */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <FaTimes />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            <span className="text-white font-medium tracking-wide text-sm">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasAudio && (
            <div className="flex items-center gap-1 bg-[#1c1c1e] rounded-full px-3 py-1 border border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-blue-400 hover:text-blue-300 p-1"
                title="Space to play/pause"
              >
                {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
              </button>
              <div className="w-px h-3 bg-white/10 mx-1" />
              {/* Speed Control */}
              <button
                onClick={() =>
                  setPlaybackSpeed((prev) => Math.max(prev - 0.25, 0.5))
                }
                className="text-gray-400 hover:text-white text-[10px] font-bold px-1"
                title="↓ to decrease speed"
              >
                −
              </button>
              <span className="text-[10px] font-bold text-blue-400 min-w-[28px] text-center">
                {playbackSpeed}x
              </span>
              <button
                onClick={() =>
                  setPlaybackSpeed((prev) => Math.min(prev + 0.25, 2))
                }
                className="text-gray-400 hover:text-white text-[10px] font-bold px-1"
                title="↑ to increase speed"
              >
                +
              </button>
              <div className="w-px h-3 bg-white/10 mx-1" />
              <button
                onClick={() => setAudioLang("hindi")}
                className={`text-[10px] font-bold ${audioLang === "hindi" ? "text-white" : "text-gray-500"}`}
                title="M to toggle language"
              >
                HI
              </button>
              <button
                onClick={() => setAudioLang("english")}
                className={`text-[10px] font-bold ${audioLang === "english" ? "text-white" : "text-gray-500"}`}
                title="M to toggle language"
              >
                EN
              </button>
              <audio
                ref={audioRef}
                src={currentAudioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}

          {canEdit && (
            <>
              <button
                onClick={() => setShowGlobalUpload(!showGlobalUpload)}
                className={`p-2 rounded-full transition-all ${showGlobalUpload ? "bg-blue-500 text-white" : "hover:bg-white/10 text-gray-400"}`}
                title="Upload Global Audio"
              >
                <FaGlobe size={14} />
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`p-2 rounded-full transition-all ${editMode ? "bg-purple-500 text-white" : "hover:bg-white/10 text-gray-400"}`}
              >
                <FaEdit size={14} />
              </button>
            </>
          )}

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-full transition-colors ${showSidebar ? "bg-white/10 text-white" : "hover:bg-white/10 text-gray-400"}`}
          >
            <FaList size={14} />
          </button>
        </div>
      </header>

      {/* Global Upload Popup */}
      {showGlobalUpload && (
        <div className="absolute top-16 right-20 z-50 bg-[#1c1c1e] border border-white/10 rounded-xl p-5 shadow-2xl w-80">
          <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
            <FaGlobe className="text-blue-400" />
            Global Voice Note
          </h3>
          <div className="space-y-4">
            {/* Hindi Audio */}
            <div className="bg-black/30 rounded-lg p-3">
              <label className="text-xs text-gray-400 block mb-2 font-medium">
                Hindi Audio
              </label>
              {audioHindiUrl && !pendingHindiFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/20">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <span className="text-xs text-green-400 flex-1">
                      Audio uploaded
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const audioPreview = new Audio(audioHindiUrl);
                        audioPreview.play();
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <FaPlay size={8} /> Preview
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1">
                      <FaEdit size={10} /> Change
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => setPendingHindiFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-white text-xs w-full mb-2"
                    onChange={(e) => setPendingHindiFile(e.target.files[0])}
                  />
                  {pendingHindiFile && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400 truncate flex-1">
                        {pendingHindiFile.name}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setPendingHindiFile(null)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleGlobalUpload(pendingHindiFile, "hindi")
                          }
                          disabled={loading}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                        >
                          {loading ? "..." : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* English Audio */}
            <div className="bg-black/30 rounded-lg p-3">
              <label className="text-xs text-gray-400 block mb-2 font-medium">
                English Audio
              </label>
              {audioEnglishUrl && !pendingEnglishFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/20">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <span className="text-xs text-green-400 flex-1">
                      Audio uploaded
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const audioPreview = new Audio(audioEnglishUrl);
                        audioPreview.play();
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <FaPlay size={8} /> Preview
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1">
                      <FaEdit size={10} /> Change
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) =>
                          setPendingEnglishFile(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-white text-xs w-full mb-2"
                    onChange={(e) => setPendingEnglishFile(e.target.files[0])}
                  />
                  {pendingEnglishFile && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400 truncate flex-1">
                        {pendingEnglishFile.name}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setPendingEnglishFile(null)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleGlobalUpload(pendingEnglishFile, "english")
                          }
                          disabled={loading}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                        >
                          {loading ? "..." : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setShowGlobalUpload(false);
                setPendingHindiFile(null);
                setPendingEnglishFile(null);
              }}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🍎 MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* ... Sidebar and Stage Implementation (Keep Existing Logic, mainly just added keyboard listener context to stage) ... */}
        {/* SIDEBAR (Navigator) */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-white/5 bg-[#000000] flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Outline
                </span>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FaArrowLeft size={10} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {normalizedSteps.map((step, i) => {
                  const stepNum = i + 1;
                  const sData = slideData.find((s) => s.stepNumber === stepNum);
                  const isHidden = sData?.isHidden;
                  const isActive = currentStep === stepNum;

                  if (isHidden && !canEdit) return null;

                  return (
                    <button
                      key={i}
                      onClick={() => goToStep(stepNum)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all duration-200 ${
                        isActive
                          ? "bg-[#1c1c1e] text-white shadow-lg"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-blue-500" : "text-gray-600"}`}
                        >
                          Step {String(stepNum).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium">
                          {step.title || `Scene ${stepNum}`}
                        </span>
                      </div>
                      {sData?.notes?.content && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(191,90,242,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* STAGE */}
        <main className="flex-1 relative flex flex-col bg-black">
          {/* Edit Controls */}
          {editMode && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex gap-1 shadow-2xl">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-all ${isRecording ? "bg-red-500 text-white" : "hover:bg-white/10 text-white"}`}
              >
                <FaMicrophone />
              </button>
              <label className="p-3 rounded-full hover:bg-white/10 cursor-pointer text-white">
                <FaUpload />
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleVoiceUpload(e.target.files[0])}
                />
              </label>
              <button
                onClick={() => setShowNoteCard(true)}
                className="p-3 rounded-full hover:bg-white/10 text-purple-400"
              >
                <FaStickyNote />
              </button>
              <button
                onClick={toggleVisibility}
                className={`p-3 rounded-full ${currentData.isHidden ? "text-red-500" : "hover:bg-white/10 text-gray-400"}`}
              >
                {currentData.isHidden ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          <div
            className="flex-1 overflow-hidden relative"
            onClick={() => (hasAudio ? setIsPlaying(!isPlaying) : handleNext())}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full h-full"
              >
                {CurrentStepComponent && <CurrentStepComponent />}
              </motion.div>
            </AnimatePresence>

            {/* Inline Note Panel - Premium Apple-style Design with Golden Accents */}
            <AnimatePresence>
              {currentData?.notes?.content && showNotePanel && !editMode && (
                <motion.div
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute top-4 right-4 bottom-24 z-30 w-80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl relative"
                    style={{
                      background: "rgba(28, 28, 30, 0.95)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid rgba(255, 215, 0, 0.15)",
                    }}
                  >
                    {/* Golden Shine Effect - Top Edge */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, #FFD700 20%, #FFC125 50%, #FFD700 80%, transparent 100%)",
                        opacity: 0.8,
                      }}
                    />

                    {/* Subtle Golden Glow */}
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
                      }}
                    />

                    {/* Premium Header with Golden Accent */}
                    <div
                      className="px-5 py-4 flex items-center justify-between relative"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255, 215, 0, 0.05) 0%, rgba(255,255,255,0.02) 100%)",
                        borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)",
                            boxShadow: "0 4px 16px rgba(255, 215, 0, 0.35)",
                          }}
                        >
                          {/* Inner shine */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                            }}
                          />
                          <span className="text-black font-bold text-sm relative z-10">
                            {currentStep}
                          </span>
                        </div>
                        <div>
                          <h3
                            className="font-semibold text-sm tracking-tight"
                            style={{
                              background:
                                "linear-gradient(90deg, #FFD700, #FFC125)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            Teacher's Note
                          </h3>
                          <p className="text-white/40 text-[10px] font-medium tracking-wide uppercase">
                            Step {currentStep} of {totalSteps}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Edit Button - Only for Admin/Team */}
                        {canEdit && (
                          <button
                            onClick={() => setShowNoteCard(true)}
                            className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400/70 hover:text-amber-400 transition-all"
                            title="Edit Note"
                          >
                            <FaEdit size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => setShowFullscreenNote(true)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                          title="Expand Note"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowNotePanel(false)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                          title="Hide Panel"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div
                      className="flex-1 overflow-y-auto px-5 py-4"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255, 215, 0, 0.3) transparent",
                      }}
                    >
                      <p
                        className="leading-relaxed"
                        style={{
                          fontFamily:
                            "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                          fontSize: "15px",
                          fontWeight: 400,
                          color: "rgba(255, 255, 255, 0.92)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                          textRendering: "optimizeLegibility",
                          WebkitFontSmoothing: "antialiased",
                        }}
                      >
                        {currentData.notes.content}
                      </p>
                      {currentData.notes.imageUrl && (
                        <div
                          className="mt-4 rounded-xl overflow-hidden"
                          style={{
                            border: "1px solid rgba(255, 215, 0, 0.15)",
                          }}
                        >
                          <img
                            src={currentData.notes.imageUrl}
                            alt="Note illustration"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Premium Footer with Golden Accent */}
                    <div
                      className="px-5 py-3 flex items-center justify-between relative"
                      style={{
                        background: "rgba(255, 215, 0, 0.03)",
                        borderTop: "1px solid rgba(255, 215, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #B8860B, #FFD700)",
                          }}
                        >
                          <span className="text-[9px] font-black text-black">
                            M
                          </span>
                        </div>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: "rgba(255, 215, 0, 0.5)" }}
                        >
                          Medha Learning
                        </span>
                      </div>
                      <div
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(218, 165, 32, 0.1))",
                          color: "#FFD700",
                          border: "1px solid rgba(255, 215, 0, 0.2)",
                        }}
                      >
                        ✦ Premium Note
                      </div>
                    </div>

                    {/* Golden Shine Effect - Bottom Edge */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[1px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.3) 50%, transparent 100%)",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Show Note Button - When panel is hidden */}
            {currentData?.notes?.content && !showNotePanel && !editMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotePanel(true);
                }}
                className="absolute top-4 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all"
                style={{
                  background: "rgba(28, 28, 30, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.1)",
                }}
                title="Show Note"
              >
                <FaStickyNote size={14} style={{ color: "#FFD700" }} />
                <span
                  className="text-xs font-semibold"
                  style={{
                    background: "linear-gradient(90deg, #FFD700, #FFC125)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  View Note
                </span>
              </motion.button>
            )}
          </div>

          {/* SCRUBBER */}
          <div className="h-20 bg-black flex flex-col justify-center px-8 z-30">
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="text-white hover:text-blue-500 disabled:opacity-20 transition-colors"
              >
                <FaChevronLeft size={20} />
              </button>

              <div className="flex-1 flex gap-1 h-1 bg-[#1c1c1e] rounded-full overflow-hidden">
                {normalizedSteps.map((_, i) => {
                  const step = i + 1;
                  const isPast = step <= currentStep;
                  return (
                    <button
                      key={i}
                      onClick={() => goToStep(step)}
                      className={`h-full transition-all duration-300 ${isPast ? "bg-white" : "bg-transparent"} hover:bg-blue-500/50`}
                      style={{ flex: 1 }}
                    />
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentStep === totalSteps}
                className="text-white hover:text-blue-500 disabled:opacity-20 transition-colors"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
              <span>
                Step {currentStep} / {totalSteps}
              </span>
              <span>{currentStepObj.title}</span>
            </div>
          </div>
        </main>
      </div>

      <SlideNoteCard
        isOpen={showNoteCard}
        onClose={() => setShowNoteCard(false)}
        note={currentData.notes || {}}
        onSave={handleSaveNote}
        onImageUpload={handleNoteImageUpload}
        isEditable={canEdit}
        stepNumber={currentStep}
      />

      {/* Premium Fullscreen Note Viewer */}
      <AnimatePresence>
        {showFullscreenNote && currentData?.notes?.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center"
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(30px)",
            }}
            onClick={() => setShowFullscreenNote(false)}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
                }}
                animate={{
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)",
                }}
                animate={{
                  x: [0, -40, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col"
            >
              {/* Premium Card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(28, 28, 30, 0.98) 0%, rgba(20, 20, 22, 0.99) 100%)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  boxShadow:
                    "0 50px 100px -20px rgba(0, 0, 0, 0.7), 0 0 60px rgba(255, 215, 0, 0.1)",
                }}
              >
                {/* Golden Top Border Glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, #FFD700 30%, #FFC125 50%, #FFD700 70%, transparent 100%)",
                  }}
                />

                {/* Shine Effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute -top-1/2 -left-1/2 w-full h-full"
                    style={{
                      background:
                        "linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.03) 50%, transparent 70%)",
                    }}
                    animate={{
                      x: ["0%", "200%"],
                      y: ["0%", "200%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Premium Header */}
                <div
                  className="px-8 py-6 flex items-center justify-between relative"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    borderBottom: "1px solid rgba(255, 215, 0, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Step Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)",
                        boxShadow: "0 8px 32px rgba(255, 215, 0, 0.4)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
                        }}
                      />
                      <span className="text-black font-black text-xl relative z-10">
                        {currentStep}
                      </span>
                    </motion.div>
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-bold text-2xl tracking-tight"
                        style={{
                          background:
                            "linear-gradient(90deg, #FFD700, #FFC125, #FFE066)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Teacher's Note
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/50 text-sm font-medium tracking-wide mt-1"
                      >
                        Step {currentStep} of {totalSteps} •{" "}
                        {currentStepObj.title || "Lecture Content"}
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit Button for Admin/Team */}
                    {canEdit && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => {
                          setShowFullscreenNote(false);
                          setShowNoteCard(true);
                        }}
                        className="p-3 rounded-xl hover:bg-amber-500/20 text-amber-400/70 hover:text-amber-400 transition-all"
                        title="Edit Note"
                      >
                        <FaEdit size={18} />
                      </motion.button>
                    )}
                    {/* Close Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setShowFullscreenNote(false)}
                      className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                      <FaTimes size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Content Area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 overflow-y-auto px-8 py-8"
                  style={{
                    maxHeight: "50vh",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255, 215, 0, 0.3) transparent",
                  }}
                >
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily:
                        "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "rgba(255, 255, 255, 0.95)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      textRendering: "optimizeLegibility",
                      WebkitFontSmoothing: "antialiased",
                    }}
                  >
                    {currentData.notes.content}
                  </p>

                  {/* Image */}
                  {currentData.notes.imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid rgba(255, 215, 0, 0.2)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <img
                        src={currentData.notes.imageUrl}
                        alt="Note illustration"
                        className="w-full h-auto object-cover"
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Premium Footer */}
                <div
                  className="px-8 py-5 flex items-center justify-between relative"
                  style={{
                    background: "rgba(255, 215, 0, 0.04)",
                    borderTop: "1px solid rgba(255, 215, 0, 0.12)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #B8860B, #FFD700)",
                      }}
                    >
                      <span className="text-xs font-black text-black">M</span>
                    </motion.div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(255, 215, 0, 0.6)" }}
                    >
                      Medha Learning
                    </span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(218, 165, 32, 0.1))",
                      color: "#FFD700",
                      border: "1px solid rgba(255, 215, 0, 0.25)",
                    }}
                  >
                    ✦ Premium Content
                  </motion.div>
                </div>

                {/* Bottom Golden Glow */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.4) 50%, transparent 100%)",
                  }}
                />
              </div>

              {/* Keyboard Hint */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-center"
              >
                <span className="text-white/30 text-xs">
                  Press{" "}
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/50 mx-1">
                    ESC
                  </kbd>{" "}
                  or click outside to close
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Chatbot - AI Assistant */}
      <VoiceChatbot
        animationTitle={title || animation?.metadata?.title || animationId}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isVisible={!showIntro}
      />
    </motion.div>,
    document.body
  );
};

export default MedhaAnimationViewer;
