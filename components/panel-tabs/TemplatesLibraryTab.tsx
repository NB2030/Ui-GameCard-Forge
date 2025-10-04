/**
 * @file TemplatesLibraryTab.tsx
 * This component contains the templates library with visual previews for each theme.
 */
import React, { useRef, useEffect, useState } from 'react';
import type { CardConfig, Layout, LayoutId, Theme } from '../../types';
import CardSvg from '../CardSvg';
import CardSvgHorizontal from '../CardSvgHorizontal';

/**
 * @interface TemplatesLibraryTabProps
 * @description Props for the TemplatesLibraryTab component.
 */
interface TemplatesLibraryTabProps {
  /** @type {Layout[]} An array of all available layout categories, including their themes. */
  layouts: Layout[];
  /** @type {LayoutId} The ID of the currently active layout category (e.g., 'vertical', 'imported'). */
  activeLayoutId: LayoutId;
  /** @type {(layoutId: LayoutId) => void} Callback function to switch the active layout category. */
  onLayoutChange: (layoutId: LayoutId) => void;
  /** @type {(themeName: string) => void} Callback function to apply a selected theme to the main card. */
  onThemeChange: (themeName: string) => void;
  /** @type {CardConfig} The current card configuration, used to determine which theme is active. */
  config: CardConfig;
  /** @type {boolean} Flag indicating if the dark theme is active for UI styling. */
  isDark: boolean;
}

/**
 * @interface ThemePreviewProps
 * @description Props for the ThemePreview component.
 */
interface ThemePreviewProps {
  /** @type {Theme} The theme object to be rendered as a preview. */
  theme: Theme;
  /** @type {boolean} Indicates whether this theme is the currently active one. */
  isActive: boolean;
  /** @type {() => void} The callback function to be executed when the preview card is clicked. */
  onClick: () => void;
  /** @type {boolean} Flag indicating if the dark theme is active for UI styling. */
  isDark: boolean;
}

/**
 * @description A component that renders a single theme preview card. It dynamically generates a PNG thumbnail from the theme's SVG component for a lightweight and fast display.
 * @param {ThemePreviewProps} props The props for the component.
 * @returns {React.ReactElement} The rendered theme preview card.
 */
const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isActive, onClick, isDark }) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  /**
   * @description Effect hook to generate a PNG preview image from the theme's SVG definition.
   * This runs when the theme prop changes. It renders the full SVG off-screen, serializes it,
   * draws it onto a canvas, and then converts the canvas content to a data URL (PNG)
   * to be used in an `<img>` tag. This is more performant than rendering many complex SVGs directly.
   */
  useEffect(() => {
    const generatePreview = async () => {
      if (!svgRef.current) return;

      const svgElement = svgRef.current.querySelector('svg');
      if (!svgElement) return;

      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Set canvas size for thumbnail
        const scale = 0.3;
        canvas.width = theme.config.cardWidth * scale;
        canvas.height = theme.config.cardHeight * scale;

        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          setPreviewImage(dataUrl);
          URL.revokeObjectURL(url);
        };

        img.src = url;
      } catch (error) {
        console.error('Failed to generate theme preview:', error);
      }
    };

    // Small delay to ensure SVG is rendered before capturing
    const timer = setTimeout(generatePreview, 100);
    return () => clearTimeout(timer);
  }, [theme]);

  const previewConfig: CardConfig = {
    ...theme.config,
    image: undefined, // Don't include user images in previews
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 group ${
        isActive
          ? isDark ? 'border-cyan-500 bg-[#334155] shadow-lg' : 'border-cyan-500 bg-cyan-50 shadow-md'
          : isDark ? 'border-[#475569] bg-[#1e293b] hover:border-cyan-500' : 'border-gray-200 bg-white hover:border-cyan-400'
      }`}
    >
      {/* Preview Image */}
      <div className={`aspect-[4/5] p-3 flex items-center justify-center rounded-t-lg overflow-hidden ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        {previewImage ? (
          <img
            src={previewImage}
            alt={theme.name}
            className="max-w-full max-h-full object-contain drop-shadow-sm"
          />
        ) : (
          <div className={`w-full h-full rounded animate-pulse flex items-center justify-center ${isDark ? 'bg-[#334155]' : 'bg-gray-200'}`}>
            <div className="text-gray-400 text-xs">Loading...</div>
          </div>
        )}
      </div>

      {/* Theme Name */}
      <div className={`p-3 border-t ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <h4 className={`text-sm font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{theme.name}</h4>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {theme.layoutId === 'vertical' ? 'Vertical Card' : 'Horizontal Banner'}
        </p>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-500' : 'bg-cyan-500'}`}>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Hidden SVG for preview generation */}
      <div ref={svgRef} className="absolute -left-[9999px] -top-[9999px] pointer-events-none">
        <div style={{ width: theme.config.cardWidth, height: theme.config.cardHeight }}>
          {theme.layoutId === 'vertical' ? (
            <CardSvg config={previewConfig} customFonts={[]} />
          ) : (
            <CardSvgHorizontal config={previewConfig} customFonts={[]} />
          )}
        </div>
      </div>
    </div>
  );
};

const TemplatesLibraryTab: React.FC<TemplatesLibraryTabProps> = ({
  layouts,
  activeLayoutId,
  onLayoutChange,
  onThemeChange,
  config,
  isDark
}) => {
  const currentLayout = layouts.find(l => l.id === activeLayoutId);
  const currentThemes = currentLayout ? currentLayout.themes : [];
  const activeTheme = currentThemes.find(theme => theme.config.title === config.title);

  return (
    <div className="p-6 space-y-6">
      {/* Layout Selector */}
      <div className="space-y-3">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Select Template Category</h3>
        <div className="space-y-3">
          {/* Main Layout Types - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {layouts.filter(layout => layout.id === 'vertical' || layout.id === 'horizontal').map(layout => (
              <button
                key={layout.id}
                onClick={() => onLayoutChange(layout.id)}
                className={`p-4 text-center rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                  activeLayoutId === layout.id
                    ? isDark ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-md' : 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700 shadow-md'
                    : isDark ? 'border-[#475569] bg-[#1e293b] hover:border-cyan-500 text-gray-300' : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-white text-gray-700 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`flex items-center justify-center mb-2 ${activeLayoutId === layout.id ? '' : isDark ? 'text-gray-400' : ''}`}>
                  {layout.id === 'vertical' ? (
                    <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )}
                </div>
                <div className="font-semibold text-sm">{layout.name}</div>
              </button>
            ))}
          </div>
          
          {/* Imported Themes - Full Width, Compact */}
          {layouts.filter(layout => layout.id === 'imported').map(layout => (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={`w-full p-3 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${
                activeLayoutId === layout.id
                  ? isDark ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-md' : 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 shadow-md'
                  : isDark ? 'border-[#475569] bg-[#1e293b] hover:border-cyan-500 text-gray-300' : 'border-gray-300 bg-gradient-to-r from-white to-gray-50 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-white text-gray-700 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${activeLayoutId === layout.id ? (isDark ? 'bg-cyan-500/20' : 'bg-cyan-100') : (isDark ? 'bg-[#334155]' : 'bg-gray-100')}`}>
                    <svg className={`w-4 h-4 ${activeLayoutId !== layout.id && isDark ? 'text-gray-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{layout.name}</div>
                    <div className="text-xs opacity-75">Custom imported designs</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Themes Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Themes Library</h3>
            {currentThemes.length > 0 && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {currentThemes.length} theme{currentThemes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {currentThemes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {currentThemes.map(theme => (
              <ThemePreview
                key={theme.name}
                theme={theme}
                isActive={activeTheme?.name === theme.name}
                onClick={() => onThemeChange(theme.name)}
                isDark={isDark}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 rounded-lg border-2 border-dashed ${
            isDark ? 'bg-[#1e293b]/50 border-[#475569]' : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="text-gray-400 mb-2">
              <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className={`text-lg font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>No themes available</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {activeLayoutId === 'imported' 
                ? 'Import themes using the "Import Theme" button in the header.'
                : 'Switch to another category to see available themes.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesLibraryTab;