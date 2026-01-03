import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaFilePdf, 
  FaHeart, 
  FaRegHeart, 
  FaEye,
  FaClock,
  FaEdit
} from 'react-icons/fa';

/**
 * ContentCard - Card component for video or PDF content
 * Shows thumbnail, title, duration/pages, likes, and views
 */
const ContentCard = ({
  id,
  type, // 'video' or 'pdf'
  title,
  description,
  thumbnailUrl,
  duration, // For videos
  pageCount, // For PDFs
  likeCount,
  views,
  isLiked,
  onClick,
  onLike,
  index = 0,
  isAdmin = false,
  onEdit
}) => {
  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) onLike(id);
  };
  
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-slate-100 overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100">
              {type === 'video' ? (
                <FaPlay size={40} className="text-indigo-300" />
              ) : (
                <FaFilePdf size={40} className="text-red-300" />
              )}
            </div>
          )}

          {/* Play/View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="p-4 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {type === 'video' ? (
                <FaPlay size={24} className="text-indigo-600 ml-1" />
              ) : (
                <FaFilePdf size={24} className="text-red-500" />
              )}
            </motion.div>
          </div>

          {/* Duration/Page Count Badge */}
          {(duration || pageCount) && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded-md">
              {type === 'video' ? (
                <span className="flex items-center gap-1">
                  <FaClock size={10} />
                  {duration}
                </span>
              ) : (
                <span>{pageCount} pages</span>
              )}
            </div>
          )}

          {/* Type Badge */}
          <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-md ${
            type === 'video' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {type === 'video' ? 'VIDEO' : 'PDF'}
          </div>
          
          {/* Admin Edit Button */}
          {isAdmin && (
            <button
              onClick={handleEditClick}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
              title="Edit content"
            >
              <FaEdit size={14} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              {/* Views */}
              <span className="flex items-center gap-1">
                <FaEye size={14} />
                {views || 0}
              </span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isLiked
                  ? 'bg-red-50 text-red-500'
                  : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              {isLiked ? (
                <FaHeart size={14} className="text-red-500" />
              ) : (
                <FaRegHeart size={14} />
              )}
              <span>{likeCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Memoize to prevent re-renders when parent updates but props haven't changed
export default React.memo(ContentCard);
