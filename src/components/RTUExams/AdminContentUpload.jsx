import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaTimes, 
  FaCloudUploadAlt, 
  FaVideo, 
  FaFilePdf,
  FaCheck,
  FaSpinner,
  FaImage,
  FaTrash,
  FaPlay,
  FaVolumeUp
} from 'react-icons/fa';

/**
 * AdminContentUpload - YouTube-style upload modal for admins
 * Supports video and PDF uploads to ImageKit
 */
const AdminContentUpload = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState('select'); // 'select', 'details', 'uploading', 'complete'
  const [contentType, setContentType] = useState(null); // 'video' or 'pdf'
  const [subjects, setSubjects] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    unit: '',
    duration: '',
    pageCount: ''
  });
  
  // File states
  const [mainFile, setMainFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mainFilePreview, setMainFilePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Audio files for PDF explanations
  const [audioHindiFile, setAudioHindiFile] = useState(null);
  const [audioEnglishFile, setAudioEnglishFile] = useState(null);
  
  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);
  
  // ImageKit config
  const [imagekitAuth, setImagekitAuth] = useState(null);
  
  const mainFileRef = useRef(null);
  const thumbnailRef = useRef(null);
  const audioHindiRef = useRef(null);
  const audioEnglishRef = useRef(null);
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch subjects and ImageKit auth on open
  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      fetchImageKitAuth();
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}/api/learn/admin/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const fetchImageKitAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}/api/learn/admin/imagekit-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setImagekitAuth(res.data);
      }
    } catch (err) {
      console.error('Error fetching ImageKit auth:', err);
      setError('Failed to initialize upload. Please try again.');
    }
  };

  const handleMainFileDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isPdf = file.type === 'application/pdf';

    if (contentType === 'video' && !isVideo) {
      setError('Please upload a video file');
      return;
    }
    if (contentType === 'pdf' && !isPdf) {
      setError('Please upload a PDF file');
      return;
    }

    setMainFile(file);
    setError(null);

    // Generate preview
    if (isVideo) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        setFormData(prev => ({
          ...prev,
          duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
        }));
      };
      setMainFilePreview(URL.createObjectURL(file));
    }
  }, [contentType]);

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file for thumbnail');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError(null);
  };

  const uploadToImageKit = async (file, folder) => {
    if (!imagekitAuth) {
      throw new Error('ImageKit not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${Date.now()}_${file.name}`);
    formData.append('folder', folder);
    formData.append('publicKey', imagekitAuth.publicKey);
    formData.append('signature', imagekitAuth.signature);
    formData.append('expire', imagekitAuth.expire);
    formData.append('token', imagekitAuth.token);

    const response = await axios.post(
      'https://upload.imagekit.io/api/v1/files/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      }
    );

    return {
      url: response.data.url,
      fileId: response.data.fileId
    };
  };

  const handleSubmit = async () => {
    if (!mainFile) {
      setError('Please select a file to upload');
      return;
    }
    if (!formData.subject || !formData.title) {
      setError('Please fill in all required fields');
      return;
    }

    setStep('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      // Upload main file
      setUploadStatus(`Uploading ${contentType}...`);
      const folder = contentType === 'video' ? '/Medha/Learn/Videos' : '/Medha/Learn/PDFs';
      const mainUpload = await uploadToImageKit(mainFile, folder);

      // Upload thumbnail if provided
      let thumbnailUpload = null;
      if (thumbnailFile) {
        setUploadStatus('Uploading thumbnail...');
        setUploadProgress(0);
        thumbnailUpload = await uploadToImageKit(thumbnailFile, '/Medha/Learn/Thumbnails');
      }

      // Save to database
      setUploadStatus('Saving content...');
      const token = localStorage.getItem('token');
      
      const contentData = {
        subject: formData.subject,
        title: formData.title,
        description: formData.description,
        unit: formData.unit ? parseInt(formData.unit) : null,
        type: contentType,
        thumbnailUrl: thumbnailUpload?.url || null,
        thumbnailFileId: thumbnailUpload?.fileId || null
      };

      if (contentType === 'video') {
        contentData.videoUrl = mainUpload.url;
        contentData.videoFileId = mainUpload.fileId;
        contentData.duration = formData.duration;
      } else {
        contentData.pdfUrl = mainUpload.url;
        contentData.pdfFileId = mainUpload.fileId;
        contentData.pageCount = formData.pageCount ? parseInt(formData.pageCount) : null;
        
        // Upload audio files if provided
        if (audioHindiFile) {
          setUploadStatus('Uploading Hindi audio...');
          setUploadProgress(0);
          const hindiAudio = await uploadToImageKit(audioHindiFile, '/Medha/Learn/Audio');
          contentData.audioHindiUrl = hindiAudio.url;
          contentData.audioHindiFileId = hindiAudio.fileId;
        }
        
        if (audioEnglishFile) {
          setUploadStatus('Uploading English audio...');
          setUploadProgress(0);
          const englishAudio = await uploadToImageKit(audioEnglishFile, '/Medha/Learn/Audio');
          contentData.audioEnglishUrl = englishAudio.url;
          contentData.audioEnglishFileId = englishAudio.fileId;
        }
      }

      await axios.post(
        `${baseUrl}/api/learn/admin/content`,
        contentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStep('complete');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setStep('details');
    }
  };

  const resetForm = () => {
    setStep('select');
    setContentType(null);
    setFormData({
      subject: '',
      title: '',
      description: '',
      unit: '',
      duration: '',
      pageCount: ''
    });
    setMainFile(null);
    setThumbnailFile(null);
    setMainFilePreview(null);
    setThumbnailPreview(null);
    setAudioHindiFile(null);
    setAudioEnglishFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              {step === 'select' && 'Upload Content'}
              {step === 'details' && `Upload ${contentType === 'video' ? 'Video' : 'PDF'}`}
              {step === 'uploading' && 'Uploading...'}
              {step === 'complete' && 'Upload Complete!'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Select Content Type */}
            {step === 'select' && (
              <div className="space-y-4">
                <p className="text-slate-500 text-center mb-6">
                  What would you like to upload?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setContentType('video'); setStep('details'); }}
                    className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                  >
                    <div className="p-4 bg-indigo-100 rounded-full group-hover:bg-indigo-500 transition-colors">
                      <FaVideo size={32} className="text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-slate-700">Video Lecture</span>
                    <span className="text-sm text-slate-400">MP4, WebM, etc.</span>
                  </button>

                  <button
                    onClick={() => { setContentType('pdf'); setStep('details'); }}
                    className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-red-400 hover:bg-red-50 transition-all group"
                  >
                    <div className="p-4 bg-red-100 rounded-full group-hover:bg-red-500 transition-colors">
                      <FaFilePdf size={32} className="text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-slate-700">PDF Notes</span>
                    <span className="text-sm text-slate-400">Study materials</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload Form */}
            {step === 'details' && (
              <div className="space-y-6">
                {/* File Upload Area */}
                <div
                  onDrop={handleMainFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => mainFileRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    mainFile
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <input
                    ref={mainFileRef}
                    type="file"
                    accept={contentType === 'video' ? 'video/*' : 'application/pdf'}
                    onChange={handleMainFileDrop}
                    className="hidden"
                  />
                  
                  {mainFile ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <FaCheck size={24} className="text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-800">{mainFile.name}</p>
                        <p className="text-sm text-slate-500">
                          {(mainFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMainFile(null); setMainFilePreview(null); }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaCloudUploadAlt size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="font-medium text-slate-600">
                        Drag and drop your {contentType} here
                      </p>
                      <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                    </>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <FaImage className="inline mr-2" />
                    Thumbnail (Optional)
                  </label>
                  <div
                    onClick={() => thumbnailRef.current?.click()}
                    className={`relative h-32 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center transition-all ${
                      thumbnailFile ? 'border-emerald-400' : 'border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <input
                      ref={thumbnailRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-auto rounded-lg object-cover" />
                    ) : (
                      <span className="text-slate-400 text-sm">Click to upload thumbnail</span>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter title"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Unit (Optional)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="1-5"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    />
                  </div>

                  {contentType === 'video' ? (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="mm:ss"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Page Count</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.pageCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, pageCount: e.target.value }))}
                        placeholder="Number of pages"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Audio Explanation Upload (PDF only) */}
                {contentType === 'pdf' && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <FaVolumeUp className="text-amber-600" />
                      <label className="font-bold text-amber-800">Audio Explanations (Optional)</label>
                    </div>
                    <p className="text-sm text-amber-700 mb-4">
                      Upload audio files to help students understand the PDF content.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Hindi Audio */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">🇮🇳 Hindi</label>
                        <div 
                          onClick={() => audioHindiRef.current?.click()}
                          className={`p-4 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
                            audioHindiFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-amber-400'
                          }`}
                        >
                          <input
                            ref={audioHindiRef}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setAudioHindiFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {audioHindiFile ? (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-emerald-700 truncate">{audioHindiFile.name}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setAudioHindiFile(null); }}
                                className="text-red-500 p-1"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Click to upload</span>
                          )}
                        </div>
                      </div>
                      
                      {/* English Audio */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">🇬🇧 English</label>
                        <div 
                          onClick={() => audioEnglishRef.current?.click()}
                          className={`p-4 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
                            audioEnglishFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-amber-400'
                          }`}
                        >
                          <input
                            ref={audioEnglishRef}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setAudioEnglishFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {audioEnglishFile ? (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-emerald-700 truncate">{audioEnglishFile.name}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setAudioEnglishFile(null); }}
                                className="text-red-500 p-1"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Click to upload</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!mainFile || !formData.subject || !formData.title}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    !mainFile || !formData.subject || !formData.title
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  <FaCloudUploadAlt className="inline mr-2" />
                  Upload {contentType === 'video' ? 'Video' : 'PDF'}
                </button>
              </div>
            )}

            {/* Step 3: Uploading */}
            {step === 'uploading' && (
              <div className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-slate-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-indigo-600"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - uploadProgress / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      style={{ transition: 'stroke-dashoffset 0.3s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">{uploadProgress}%</span>
                  </div>
                </div>
                <p className="text-lg font-medium text-slate-700">{uploadStatus}</p>
                <p className="text-sm text-slate-400 mt-2">Please don't close this window</p>
              </div>
            )}

            {/* Step 4: Complete */}
            {step === 'complete' && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                  <FaCheck size={40} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Successful!</h3>
                <p className="text-slate-500 mb-8">
                  Your {contentType} has been uploaded and is now available for students.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminContentUpload;
