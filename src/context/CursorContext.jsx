import React, { createContext, useContext, useState, useEffect } from 'react';

const CursorContext = createContext();

export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }) => {
  // Initialize from localStorage or default
  const [cursorSpeed, setCursorSpeed] = useState(() => {
    return parseInt(localStorage.getItem('medha-cursor-speed')) || 5;
  }); 
  const [cursorType, setCursorType] = useState('default');
  const [isEnabled, setIsEnabled] = useState(() => {
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
      setIsEnabled
    }}>
      {children}
    </CursorContext.Provider>
  );
};
