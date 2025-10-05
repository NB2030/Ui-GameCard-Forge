import React from 'react';
import type { AppSettings } from '../hooks/useAppSettings';

/**
 * @interface SettingsModalProps
 * @description Props for the SettingsModal component.
 */
interface SettingsModalProps {
  /** @type {boolean} Determines whether the modal is currently visible. */
  isOpen: boolean;
  /** @type {() => void} Callback function to close the modal. */
  onClose: () => void;
  /** @type {AppSettings} The current application settings object. */
  settings: AppSettings;
  /** @type {(newSettings: Partial<AppSettings>) => void} Callback to update one or more settings. */
  onSettingsChange: (newSettings: Partial<AppSettings>) => void;
  /** @type {() => void} Callback to reset all settings to their default values. */
  onReset: () => void;
}

/**
 * @description A modal dialog component that allows the user to configure application-level settings, such as UI theme, font size, and canvas background color.
 * @param {SettingsModalProps} props The props for the component.
 * @returns {React.ReactElement | null} The rendered settings modal, or null if it is not open.
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onReset
}) => {
  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className={`relative rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col ${
        isDark ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-[#334155]' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Settings</h2>
          <button
            onClick={onClose}
            className={`text-2xl leading-none ${
              isDark ? 'text-gray-500 hover:text-cyan-400' : 'text-gray-400 hover:text-cyan-600'
            }`}
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-cyan-400' : 'text-gray-700'
            }`}>
              Theme Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onSettingsChange({ theme: 'light' })}
                className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-all ${
                  settings.theme === 'light'
                    ? 'bg-[#0E95B6]/20 border-[#0E95B6]/50 text-[#0E95B6]'
                    : isDark ? 'bg-[#334155] border-[#475569] text-gray-300 hover:bg-[#475569]' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onSettingsChange({ theme: 'dark' })}
                className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="ui-font-size" className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-cyan-400' : 'text-gray-700'
            }`}>
              UI Font Size: {settings.uiFontSize}px
            </label>
            <input
              id="ui-font-size"
              type="range"
              min="12"
              max="20"
              step="1"
              value={settings.uiFontSize}
              onChange={(e) => onSettingsChange({ uiFontSize: parseInt(e.target.value) })}
              className="w-full h-2 appearance-none"
            />
            <div className={`flex justify-between text-xs mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>12px</span>
              <span>20px</span>
            </div>
          </div>

          <div>
            <label htmlFor="canvas-bg" className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-cyan-400' : 'text-gray-700'
            }`}>
              Canvas Background Color
            </label>
            <div className="flex gap-2">
              <div className={`relative w-16 h-10 rounded overflow-hidden border ${isDark ? 'border-[#475569]' : 'border-gray-300'}`}>
                <input
                  id="canvas-bg"
                  type="color"
                  value={settings.canvasBackgroundColor}
                  onChange={(e) => onSettingsChange({ canvasBackgroundColor: e.target.value })}
                  className="absolute -top-2 -left-2 w-20 h-14 border-none cursor-pointer appearance-none bg-transparent"
                />
              </div>
              <input
                type="text"
                value={settings.canvasBackgroundColor}
                onChange={(e) => onSettingsChange({ canvasBackgroundColor: e.target.value })}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                  isDark ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                }`}
                placeholder="#f3f4f6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ui-scale" className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-cyan-400' : 'text-gray-700'
            }`}>
              UI Scale: {Math.round(settings.uiScale * 100)}%
            </label>
            <input
              id="ui-scale"
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={settings.uiScale}
              onChange={(e) => onSettingsChange({ uiScale: parseFloat(e.target.value) })}
              className="w-full h-2 appearance-none"
            />
            <div className={`flex justify-between text-xs mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>80%</span>
              <span>120%</span>
            </div>
          </div>
        </div>

        <div className={`px-6 py-4 border-t flex gap-3 ${
          isDark ? 'border-[#334155]' : 'border-gray-200'
        }`}>
          <button
            onClick={onReset}
            className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors border ${
              isDark ? 'bg-[#334155] text-gray-300 hover:bg-[#475569] border-[#475569]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
            }`}
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
              isDark ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;