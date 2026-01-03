import React, { createContext, useContext, useState, useEffect } from 'react';

const CursorContext = createContext();

export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }) => {
  // Detect if device is touch-based (mobile/tablet)
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  // Initialize from localStorage or default (disabled on touch devices)
  const [cursorSpeed, setCursorSpeed] = useState(() => {
    return parseInt(localStorage.getItem('medha-cursor-speed')) || 5;
  }); 
  const [cursorType, setCursorType] = useState('default');
  const [isEnabled, setIsEnabled] = useState(() => {
    // Always disable on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return false;
    }
    const saved = localStorage.getItem('medha-cursor-enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('medha-cursor-speed', cursorSpeed);
    localStorage.setItem('medha-cursor-enabled', isEnabled);
  }, [cursorSpeed, isEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Cursor: Alt + C
      if (e.altKey && e.code === 'KeyC') {
        setIsEnabled(prev => !prev);
      }
      
      // Increase Speed: Alt + ]
      if (e.altKey && e.key === ']') {
        setCursorSpeed(prev => Math.min(prev + 1, 10));
      }

      // Decrease Speed: Alt + [
      if (e.altKey && e.key === '[') {
        setCursorSpeed(prev => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CursorContext.Provider value={{ 
      cursorSpeed, 
      setCursorSpeed, 
      cursorType, 
      setCursorType,
      isEnabled,
      setIsEnabled,
      isTouchDevice
    }}>
      {children}
    </CursorContext.Provider>
  );
};
