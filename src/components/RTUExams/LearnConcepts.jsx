import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaBook, 
  FaPlay, 
  FaFilePdf,
  FaEye,
  FaHeart,
  FaGraduationCap,
  FaPlus
} from 'react-icons/fa';
import ContentCard from './ContentCard';
import MedhaVideoPlayer from './MedhaVideoPlayer';
import MedhaPDFViewer from './MedhaPDFViewer';
import AdminContentUpload from './AdminContentUpload';
import AdminContentEdit from './AdminContentEdit';
import Loader from '../Common/Loader';

/**
 * LearnConcepts - Main component for "Learn the Concepts" section
 * Shows subjects with video lectures and PDF notes
 */
const LearnConcepts = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'video', 'pdf'
  
  // Modal states
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePDF, setActivePDF] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editContent, setEditContent] = useState(null);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchSubjects();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}/api/messages/check-admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdmin(res.data.isAdmin || false);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}/api/learn/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setSubjects(res.data.subjects);
      }
    } catch (error) {
      console.error('Error fetching learn subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (subject) => {
    try {
      setContentLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${baseUrl}/api/learn/subjects/${encodeURIComponent(subject)}/content`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setContent(res.data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    fetchContent(subject.subject);
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setContent([]);
    setFilter('all');
  };

  const handleLike = async (contentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${baseUrl}/api/learn/${contentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setContent(prev => prev.map(item => 
          item._id === contentId
            ? { ...item, isLiked: res.data.isLiked, likeCount: res.data.likeCount }
            : item
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleView = async (contentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseUrl}/api/learn/${contentId}/view`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleContentClick = (item) => {
    if (item.type === 'video') {
      setActiveVideo(item);
    } else if (item.type === 'pdf') {
      setActivePDF(item);
    }
  };

  const filteredContent = filter === 'all' 
    ? content 
    : content.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Upload Button */}
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <FaPlus size={14} />
            Upload Content
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Subject List View */}
        {!selectedSubject && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {subjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                  <FaGraduationCap size={40} className="text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">Coming Soon!</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We're working on adding video lectures and study materials for all subjects. 
                  Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject, idx) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleSubjectClick(subject)}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl group-hover:from-indigo-500 group-hover:to-violet-500 transition-colors">
                          <FaBook size={24} className="text-indigo-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                            <FaEye size={10} />
                            {subject.totalViews || 0}
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg text-xs font-medium text-red-500">
                            <FaHeart size={10} />
                            {subject.totalLikes || 0}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                        {subject.subject}
                      </h3>

                      <div className="flex items-center gap-3">
                        {subject.videoCount > 0 && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full text-sm font-medium text-indigo-600">
                            <FaPlay size={10} />
                            {subject.videoCount} {subject.videoCount === 1 ? 'Video' : 'Videos'}
                          </span>
                        )}
                        {subject.pdfCount > 0 && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full text-sm font-medium text-red-500">
                            <FaFilePdf size={10} />
                            {subject.pdfCount} {subject.pdfCount === 1 ? 'PDF' : 'PDFs'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Content List View */}
        {selectedSubject && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Back Button & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors w-fit"
              >
                <FaArrowLeft size={14} />
                Back to Subjects
              </button>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border border-slate-200">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'video', label: 'Videos', icon: FaPlay },
                  { key: 'pdf', label: 'PDFs', icon: FaFilePdf }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {Icon && <Icon size={12} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            {contentLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  {filter === 'video' ? (
                    <FaPlay size={24} className="text-slate-400" />
                  ) : filter === 'pdf' ? (
                    <FaFilePdf size={24} className="text-slate-400" />
                  ) : (
                    <FaBook size={24} className="text-slate-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-1">No content yet</h3>
                <p className="text-slate-400">
                  {filter === 'all' 
                    ? 'No videos or PDFs available for this subject yet.'
                    : `No ${filter === 'video' ? 'videos' : 'PDFs'} available for this subject yet.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContent.map((item, idx) => (
                  <ContentCard
                    key={item._id}
                    id={item._id}
                    type={item.type}
                    title={item.title}
                    description={item.description}
                    thumbnailUrl={item.thumbnailUrl || item.pdfThumbnailUrl}
                    duration={item.duration}
                    pageCount={item.pageCount}
                    likeCount={item.likeCount}
                    views={item.views}
                    isLiked={item.isLiked}
                    onClick={() => handleContentClick(item)}
                    onLike={handleLike}
                    index={idx}
                    isAdmin={isAdmin}
                    onEdit={() => setEditContent(item)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <MedhaVideoPlayer
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.videoUrl}
        videoId={activeVideo?.videoId}
        title={activeVideo?.title}
        isLiked={activeVideo?.isLiked}
        likeCount={activeVideo?.likeCount}
        onLike={() => activeVideo && handleLike(activeVideo._id)}
        onView={() => activeVideo && handleView(activeVideo._id)}
      />

      {/* PDF Viewer Modal */}
      <MedhaPDFViewer
        isOpen={!!activePDF}
        onClose={() => setActivePDF(null)}
        pdfUrl={activePDF?.pdfUrl}
        title={activePDF?.title}
        pageCount={activePDF?.pageCount}
        audioHindiUrl={activePDF?.audioHindiUrl}
        audioEnglishUrl={activePDF?.audioEnglishUrl}
      />

      {/* Admin Upload Modal */}
      <AdminContentUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          fetchSubjects();
          if (selectedSubject) {
            fetchContent(selectedSubject.subject);
          }
        }}
      />
      
      {/* Admin Content Edit Modal */}
      <AdminContentEdit
        isOpen={!!editContent}
        onClose={() => setEditContent(null)}
        content={editContent}
        onSuccess={() => {
          if (selectedSubject) {
            fetchContent(selectedSubject.subject);
          }
          setEditContent(null);
        }}
      />
    </div>
  );
};

export default LearnConcepts;
