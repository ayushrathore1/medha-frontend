import React, { useState } from "react";
import FileUpload from "../components/Upload/FileUpload";
import FilePreview from "../components/Upload/FilePreview";
import OcrTextEditor from "../components/Ocr/OcrTextEditor";
import Loader from "../components/Common/Loader";
import TextNoteForm from "../components/Notes/TextNoteForm";

const NoteUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [step, setStep] = useState(1);
  const [subjectId, setSubjectId] = useState("");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setStep(2);
    setExtractedText("");
  };

  const handleOcrExtracted = (text) => {
    setExtractedText(text);
    setStep(3);
  };

  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("content", extractedText);
      formData.append("subject", subjectId);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to save note: " + (data.message || "Unknown error"));
        return;
      }
      alert("Note saved successfully!");
      setFile(null);
      setExtractedText("");
      setStep(1);
    } catch {
      alert("Server error while saving note.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20 pb-12 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <div className="bg-white/90 shadow-xl border border-blue-100 p-8 mt-10 rounded-2xl">
          <h1 className="text-3xl font-bold mb-3 text-blue-700 text-center">
            Upload & OCR Your Notes
          </h1>
          <p className="mb-6 text-blue-900 text-lg text-center">
            Upload a clear image or PDF of your handwritten notes.
            <br />
            <span className="text-blue-600 font-semibold">
              The AI will read, digitize, and help you instantly revise!
            </span>
          </p>
          {/* SUBJECT SELECTOR */}
          <div className="mb-4">
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              placeholder="Enter or select Subject ID"
              required
            />
          </div>
          {/* PASTE NOTE FORM */}
          <TextNoteForm
            subjectId={subjectId}
            token={localStorage.getItem("token")}
            onNoteCreated={() => {
              alert("Text note saved!");
              // Optionally, trigger reload here.
            }}
          />
          {/* FILE UPLOAD SECTION */}
          {step === 1 && (
            <div className="mb-8">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*,application/pdf"
              />
              <div className="text-blue-500 text-center mt-3 text-sm">
                Supported: Image or PDF.
              </div>
            </div>
          )}
          {file && step >= 2 && (
            <div>
              <FilePreview file={file} />
              {step === 2 && (
                <div className="mt-8">
                  <OcrTextEditor file={file} onExtracted={handleOcrExtracted} />
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="bg-white/90 p-6 mt-6 rounded-xl shadow-lg border border-blue-100 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-blue-700 mb-2">
                Edit & Save Note
              </h2>
              <textarea
                className="w-full min-h-[160px] border border-blue-200 rounded-lg p-3 text-blue-900 bg-blue-50/30"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here."
              />
              <div className="flex gap-3 mt-3">
                <button
                  className="bg-blue-600 text-white px-7 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={handleSaveNote}
                  disabled={!extractedText.trim() || !subjectId}
                >
                  Save Note
                </button>
                <button
                  className="bg-blue-100 text-blue-700 border border-blue-300 rounded-lg px-5 py-2 font-medium hover:bg-blue-200 transition"
                  onClick={() => setStep(1)}
                >
                  Start New Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteUpload;
