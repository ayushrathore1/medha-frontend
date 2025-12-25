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

  // If image exists, show minimal indicator with delete option
  if (question.imageUrl) {
    return (
      <div 
        tabIndex={0}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`mt-3 p-2 rounded-lg border transition-all cursor-pointer outline-none ${
          isFocused 
            ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200" 
            : "bg-emerald-50 border-emerald-200 hover:border-indigo-300"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            {uploading ? (
              <><FaSpinner className="animate-spin text-indigo-500" /> Uploading...</>
            ) : isFocused ? (
              <><FaPaste className="text-indigo-500" /> <span className="text-indigo-600">Paste to replace (Ctrl+V)</span></>
            ) : (
              <><FaCheck className="text-emerald-500" /> Image attached - click to replace</>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleting}
            className={`p-1.5 rounded-md text-xs font-bold transition-all ${
              deleting 
                ? "bg-slate-100 text-slate-400" 
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
          </button>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
            <FaTimes /> {error}
          </p>
        )}
      </div>
    );
  }

  // No image - show paste zone
  return (
    <div
      tabIndex={0}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`mt-3 p-3 rounded-lg border-2 border-dashed text-center transition-all cursor-pointer outline-none ${
        isFocused
          ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
          : "border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
      }`}
    >
      {uploading ? (
        <div className="flex items-center justify-center gap-2 text-indigo-600">
          <FaSpinner className="animate-spin" />
          <span className="text-xs font-bold">Uploading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {isFocused ? (
            <><FaPaste className="text-indigo-500" /> <span className="text-xs font-bold text-indigo-600">Paste image (Ctrl+V)</span></>
          ) : (
            <><FaImage className="text-slate-400" /> <span className="text-xs font-medium text-slate-500">Click here, then paste (Ctrl+V)</span></>
          )}
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-600 font-medium flex items-center justify-center gap-1">
          <FaTimes /> {error}
        </p>
      )}
    </div>
  );
};

export default QuestionImageUploader;
