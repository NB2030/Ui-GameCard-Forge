import { useState, useEffect } from 'react';

/**
 * @interface AppSettings
 * @description Defines the shape of the application's user-configurable settings.
 */
export interface AppSettings {
  /** @type {'light' | 'dark'} The current UI theme. */
  theme: 'light' | 'dark';
  /** @type {string} The background color of the main canvas area where the card is displayed. */
  canvasBackgroundColor: string;
}

/**
 * @const {AppSettings} DEFAULT_SETTINGS
 * @description The default values for the application settings, used when no saved settings are found or when settings are reset.
 */
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  canvasBackgroundColor: '#f3f4f6'
};

/**
 * @const {string} STORAGE_KEY
 * @description The key used to save and retrieve application settings from the browser's localStorage.
 */
const STORAGE_KEY = 'gamecard-forge-settings';

/**
 * @description A custom hook to manage application-wide settings. It handles loading settings from localStorage on initial render, saving them whenever they change, and provides functions to update or reset them.
 * @returns {{settings: AppSettings, updateSettings: (newSettings: Partial<AppSettings>) => void, resetSettings: () => void}} An object containing the current settings, a function to update them, and a function to reset them to default.
 */
export const useAppSettings = () => {
  /**
   * @description State hook that holds the current application settings. It initializes its state by attempting to load saved settings from localStorage, falling back to default settings if none are found or if an error occurs.
   */
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Merge saved settings with defaults to ensure all keys are present
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return DEFAULT_SETTINGS;
  });

  /**
   * @description Effect hook that persists the current settings to localStorage whenever the `settings` state changes. This ensures that user preferences are saved across sessions.
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  /**
   * @description A function to update one or more settings. It merges the provided partial settings object with the existing settings.
   * @param {Partial<AppSettings>} newSettings - An object containing the settings properties to update.
   */
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  /**
   * @description A function to reset all application settings back to their default values.
   */
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    /** @type {AppSettings} The current, reactive settings object. */
    settings,
    /** @type {(newSettings: Partial<AppSettings>) => void} Function to update one or more settings. */
    updateSettings,
    /** @type {() => void} Function to reset all settings to default. */
    resetSettings
  };
};
