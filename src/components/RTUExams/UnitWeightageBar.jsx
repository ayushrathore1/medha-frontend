import React, { useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getBarGradient } from "../../utils/unitWeightageUtils";
import { FaYoutube, FaChevronDown, FaChevronUp, FaMagic, FaEye, FaSpinner, FaTimes, FaBookOpen, FaPlay, FaList, FaImage } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import QuestionImageUploader from "./QuestionImageUploader";
import QuestionImageModal from "./QuestionImageModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to convert YouTube playlist URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/[?&]list=([^&]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
  }
  return null;
};

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
  year = "",
  isAdmin = false, // Admin can upload images
  onQuestionsUpdated, // Callback when questions are updated
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [solutions, setSolutions] = useState({});
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [viewingIdx, setViewingIdx] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [viewingImageIdx, setViewingImageIdx] = useState(null); // For image modal
  const [localQuestions, setLocalQuestions] = useState(questions); // Local copy for image updates

  const barWidth = Math.min(weightagePercentage, 100);

  // Parse multiple playlists (separated by " | "), each as "URL::ChannelName"
  const playlists = useMemo(() => {
    if (!youtubePlaylistUrl) return [];
    return youtubePlaylistUrl.split(" | ").map((entry, idx) => {
      const [url, channelName] = entry.trim().split("::");
      return {
        url: url?.trim(),
        embedUrl: getYouTubeEmbedUrl(url?.trim()),
        label: channelName?.trim() || `Playlist ${idx + 1}`
      };
    }).filter(p => p.embedUrl);
  }, [youtubePlaylistUrl]);

  const handleWatchLecture = (e) => {
    e.stopPropagation();
    if (playlists.length > 0) {
      setActivePlaylistIndex(0);
      setShowVideoModal(true);
    }
  };

  const closeVideoModal = (e) => {
    if (e) e.stopPropagation();
    setShowVideoModal(false);
  };

  const toggleExpand = () => {
    if (questions && questions.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSolve = async (e, question, idx) => {
    e.stopPropagation();
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
          question: question.text.replace(/<[^>]*>/g, ''),
          subject: subjectName,
          unit: `Unit ${unitSerial} - ${unitName}`,
          marks: question.marks,
          model: localStorage.getItem("chatbot_model") || "groq", // Use user's selected model
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
        [idx]: "❌ Failed to generate solution. One of our AI services might be busy. Please try again later."
      }));
      setViewingIdx(idx);
    } finally {
      setLoadingIdx(null);
    }
  };

  const closeSolution = (e) => {
    e.stopPropagation();
    setViewingIdx(null);
  };

  // Handle image update from uploader
  const handleImageUpdated = (qCode, newImageUrl) => {
    setLocalQuestions(prev => 
      prev.map(q => 
        q.qCode === qCode 
          ? { ...q, imageUrl: newImageUrl } 
          : q
      )
    );
    onQuestionsUpdated && onQuestionsUpdated();
  };

  // Close image modal
  const closeImageModal = () => {
    setViewingImageIdx(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className={`group relative p-6 mb-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all ${
          questions.length > 0 ? "cursor-pointer" : ""
        }`}
        onClick={toggleExpand}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
               <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                 Unit {unitSerial} <span className="text-slate-400 font-light mx-2">|</span> {unitName}
               </h4>
               
               <div className="flex flex-wrap items-center gap-3">
                 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {totalMarks} Marks • {weightagePercentage.toFixed(1)}% Weightage
                 </span>
                 
                 {youtubePlaylistUrl && (
                    <button
                      onClick={handleWatchLecture}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-sm"
                    >
                      <FaYoutube /> Watch Lecture
                    </button>
                 )}
               </div>
            </div>

            {questions.length > 0 && (
              <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                <FaChevronDown />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${barWidth}%` }}
               transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
               className="h-full rounded-full"
               style={{ background: getBarGradient(weightagePercentage) }}
             />
          </div>
        </div>

        {/* Questions List */}
        <AnimatePresence>
          {isExpanded && localQuestions.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
               <div className="mt-6 pt-6 border-t border-slate-100 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FaBookOpen /> Past Year Questions ({year})
                    </h5>
                    {isAdmin && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        Admin Mode
                      </span>
                    )}
                  </div>

                  {localQuestions.map((q, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                       <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-indigo-600 text-sm bg-white px-2 py-0.5 rounded border border-indigo-100 shadow-sm">
                             {q.qCode}
                          </span>
                          <div className="flex items-center gap-2">
                             {q.imageUrl && (
                               <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                 <FaImage className="text-emerald-500" /> Has Image
                               </span>
                             )}
                             <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                {q.marks} Marks
                             </span>
                          </div>
                       </div>
                       
                       <div 
                         className="prose prose-sm prose-slate max-w-none text-slate-600 mb-4 font-medium leading-relaxed"
                         dangerouslySetInnerHTML={{ __html: q.text }}
                       />

                       <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* Show Image button - visible to all users when image exists */}
                          {q.imageUrl && (
                            <button
                              onClick={() => setViewingImageIdx(idx)}
                              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                            >
                              <FaImage /> Show Image
                            </button>
                          )}
                          
                          {/* Solve button */}
                          <button
                            onClick={(e) => handleSolve(e, q, idx)}
                            disabled={loadingIdx === idx}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all shadow-md hover:shadow-lg ${
                               solutions[idx] 
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" 
                                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                            } ${loadingIdx === idx ? "opacity-70 cursor-wait" : ""}`}
                          >
                             {loadingIdx === idx ? (
                               <><FaSpinner className="animate-spin" /> Solving...</>
                             ) : solutions[idx] ? (
                               <><FaEye /> View Solution</>
                             ) : (
                               <><FaMagic /> Solve with Medha</>
                             )}
                          </button>
                       </div>

                       {/* Admin-only image uploader */}
                       {isAdmin && (
                         <QuestionImageUploader
                           question={q}
                           subjectName={subjectName}
                           year={year}
                           unitSerial={unitSerial}
                           onImageUpdated={handleImageUpdated}
                         />
                       )}
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Solution Modal */}
      <AnimatePresence>
        {viewingIdx !== null && solutions[viewingIdx] && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeSolution}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200"
              >
                 {/* Modal Header */}
                 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                          <FaMagic />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800 text-lg">AI Generated Solution</h3>
                          <p className="text-xs text-slate-500 font-medium">{subjectName} • Unit {unitSerial}</p>
                       </div>
                    </div>
                    <button onClick={closeSolution} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                       <FaTimes size={20} />
                    </button>
                 </div>

                 {/* Modal Content */}
                 <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                       <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-black text-indigo-700 mb-4 border-b pb-2 border-indigo-100" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            code: ({node, inline, ...props}) => 
                              inline ? (
                                <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                              ) : (
                                <code className="block bg-slate-800 text-slate-100 p-4 rounded-xl text-sm font-mono my-4 overflow-x-auto shadow-inner" {...props} />
                              ),
                            table: ({node, ...props}) => (
                               <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm">
                                  <table className="w-full text-sm text-left" {...props} />
                               </div>
                            ),
                            th: ({node, ...props}) => <th className="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200" {...props} />,
                            td: ({node, ...props}) => <td className="px-4 py-3 border-b border-slate-100 bg-white" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-400 pl-4 py-1 my-4 bg-indigo-50/50 text-indigo-900 italic rounded-r-lg" {...props} />,
                          }}
                       >
                          {solutions[viewingIdx]?.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$').replace(/\\\(/g, '$').replace(/\\\)/g, '$')}
                       </ReactMarkdown>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-70">
                          AI generated content • Verify with standard textbooks
                       </p>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* YouTube Video Player Modal */}
      <AnimatePresence>
        {showVideoModal && playlists.length > 0 && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-red-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 text-white rounded-lg">
                    <FaYoutube size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-md">Video Lectures</h3>
                    <p className="text-sm text-white/90 font-medium drop-shadow-sm">
                      {subjectName} • Unit {unitSerial}: {unitName}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={closeVideoModal} 
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Playlist Tabs (if multiple playlists) */}
              {playlists.length > 1 && (
                <div className="flex gap-2 p-3 bg-slate-800/50 border-b border-slate-700">
                  {playlists.map((playlist, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePlaylistIndex(idx)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activePlaylistIndex === idx
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      <FaList size={12} />
                      {playlist.label}
                    </button>
                  ))}
                </div>
              )}

              {/* YouTube Iframe */}
              <div className="w-full h-[60vh] bg-black">
                <iframe
                  src={playlists[activePlaylistIndex]?.embedUrl}
                  title={`${subjectName} - Unit ${unitSerial} Lectures`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-800/50 border-t border-slate-700 text-center space-y-1">
                <p className="text-sm text-white font-semibold">
                  ❤️ Credits: <span className="text-red-400">{playlists[activePlaylistIndex]?.label}</span>
                </p>
                <p className="text-xs text-yellow-400 font-semibold">
                  💡 Click the playlist icon (≡) on top-right of the video to see all videos
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  🎓 Watch lectures directly in MEDHA • <span className="text-slate-400">Powered by YouTube</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Image Modal */}
      <QuestionImageModal
        isOpen={viewingImageIdx !== null}
        imageUrl={localQuestions[viewingImageIdx]?.imageUrl}
        questionCode={localQuestions[viewingImageIdx]?.qCode}
        onClose={closeImageModal}
      />
    </>
  );
};

export default UnitWeightageBar;
