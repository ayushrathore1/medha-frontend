import React, { useState, useCallback } from "react";
import axios from "axios";
import { FaSpinner, FaCheck, FaTimes, FaTrash, FaPaste, FaImage } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/ayushrathore1";

/**
 * QuestionImageUploader - Simplified admin image uploader with paste-only support
 * Integrates with the question card - clicking the card enables paste
 */
const QuestionImageUploader = ({
  question,
  subjectName,
  year,
  unitSerial,
  onImageUpdated,
  onPasteReady, // Callback to expose paste handler to parent
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // Show config warning if ImageKit is not configured
  if (!IMAGEKIT_PUBLIC_KEY) {
    return (
      <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-xs font-medium text-amber-700">⚠️ ImageKit not configured</p>
      </div>
    );
  }

  // Get auth params from backend for ImageKit upload
  const authenticator = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BACKEND_URL}/api/rtu/imagekit-auth`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  // Save uploaded image URL to database
  const saveImageToDatabase = async (imageUrl, imageFileId) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${BACKEND_URL}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/units/${unitSerial}/questions/${encodeURIComponent(question.qCode)}/image`,
      { imageUrl, imageFileId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onImageUpdated && onImageUpdated(question.qCode, imageUrl);
  };

  // Upload file directly to ImageKit using fetch
  const uploadFileToImageKit = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const authParams = await authenticator();
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", `question_${question.qCode}_${Date.now()}`);
      formData.append("folder", "/Medha/ExamQuestions");
      formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
      formData.append("signature", authParams.signature);
      formData.append("expire", authParams.expire);
      formData.append("token", authParams.token);

      const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const result = await uploadResponse.json();
      console.log("ImageKit upload result:", result);
      
      await saveImageToDatabase(result.url, result.fileId);
      setError(null);
    } catch (err) {
      console.error("Paste upload error:", err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle paste event
  const handlePaste = useCallback(async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await uploadFileToImageKit(file);
        }
        break;
      }
    }
  }, [question.qCode, subjectName, year, unitSerial]);

  const handleDelete = async () => {
    if (!confirm("Delete this question image?")) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${BACKEND_URL}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/units/${unitSerial}/questions/${encodeURIComponent(question.qCode)}/image`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onImageUpdated && onImageUpdated(question.qCode, null);
    } catch (err) {
      console.error("Failed to delete image:", err);
      setError("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Render: Premium UI with image preview
  return (
    <div
      tabIndex={0}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`group relative mt-4 rounded-xl border-2 border-dashed transition-all duration-300 outline-none overflow-hidden ${
        isFocused
          ? "border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-100 scale-[1.01]"
          : question.imageUrl
            ? "border-emerald-300 bg-emerald-50/30 hover:border-emerald-400"
            : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100"
      }`}
    >
      <div className="p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
        
        {/* Loading State */}
        {uploading ? (
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <FaSpinner className="animate-spin text-2xl text-indigo-600" />
            </div>
            <span className="text-sm font-bold text-indigo-600">Uploading Image...</span>
          </div>
        ) : question.imageUrl ? (
          // Image Exists State - Show Preview
          <div className="w-full relative">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 border-white shadow-md group-hover:shadow-lg transition-shadow">
                <img 
                  src={question.imageUrl} 
                  alt="Question Diagram" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <FaCheck size={10} /> Attached
                  </span>
                  {isFocused && (
                    <span className="text-xs font-bold text-indigo-500 animate-pulse">
                      Paste to replace
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 break-all">
                  {question.imageUrl.split('/').pop()}
                </p>
                <div className="flex gap-2 mt-2">
                   <button
                    onClick={(e) => { e.stopPropagation(); window.open(question.imageUrl, '_blank') }}
                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <FaImage /> View Full
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    disabled={deleting}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                  >
                    {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />} Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty State - Call to Action
          <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
            <div className={`p-3 rounded-full transition-colors duration-300 ${
              isFocused ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm group-hover:text-indigo-500 group-hover:shadow-md"
            }`}>
              {isFocused ? <FaPaste size={24} /> : <FaImage size={24} />}
            </div>
            
            <div>
              <p className={`text-sm font-bold transition-colors ${
                isFocused ? "text-indigo-700" : "text-slate-600 group-hover:text-slate-800"
              }`}>
                {isFocused ? "Paste Now (Ctrl+V)" : "Add Question Diagram"}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Click here, then paste an image from clipboard
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 w-full p-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center justify-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
            <FaTimes /> {error}
          </div>
        )}
      </div>

      {/* Hover Overlay Hint (only for empty state) */}
      {!question.imageUrl && !uploading && !isFocused && (
        <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/30 pointer-events-none transition-colors duration-300" />
      )}
    </div>
  );
};

export default QuestionImageUploader;
