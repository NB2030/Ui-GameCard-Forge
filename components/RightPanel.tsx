/**
 * @file RightPanel.tsx
 * This component contains the right panel with tabs for templates library and settings.
 */
import React, { useState } from 'react';
import type { CardConfig, Layout, CustomFont, LayoutId } from '../types';
import TemplatesLibraryTab from './panel-tabs/TemplatesLibraryTab';
import ImageAndFontsTab from './panel-tabs/ImageAndFontsTab';
import TabButton from './controls/TabButton';

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
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-6 py-4">
        <div className={`rounded-lg p-1 ${isDark ? 'bg-[#1e293b]' : 'bg-gray-100'}`}>
            <nav className="flex justify-evenly" aria-label="Tabs">
              <TabButton
                active={activeTab === 'templates'}
                onClick={() => setActiveTab('templates')}
                isDark={isDark}
              >
                Templates & Presets
              </TabButton>
              <TabButton
                active={activeTab === 'assets'}
                onClick={() => setActiveTab('assets')}
                isDark={isDark}
              >
                Image & Fonts
              </TabButton>
            </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
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