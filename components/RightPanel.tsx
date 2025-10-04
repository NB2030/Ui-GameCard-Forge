/**
 * @file RightPanel.tsx
 * This component contains the right panel with tabs for templates library and settings.
 */
import React, { useState } from 'react';
import type { CardConfig, Layout, CustomFont, LayoutId } from '../types';
import TemplatesLibraryTab from './panel-tabs/TemplatesLibraryTab';
import ImageAndFontsTab from './panel-tabs/ImageAndFontsTab';

/**
 * @interface RightPanelProps
 * @description Props for the RightPanel component.
 */
interface RightPanelProps {
  /** @type {Layout[]} An array of all available layout categories and their themes. */
  layouts: Layout[];
  /** @type {LayoutId} The ID of the currently selected layout category. */
  activeLayoutId: LayoutId;
  /** @type {(layoutId: LayoutId) => void} Callback to change the active layout category. */
  onLayoutChange: (layoutId: LayoutId) => void;
  /** @type {(themeName: string) => void} Callback to apply a theme to the card. */
  onThemeChange: (themeName: string) => void;
  /** @type {CardConfig} The current card configuration object. */
  config: CardConfig;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} Callback for the main card image upload event. */
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {CustomFont[]} An array of custom fonts uploaded by the user. */
  customFonts: CustomFont[];
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} Callback for the custom font upload event. */
  onFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} Flag indicating if the dark theme is active for UI styling. */
  isDark: boolean;
}

/**
 * @description The right-side panel component that contains a tabbed interface for managing assets and browsing templates. It allows users to switch between the "Templates & Presets" library and the "Image & Fonts" asset management panel.
 * @param {RightPanelProps} props The props for the component.
 * @returns {React.ReactElement} The rendered right panel element.
 */
const RightPanel: React.FC<RightPanelProps> = ({
  layouts,
  activeLayoutId,
  onLayoutChange,
  onThemeChange,
  config,
  onImageUpload,
  customFonts,
  onFontUpload,
  isDark
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'assets'>('templates');

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-shrink-0 border-b px-6 py-4 ${
        isDark ? 'border-[#2d3748] bg-[#1a232e]' : 'border-gray-200 bg-white'
      }`}>
        <nav className="flex space-x-1" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'templates'
                ? isDark ? 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
                : isDark ? 'text-gray-400 hover:text-[#22d3ee] hover:bg-[#1e2837]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Templates & Presets
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'assets'
                ? isDark ? 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
                : isDark ? 'text-gray-400 hover:text-[#22d3ee] hover:bg-[#1e2837]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Image & Fonts
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'templates' && (
          <TemplatesLibraryTab
            layouts={layouts}
            activeLayoutId={activeLayoutId}
            onLayoutChange={onLayoutChange}
            onThemeChange={onThemeChange}
            config={config}
            isDark={isDark}
          />
        )}
        {activeTab === 'assets' && (
          <ImageAndFontsTab
            config={config}
            onImageUpload={onImageUpload}
            customFonts={customFonts}
            onFontUpload={onFontUpload}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};

export default RightPanel;