/**
 * VisualizeConcepts - "The Compiler's Atelier" (Apple Edition)
 * True Black. High Energy.
 */
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaMagic, FaPlay, FaCode, FaLayerGroup, FaMicrochip, FaArrowRight
} from 'react-icons/fa';
import { getAllAnimations } from './animations';
import MedhaAnimationViewer from './MedhaAnimationViewer';
import { AuthContext } from '../../AuthContext';

const APPLE_THEME = {
  bg: '#000000',
  surface: '#1c1c1e',
  surfaceHover: '#2c2c2e',
  primary: '#0A84FF', // System Blue
  secondary: '#BF5AF2', // System Purple
  text: '#F5F5F7',
  textSec: '#86868B',
  border: 'rgba(255, 255, 255, 0.1)'
};

const VisualizeConcepts = () => {
  const [animations, setAnimations] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin || false;
  const isTeam = user?.role === 'team';

  useEffect(() => {
    const fetchContentAndMerge = async () => {
      const staticAnims = getAllAnimations();
      
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        // Fetch C++ content (since most animations are C++)
        // Ideally we fetch all or multiple subjects, but let's start with C++
        const res = await axios.get(`${baseUrl}/api/learn/subjects/C++/content?type=animation`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res.data.success) {
          const dbContent = res.data.content;
          
          // Merge logic: Match static ID/Title with DB content
          const merged = staticAnims.map(anim => {
            // Try to find matching DB content by title (approximate) or id if stored in DB
            // Assuming DB content title matches animation title
            const match = dbContent.find(c => c.title.toLowerCase() === anim.title.toLowerCase());
            if (match) {
              return { 
                ...anim, 
                _id: match._id, 
                audioHindiUrl: match.audioHindiUrl, 
                audioEnglishUrl: match.audioEnglishUrl 
              };
            }
            return anim;
          });
          setAnimations(merged);
        } else {
          setAnimations(staticAnims);
        }
      } catch (err) {
        console.error("Error fetching content for mapping:", err);
        setAnimations(staticAnims);
      }
    };

    fetchContentAndMerge();
  }, []);

  const handleAnimationClick = (animation) => {
    setActiveAnimation(animation);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30" style={{ background: APPLE_THEME.bg, color: APPLE_THEME.text }}>
      
      {/* 🍎 HERO SECTION */}
      <section className="relative py-40 px-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
            <span className="text-xs font-semibold tracking-wide text-white uppercase">Medha Animation Engine 2.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-white leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            See the code<br />come to life.
          </h1>

          <p className="text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Zero-cost abstractions, visualized.<br/>
            <span className="text-blue-500">Master C++ like never before.</span>
          </p>
        </motion.div>
      </section>

      {/* 🍎 BENTO GRID */}
      <section className="px-6 pb-40 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animations.map((animation, idx) => (
            <motion.div
              key={animation.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onHoverStart={() => setHoveredCard(animation.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleAnimationClick(animation)}
              className="group cursor-pointer"
            >
              <div 
                className="relative h-full overflow-hidden rounded-[32px] bg-[#1c1c1e] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
                style={{
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                 {/* Card Preview Image Area */}
                 <div className="h-64 relative bg-[#000] flex items-center justify-center overflow-hidden">
                    {/* Abstract Grid */}
                    <div className="absolute inset-0 opacity-20" 
                      style={{ 
                        backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
                        backgroundSize: '24px 24px' 
                      }} 
                    />
                    
                    {/* Glowing Icon */}
                    <motion.div 
                      animate={{ 
                        scale: hoveredCard === animation.id ? 1.1 : 1,
                        filter: hoveredCard === animation.id ? 'drop-shadow(0 0 30px rgba(10,132,255,0.6))' : 'none'
                      }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-xl z-10"
                    >
                      <FaCode size={32} />
                    </motion.div>
                    
                    {/* Play Button Overlay */}
                    <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${hoveredCard === animation.id ? 'opacity-100' : 'opacity-0'}`}>
                       <div className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <FaPlay size={12} /> Watch Layout
                       </div>
                    </div>
                 </div>

                 {/* Card Content */}
                 <div className="p-8">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">{animation.subject}</span>
                       <span className="text-xs font-bold text-gray-500 border border-white/10 px-2 py-1 rounded-md">{animation.totalSteps} SCENES</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                       {animation.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed text-sm font-medium">
                       {animation.description}
                    </p>
                    
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white group-hover:translate-x-1 transition-transform">
                       Start Learning <FaArrowRight size={12} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <MedhaAnimationViewer
        isOpen={!!activeAnimation}
        onClose={() => setActiveAnimation(null)}
        animationId={activeAnimation?.id}
        contentId={activeAnimation?._id}
        title={activeAnimation?.title}
        totalSteps={activeAnimation?.totalSteps}
        audioHindiUrl={activeAnimation?.audioHindiUrl}
        audioEnglishUrl={activeAnimation?.audioEnglishUrl}
        isAdmin={isAdmin}
        isTeam={isTeam}
      />
    </div>
  );
};

export default VisualizeConcepts;
