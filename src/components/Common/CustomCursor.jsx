import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

const CustomCursor = () => {
  const { cursorSpeed, cursorType, isEnabled, setCursorType } = useCursor();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Calculate spring physics based on "speed" setting (1-10)
  // Higher speed = Stiffer spring (follows faster), Lower damping
  // Lower speed = Looser spring (more lag/weight), Higher damping
  const springConfig = {
    damping: 20 + (10 - cursorSpeed) * 5, // Damping 20-70
    stiffness: 100 + cursorSpeed * 50,    // Stiffness 150-600
    mass: 0.5
  };

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Dot physics (slightly faster/stiffer)
  const dotSpringConfig = { ...springConfig, stiffness: springConfig.stiffness * 1.5 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    if (!isEnabled) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'none';

    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16); // Center the 32px cursor
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      // Check for hoverable elements
      const target = e.target;
      const isHoverable = target.closest('a, button, input, textarea, [role="button"]');
      
      if (isHoverable) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [isEnabled, cursorSpeed, setCursorType]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Main Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-indigo-500/50"
        style={{
          x: cursorX,
          y: cursorY,
          width: 32,
          height: 32,
          scale: cursorType === 'hover' ? 1.5 : 1,
          backgroundColor: cursorType === 'hover' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        }}
        transition={{ scale: { duration: 0.2 } }}
      />
      
      {/* Center Dot (Always follows strictly or with less lag) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 bg-indigo-600 rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: 12, // Center relative to 32px ring
          translateY: 12,
        }}
      />
       {/* Speed Indicator (Flash on change) */}
       <div className="fixed bottom-4 right-4 pointer-events-none z-[9999] text-xs font-mono text-indigo-500/50">
         Cursor Speed: {cursorSpeed}
       </div>
    </>
  );
};

export default CustomCursor;
