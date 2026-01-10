import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOptimizedWallpaperUrl } from '../utils/imageUtils';

const ThemeContext = createContext();

// Feature flag for dark theme - set VITE_ENABLE_DARK_THEME=true in .env to enable
const DARK_THEME_ENABLED = import.meta.env.VITE_ENABLE_DARK_THEME === 'true';

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medha-theme') || 'light';
  });

  // Appearance State
  const [appearance, setAppearance] = useState(() => {
    const saved = localStorage.getItem('medha-appearance');
    const parsed = saved ? JSON.parse(saved) : {};
    
    // Default structure validation
    return {
      bgImage: parsed.bgImage || 'none',
      bgOverlay: parsed.bgOverlay || 0,
      fontFamily: parsed.fontFamily || 'Inter',
      fontScale: parsed.fontScale || 1,
      themeWallpapers: parsed.themeWallpapers || {} // Map of { [themeId]: url }
    };
  });

  // Apply Theme & Switch Wallpaper
  useEffect(() => {
    localStorage.setItem('medha-theme', theme);
    document.documentElement.className = theme;

    // When theme changes, switch to that theme's saved wallpaper if it exists
    // Otherwise keep current or default to none? User wants "wallpaper changes" so likely per-theme isolation
    const themeWallpaper = appearance.themeWallpapers[theme];
    if (themeWallpaper && themeWallpaper !== appearance.bgImage) {
      setAppearance(prev => ({ ...prev, bgImage: themeWallpaper }));
    } else if (!themeWallpaper && appearance.bgImage !== 'none') {
       // Optional: Reset to none if no wallpaper saved for this theme? 
       // Or do we prefer "sticky" behavior if not set? 
       // User said "theme change and wallpaper changes". Implies unique wallpaper per theme.
       // Let's reset to 'none' if undefined to be clean, or keep previous if we want sticky.
       // "Different for each theme" suggests isolation.
       setAppearance(prev => ({ ...prev, bgImage: 'none' }));
    }
  }, [theme]); // Dependency on theme

  // Apply Appearance
  useEffect(() => {
    localStorage.setItem('medha-appearance', JSON.stringify(appearance));
    
    const root = document.documentElement;
    
    // Background Image Logic
    // Quote the URL to handle spaces/parens in Cloudinary defaults if any
    if (!appearance.bgImage || appearance.bgImage === 'none') {
      root.style.setProperty('--bg-image', 'none');
    } else {
      // Optimize Cloudinary URLs for performance (WebP/AVIF, quality reduction)
      const optimizedUrl = getOptimizedWallpaperUrl(appearance.bgImage);
      root.style.setProperty('--bg-image', `url("${optimizedUrl}")`);
    }

    // Overlay
    root.style.setProperty('--bg-overlay', appearance.bgOverlay);

    // Font Family
    const fontStacks = {
      'Inter': '"Inter", sans-serif',
      'Roboto': '"Roboto", "Inter", sans-serif',
      'Open Sans': '"Open Sans", sans-serif',
      'Playfair Display': '"Playfair Display", serif',
      'Monospace': '"Fira Code", monospace'
    };
    root.style.setProperty('--custom-font', fontStacks[appearance.bgFont] || appearance.bgFont || fontStacks['Inter']);

  }, [appearance]);

  const toggleTheme = () => {
    // Legacy toggle, no longer main way
    if (!DARK_THEME_ENABLED) return;
    setTheme((prevTheme) => (prevTheme === 'light' ? 'premium-dark' : 'light'));
  };

  const updateAppearance = (key, value) => {
    setAppearance(prev => {
      const newState = { ...prev, [key]: value };
      
      // If updating background image, associate it with current theme
      if (key === 'bgImage') {
        newState.themeWallpapers = {
          ...prev.themeWallpapers,
          [theme]: value
        };
      }
      return newState;
    });
  };

  // Expose whether dark theme is available
  const isDarkThemeEnabled = DARK_THEME_ENABLED;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDarkThemeEnabled, appearance, updateAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
};
