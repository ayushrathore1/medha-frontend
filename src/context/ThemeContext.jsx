import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Feature flag for dark theme - set VITE_ENABLE_DARK_THEME=true in .env to enable
const DARK_THEME_ENABLED = import.meta.env.VITE_ENABLE_DARK_THEME === 'true';

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // If dark theme is disabled, always return 'light'
    if (!DARK_THEME_ENABLED) {
      return 'light';
    }
    const savedTheme = localStorage.getItem('medha-theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // If dark theme is disabled, ensure we're on light theme
    if (!DARK_THEME_ENABLED && theme !== 'light') {
      setTheme('light');
      return;
    }
    localStorage.setItem('medha-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    // Only allow toggle if dark theme is enabled
    if (!DARK_THEME_ENABLED) {
      return;
    }
    setTheme((prevTheme) => (prevTheme === 'light' ? 'premium-dark' : 'light'));
  };

  // Expose whether dark theme is available
  const isDarkThemeEnabled = DARK_THEME_ENABLED;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkThemeEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};
