import React, { useRef, useState } from "react";

const MAX_FILE_SIZE_MB = 70;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUpload = ({ onFileSelect, accept = "image/*,application/pdf" }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Client-side file size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File too large (${sizeMB}MB). Maximum allowed is ${MAX_FILE_SIZE_MB}MB.`);
      inputRef.current.value = "";
      return;
    }
    
    setError(null);
    onFileSelect(file);
    inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center py-4">
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Upload Image or PDF
      </button>
      {error ? (
        <span className="text-sm text-red-500 mt-2 font-medium">{error}</span>
      ) : (
        <span className="text-sm text-blue-500 mt-2">
          Supported: Images & PDFs (max {MAX_FILE_SIZE_MB}MB)
        </span>
      )}
    </div>
  );
};

export default FileUpload;

