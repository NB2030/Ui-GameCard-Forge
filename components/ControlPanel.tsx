/**
 * @file ControlPanel.tsx
 * This file contains the left control panel UI component for customizing the game card.
 * It focuses on content and styling controls, with templates moved to the right panel.
 */
import React, { useState } from 'react';
import type { CardConfig, Layout, CustomFont, LayoutId } from '../types';
import TabButton from './controls/TabButton';
import ContentTab from './panel-tabs/ContentTab';
import CardStyleTab from './panel-tabs/CardStyleTab';
import ButtonStyleTab from './panel-tabs/ButtonStyleTab';


/**
 * @interface ControlPanelProps
 * @description Props for the main ControlPanel component.
 */
interface ControlPanelProps {
  /** @type {CardConfig} The current configuration state of the card. */
  config: CardConfig;
  /** @type {React.Dispatch<React.SetStateAction<CardConfig>>} The state setter function to update the card's configuration. */
  setConfig: React.Dispatch<React.SetStateAction<CardConfig>>;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The handler function for when a user uploads an image. */
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The handler function for when a user uploads a custom currency icon. */
  onCustomCurrencyIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {Layout[]} The array of available layouts. */
  layouts: Layout[];
  /** @type {LayoutId} The ID of the currently active layout. */
  activeLayoutId: LayoutId;
  /** @type {(layoutId: LayoutId) => void} The handler function for changing the active layout. */
  onLayoutChange: (layoutId: LayoutId) => void;
  /** @type {(themeName: string) => void} The handler function for selecting a new theme preset. */
  onThemeChange: (themeName: string) => void;
  /** @type {CustomFont[]} An array of custom fonts uploaded by the user. */
  customFonts: CustomFont[];
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The handler function for when a user uploads font files. */
  onFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} A flag to indicate if dark mode is enabled. */
  isDark: boolean;
}

/**
 * @description The left control panel component that houses all primary styling and content customization options. It uses a tabbed interface to organize controls for "Content", "Card Style", and "Button Style", providing a centralized place for users to modify the card's appearance and data.
 * @param {ControlPanelProps} props The props for the component.
 * @returns {React.ReactElement} The rendered control panel.
 */
const ControlPanel: React.FC<ControlPanelProps> = ({ 
    config, 
    setConfig, 
    onImageUpload,
    onCustomCurrencyIconUpload,
    layouts, 
    activeLayoutId, 
    onLayoutChange, 
    onThemeChange,
    customFonts,
    onFontUpload,
    isDark
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'card' | 'button'>('content');

  /**
   * @description A generic change handler for all input types (text, number, select, checkbox) within the control panel. It intelligently updates the corresponding property in the main card configuration state based on the input's name, value, and type.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event from an input or select element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-6 py-4">
        {/* Tab Navigation */}
        <div className={`rounded-lg p-1 ${isDark ? 'bg-[#1e293b]' : 'bg-gray-100'}`}>
            <nav className="flex justify-evenly" aria-label="Tabs">
                <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} isDark={isDark}>Content</TabButton>
                <TabButton active={activeTab === 'card'} onClick={() => setActiveTab('card')} isDark={isDark}>Card Style</TabButton>
                <TabButton active={activeTab === 'button'} onClick={() => setActiveTab('button')} isDark={isDark}>Button Style</TabButton>
            </nav>
        </div>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
        {activeTab === 'content' && (
            <ContentTab
                config={config}
                handleChange={handleChange}
                onImageUpload={onImageUpload}
                onCustomCurrencyIconUpload={onCustomCurrencyIconUpload}
                isDark={isDark}
            />
        )}
        {activeTab === 'card' && (
            <CardStyleTab
                config={config}
                handleChange={handleChange}
                customFonts={customFonts}
                onFontUpload={onFontUpload}
                isDark={isDark}
            />
        )}
        {activeTab === 'button' && (
            <ButtonStyleTab
                config={config}
                handleChange={handleChange}
                activeLayoutId={activeLayoutId}
                customFonts={customFonts}
                isDark={isDark}
            />
        )}
      </div>
    </div>
  );
};

export default ControlPanel;