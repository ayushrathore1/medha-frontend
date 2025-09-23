import React, { useRef } from "react";

const FileUpload = ({ onFileSelect, accept = "image/*,application/pdf" }) => {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col items-center py-4">
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
            inputRef.current.value = "";
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Upload Image or PDF
      </button>
      <span className="text-sm text-blue-500 mt-2">
        Supported: Images & PDFs (max 10MB)
      </span>
    </div>
  );
};

export default FileUpload;
