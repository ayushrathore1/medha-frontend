import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaImage, FaFont, FaPalette, FaLock, FaCrown } from "react-icons/fa6";
import Button from '../Common/Button';
import useAuthGuard from '../../hooks/useAuthGuard';

const FONTS = [
  { id: 'Inter', name: 'Inter (Default)' },
  { id: 'Roboto', name: 'Roboto' },
  { id: 'Open Sans', name: 'Open Sans' },
  { id: 'Playfair Display', name: 'Playfair Display (Serif)' },
  { id: 'Monospace', name: 'Monospace' },
];

const THEMES = [
  { id: 'light', name: 'Standard Light', color: '#f8fafc', preview: '☀️' },
  { id: 'premium-dark', name: 'Premium Dark', color: '#0f172a', preview: '🌙' },
  { id: 'theme-cognitive-clarity', name: 'Cognitive Clarity', color: '#FBFBFD', border: '#E2E8F0', preview: '📄' },
  { id: 'theme-netrunner', name: 'Netrunner', color: '#050505', accent: '#00E5FF', preview: '💻' },
  { id: 'theme-deep-cosmos', name: 'Deep Cosmos', color: '#020617', accent: '#6366F1', preview: '🌌' },
];

const AppearanceSettings = () => {
  const { appearance, updateAppearance, theme, setTheme } = useTheme();
  const { isAuthenticated, requireAuth } = useAuthGuard();
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // For guests, only premium-dark theme is allowed
  const canSelectTheme = (themeId) => {
    if (isAuthenticated) return true;
    return themeId === 'premium-dark';
  };

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallpapers`);
        if (response.ok) {
          const data = await response.json();
          // Add 'Solid Color' option to the beginning or end
          const solidOption = { id: 'solid', name: 'Solid Color', url: 'none', categories: ['all'] };
          const formattedData = data.map(w => ({
            id: w.publicId,
            name: w.name,
            url: w.url,
            categories: w.categories || []
          }));
          setWallpapers([solidOption, ...formattedData]);
        }
      } catch (error) {
        console.error('Failed to fetch wallpapers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateAppearance('bgImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <FaPalette /> Color Theme
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {THEMES.map((t) => {
            const isLocked = !canSelectTheme(t.id);
            return (
            <button
              key={t.id}
              onClick={() => {
                if (isLocked) {
                  requireAuth(() => setTheme(t.id), 'Premium Themes');
                } else {
                  setTheme(t.id);
                }
              }}
              className={`relative p-3 rounded-lg border-2 transition-all group flex flex-col items-center gap-2 ${
                theme === t.id
                  ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 bg-indigo-50'
                  : isLocked
                    ? 'border-[var(--border-default)] opacity-60 cursor-pointer bg-[var(--bg-primary)]'
                    : 'border-[var(--border-default)] hover:border-indigo-300 bg-[var(--bg-primary)]'
              }`}
              title={isLocked ? 'Sign up to unlock this theme' : t.name}
            >
              {/* Lock overlay for locked themes */}
              {isLocked && (
                <div className="absolute top-1 right-1 z-10">
                  <FaLock className="text-yellow-500" size={10} />
                </div>
              )}
              <div 
                className="w-full h-10 rounded-md shadow-sm border flex items-center justify-center text-lg relative overflow-hidden" 
                style={{ 
                  backgroundColor: t.color,
                  borderColor: t.border || 'transparent'
                }}
              >
                {t.accent && (
                   <div className="absolute inset-0 opacity-20" style={{ backgroundColor: t.accent }}></div>
                )}
                <span className="relative z-10">{t.preview}</span>
              </div>
              <span className={`text-xs font-bold text-center ${theme === t.id ? 'text-indigo-700' : 'text-[var(--text-secondary)]'}`}>
                {t.name}
              </span>
              {isLocked && (
                <span className="text-[10px] text-yellow-600 flex items-center gap-1">
                  <FaCrown size={8} /> Premium
                </span>
              )}
            </button>
          )})}
        </div>
      </div>
      
      <hr className="border-slate-100" />

      {/* Background Settings */}
      <div>
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <FaImage /> Background Wallpaper
        </label>
        
        {loading ? (
          <div className="text-sm text-[var(--text-secondary)] py-4">Loading wallpapers...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {wallpapers.filter(p => p.categories.includes('all') || p.categories.includes(theme) || (theme === 'light' && p.categories.includes('light')) || (theme === 'premium-dark' && p.categories.includes('premium-dark'))).map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateAppearance('bgImage', preset.url)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                  appearance.bgImage === preset.url
                    ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2'
                    : 'border-[var(--border-default)] hover:border-indigo-300'
                }`}
              >
                {preset.url === 'none' ? (
                  <div className="w-full h-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] text-xs font-medium">
                    None
                  </div>
                ) : (
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-center">
            <div className="relative flex-1">
                <input
                    type="file"
                    id="bg-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('bg-upload').click()}
                    fullWidth
                    className="text-sm"
                >
                    Only Upload Custom Wallpaper
                </Button>
            </div>
            {appearance.bgImage !== 'none' && !wallpapers.find(p => p.url === appearance.bgImage) && (
                 <div className="text-xs text-green-500 font-medium px-2">
                    Custom Image Active
                 </div>
            )}
        </div>
      </div>

      {/* Opacity / Overlay */}
      <div>
        <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FaPalette /> Background Overlay Strength
            </label>
            <span className="text-xs font-mono text-[var(--text-secondary)]">{Math.round(appearance.bgOverlay * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={appearance.bgOverlay}
          onChange={(e) => updateAppearance('bgOverlay', parseFloat(e.target.value))}
          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Increase overlay to improve text readability on busy backgrounds.
        </p>
      </div>

      <hr className="border-slate-100" />

      {/* Font Settings */}
      <div>
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <FaFont /> Font Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => updateAppearance('bgFont', font.id)}
              className={`px-3 py-2 rounded-lg border-2 text-sm transition-all text-left ${
                (appearance.bgFont || 'Inter') === font.id
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
              style={{ fontFamily: font.name.split(' (')[0] }} // Rough approximation for preview
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
