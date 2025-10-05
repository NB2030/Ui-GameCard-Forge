/**
 * @file HeaderToolbar.tsx
 * This component renders the top header toolbar with import/export buttons and download options.
 */
import React from 'react';
import type { CardConfig } from '../types';
import DownloadDropdown from './DownloadDropdown';

// --- UI Icons ---
const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const AppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
);

const RedoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

/**
 * @interface HeaderToolbarProps
 * @description Props for the HeaderToolbar component.
 */
interface HeaderToolbarProps {
  /** @type {() => void} Callback function to handle the export of the current card configuration. */
  onConfigExport: () => void;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} Callback function to handle the import of a card configuration from a file. */
  onConfigImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {CardConfig} The current card configuration, passed to the DownloadDropdown. */
  config: CardConfig;
  /** @type {React.RefObject<HTMLDivElement>} Ref to the main SVG container, passed to the DownloadDropdown for exporting. */
  svgContainerRef: React.RefObject<HTMLDivElement>;
  /** @type {React.RefObject<HTMLDivElement>} Ref to the standalone button SVG container, passed to the DownloadDropdown. */
  buttonSvgContainerRef: React.RefObject<HTMLDivElement>;
  /** @type {React.RefObject<HTMLDivElement>} Ref to the standalone button (hover state) SVG container, passed to the DownloadDropdown. */
  buttonWithHoverSvgContainerRef: React.RefObject<HTMLDivElement>;
  /** @type {(message: string) => void} Callback function to report errors, passed to the DownloadDropdown. */
  onError: (message: string) => void;
  /** @type {() => void} Callback function to open the main settings modal. */
  onOpenSettings: () => void;
  /** @type {boolean} Indicates if the dark theme is currently active, used for styling the toolbar. */
  isDark: boolean;
  /** @type {() => void} Callback function to undo the last change. */
  onUndo?: () => void;
  /** @type {() => void} Callback function to redo the last undone change. */
  onRedo?: () => void;
  /** @type {() => void} Callback function to reset all card customization settings. */
  onReset?: () => void;
  /** @type {boolean} Indicates if undo is available. */
  canUndo?: boolean;
  /** @type {boolean} Indicates if redo is available. */
  canRedo?: boolean;
}

/**
 * @description Renders the top header toolbar for the application. This component includes the application title, buttons for importing and exporting themes, a settings button, and the main download dropdown menu.
 * @param {HeaderToolbarProps} props The props for the component.
 * @returns {React.ReactElement} The rendered header toolbar element.
 */
const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  onConfigExport,
  onConfigImport,
  config,
  svgContainerRef,
  buttonSvgContainerRef,
  buttonWithHoverSvgContainerRef,
  onError,
  onOpenSettings,
  isDark,
  onUndo,
  onRedo,
  onReset,
  canUndo = false,
  canRedo = false
}) => {
  return (
    <div className={`h-14 flex items-center justify-between px-6 shadow-sm ${
      isDark ? 'bg-[#1e293b] border-b border-[#334155]' : 'bg-white border-b border-gray-200'
    }`}>

      <div className="flex items-center">
        <div className={isDark ? 'text-cyan-400' : 'text-gray-800'}>
          <AppIcon />
        </div>
        <h1 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>GameCard Forge</h1>
        <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
          isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-100 text-blue-600'
        }`}>Beta</span>
      </div>

      <div className="flex items-center gap-3">
        <div>
            <label htmlFor="config-import" className={`flex items-center justify-center px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 border transition-all duration-200 ease-in-out cursor-pointer text-sm ${
              isDark ? 'bg-[#334155] text-cyan-400 hover:bg-[#475569] border-[#475569] focus:ring-cyan-500 focus:ring-offset-[#1e293b]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus:ring-cyan-500'
            }`}>
                <ImportIcon />
                Import Theme
            </label>
            <input
                id="config-import"
                name="config-import"
                type="file"
                accept="application/json,.json"
                onChange={onConfigImport}
                className="sr-only"
            />
        </div>

        <button
            type="button"
            onClick={onConfigExport}
            className={`flex items-center justify-center px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 border transition-all duration-200 ease-in-out text-sm ${
              isDark ? 'bg-[#334155] text-cyan-400 hover:bg-[#475569] border-[#475569] focus:ring-cyan-500 focus:ring-offset-[#1e293b]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus:ring-cyan-500'
            }`}
        >
            <ExportIcon />
            Export Theme
        </button>
      </div>

      <div className="flex items-center gap-2">
        {onUndo && (
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center justify-center p-2.5 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 border transition-all duration-200 ease-in-out ${
              canUndo
                ? isDark
                  ? 'bg-[#334155] text-cyan-400 hover:bg-[#475569] border-[#475569] focus:ring-cyan-500 focus:ring-offset-[#1e293b]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus:ring-cyan-500'
                : isDark
                  ? 'bg-[#1e293b] text-gray-600 border-[#334155] cursor-not-allowed'
                  : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            aria-label="Undo"
            title="Undo"
          >
            <UndoIcon />
          </button>
        )}

        {onRedo && (
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex items-center justify-center p-2.5 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 border transition-all duration-200 ease-in-out ${
              canRedo
                ? isDark
                  ? 'bg-[#334155] text-cyan-400 hover:bg-[#475569] border-[#475569] focus:ring-cyan-500 focus:ring-offset-[#1e293b]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus:ring-cyan-500'
                : isDark
                  ? 'bg-[#1e293b] text-gray-600 border-[#334155] cursor-not-allowed'
                  : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            aria-label="Redo"
            title="Redo"
          >
            <RedoIcon />
          </button>
        )}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className={`flex items-center justify-center p-2.5 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 border transition-all duration-200 ease-in-out ${
              isDark ? 'bg-[#334155] text-cyan-400 hover:bg-[#475569] border-[#475569] focus:ring-cyan-500 focus:ring-offset-[#1e293b]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus:ring-cyan-500'
            }`}
            aria-label="Reset All"
            title="Reset All Customization"
          >
            <ResetIcon />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex items-center justify-center p-2.5 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 border transition-all duration-200 ease-in-out ${
            isDark ? 'bg-[#334155] text-cyan-400 hover:bg-[#475569] border-[#475569] focus:ring-cyan-500 focus:ring-offset-[#1e293b]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus:ring-cyan-500'
          }`}
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
        <DownloadDropdown
          config={config}
          svgContainerRef={svgContainerRef}
          buttonSvgContainerRef={buttonSvgContainerRef}
          buttonWithHoverSvgContainerRef={buttonWithHoverSvgContainerRef}
          onError={onError}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default HeaderToolbar;