/**
 * @file App.tsx
 * This is the main application component. It orchestrates the state management,
 * UI rendering, and all the core logic for the SVG game card generator, including
 * customization, image uploads, and asset exporting.
 */
import React, { useState, useRef, useEffect } from 'react';

import ControlPanel from './components/ControlPanel';
import CardSvg from './components/CardSvg';
import CardSvgHorizontal from './components/CardSvgHorizontal';
import ButtonSvg from './components/ButtonSvg';
import DownloadDropdown from './components/DownloadDropdown';
import HeaderToolbar from './components/HeaderToolbar';
import RightPanel from './components/RightPanel';
import SettingsModal from './components/SettingsModal';
import LicenseGate from './components/auth/LicenseGate';
import UserProfileModal from './components/UserProfileModal';
import useCardConfig from './hooks/useCardConfig';
import { useAppSettings } from './hooks/useAppSettings';
import { useHistory } from './hooks/useHistory';
import { useAuth } from './hooks/useAuth';
import { darkenColor } from './utils/color';
import type { CustomFont, Layout, Theme, CardConfig, BaseLayoutId } from './types';
import { downloadJson } from './utils/exportUtils';
import { validateCardConfig, sanitizeString } from './utils/validation';
import { layouts as initialLayouts } from './themes';

/**
 * The main application component.
 * @returns {React.ReactElement} The rendered application.
 */
const App: React.FC = () => {
  const {
    config: baseConfig,
    setConfig: setBaseConfig,
    activeLayoutId,
    setActiveLayoutId,
    activeBaseLayoutId,
    setActiveBaseLayoutId,
    handleLayoutChange: baseHandleLayoutChange,
    handleThemeChange: baseHandleThemeChange,
    allLayouts,
    setAllLayouts
  } = useCardConfig();

  const {
    state: config,
    setState: setConfig,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory
  } = useHistory<CardConfig>(baseConfig);

  useEffect(() => {
    setBaseConfig(config);
  }, [config, setBaseConfig]);

  useEffect(() => {
    setConfig(baseConfig, true);
  }, [baseConfig]);

  const handleLayoutChange = (layoutId: string) => {
    baseHandleLayoutChange(layoutId);
  };

  const handleThemeChange = (themeName: string) => {
    baseHandleThemeChange(themeName);
  };

  const getInitialConfig = (): CardConfig => {
    const firstLayout = initialLayouts[0];
    const firstTheme = firstLayout.themes[0];
    return {
      ...firstTheme.config,
      image: config.image,
      customCurrencyIcon: config.customCurrencyIcon,
    };
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all customization settings? This action cannot be undone.')) {
      const initialConfig = getInitialConfig();
      setConfig(initialConfig);
      resetHistory(initialConfig);
    }
  };

  const { settings, updateSettings, resetSettings } = useAppSettings();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);

  // Refs to the on-screen and off-screen SVG containers for exporting.
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const buttonSvgContainerRef = useRef<HTMLDivElement>(null);
  const buttonWithHoverSvgContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles the image file upload event.
   * Reads the selected image as a Data URL and updates the config state.
   * @param e - The input change event.
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prevConfig => ({
          ...prevConfig,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  /**
   * Handles the custom currency icon file upload event.
   * Reads the selected image as a Data URL and updates the config state.
   * @param e - The input change event.
   */
  const handleCustomCurrencyIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image for the icon.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prevConfig => ({
          ...prevConfig,
          customCurrencyIcon: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handles the custom font file upload event.
   * Reads font files, generates data URLs, and adds them to the custom fonts state.
   * @param e - The input change event.
   */
  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError(null);

    // FIX: Explicitly type `file` as `File` to resolve TypeScript errors where it was inferred as `unknown`.
    Array.from(files).forEach((file: File) => {
      const validTypes = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2', 'application/x-font-ttf', 'application/x-font-opentype'];
      const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        setError(`Unsupported file type: ${file.name}. Please upload TTF, OTF, WOFF, or WOFF2.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        
        // Derive font name from filename (e.g., "OpenSans-Bold.ttf" -> "OpenSans-Bold")
        const fontName = file.name.replace(/\.[^/.]+$/, "");
        
        // Determine font format for CSS `src` property
        const extension = file.name.split('.').pop()?.toLowerCase();
        let format = '';
        switch (extension) {
            case 'ttf': format = 'truetype'; break;
            case 'otf': format = 'opentype'; break;
            case 'woff': format = 'woff'; break;
            case 'woff2': format = 'woff2'; break;
            default: return; // Should not happen due to type check
        }

        // Add font if it doesn't already exist
        setCustomFonts(prevFonts => {
            if (prevFonts.some(f => f.name === fontName)) {
                return prevFonts; // Avoid duplicates
            }
            return [...prevFonts, { name: fontName, dataUrl, format }];
        });
      };
      reader.onerror = () => {
        setError(`Failed to read font file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

     // Reset file input value to allow re-uploading the same file
    e.target.value = '';
  };

  /**
   * Exports the current card configuration and its base layout to a JSON file.
   */
  const handleConfigExport = () => {
    // Exclude the image data from the export as it can be very large
    const { image, customCurrencyIcon, ...exportableConfig } = config;
    const exportData = {
      layoutId: activeBaseLayoutId,
      config: exportableConfig,
    };
    downloadJson(exportData, 'game-card-theme.json');
  };

  /**
   * Imports a card configuration from a JSON file and saves it as a new template.
   * @param e - The input change event from the file picker.
   */
  const handleConfigImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file content.");
        }
        
        const importedData = JSON.parse(text);

        // --- STAGE 1: Basic Structural Validation ---
        if (
            typeof importedData !== 'object' || importedData === null ||
            !importedData.config || typeof importedData.config !== 'object' ||
            !importedData.layoutId || !['vertical', 'horizontal'].includes(importedData.layoutId)
        ) {
            throw new Error("Invalid JSON structure. File must contain a 'layoutId' ('vertical' or 'horizontal') and a 'config' object.");
        }

        // --- STAGE 2: Sanitize all string inputs to prevent XSS ---
        const sanitizedConfig: { [key: string]: any } = {};
        for (const key in importedData.config) {
            const value = importedData.config[key];
            if (typeof value === 'string') {
                sanitizedConfig[key] = sanitizeString(value);
            } else {
                sanitizedConfig[key] = value;
            }
        }
        
        // --- STAGE 3: Detailed Field and Type Validation ---
        const { isValid, errors } = validateCardConfig(sanitizedConfig);
        if (!isValid) {
            // Join up to 3 errors for a concise message
            const errorMessage = errors.slice(0, 3).join(' ');
            throw new Error(`Invalid config data. ${errorMessage}${errors.length > 3 ? ' ...' : ''}`);
        }
        
        const importedConfig: Omit<CardConfig, 'image' | 'customCurrencyIcon'> = sanitizedConfig as Omit<CardConfig, 'image' | 'customCurrencyIcon'>;
        const importedLayoutId: BaseLayoutId = importedData.layoutId;

        setAllLayouts(prevLayouts => {
            // Deep copy to avoid direct state mutation
            const layoutsCopy: Layout[] = JSON.parse(JSON.stringify(prevLayouts));
            const importedLayout = layoutsCopy.find(l => l.id === 'imported');

            if (!importedLayout) {
                console.error("Critical Error: The 'imported' layout category was not found.");
                setError("An internal error occurred: cannot find the imported themes category.");
                return prevLayouts;
            }

            // Check if an identical theme already exists
            const isDuplicate = importedLayout.themes.some((theme: Theme) => 
                JSON.stringify(theme.config) === JSON.stringify(importedConfig)
            );

            if (isDuplicate) {
                setError("This theme has already been imported.");
                return prevLayouts; // Return original state without changes
            }

            // Generate a unique name for the new theme
            let newThemeName = importedConfig.title || "Untitled Theme";
            const existingNames = importedLayout.themes.map((t: Theme) => t.name);
            let counter = 1;
            let finalName = newThemeName;
            while (existingNames.includes(finalName)) {
                counter++;
                finalName = `${newThemeName} (${counter})`;
            }

            const newTheme: Theme = {
                name: finalName,
                config: importedConfig,
                layoutId: importedLayoutId,
            };

            importedLayout.themes.push(newTheme);

            // Apply the newly imported config and switch the layout
            setConfig(prevConfig => ({
                ...importedConfig,
                image: prevConfig.image, // Preserve the existing image
                customCurrencyIcon: undefined, // Clear icon, as it's not exported
            }));
            setActiveLayoutId('imported');
            setActiveBaseLayoutId(importedLayoutId);

            return layoutsCopy;
        });

      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Import Failed: ${message}`);
      }
    };
    reader.onerror = () => {
       setError("Failed to read the selected file.");
    };
    reader.readAsText(file);
    
    // Reset file input to allow re-uploading the same file if needed
    e.target.value = '';
  };
  
  /**
   * Calculates the appropriate corner radius for the button based on the active layout.
   * @returns {number} The calculated corner radius.
   */
  const getButtonCornerRadius = () => {
    const buttonHeight = config.buttonHeight || 55;
    if (activeBaseLayoutId === 'horizontal') {
        const cardCornerRadius = config.cardCornerRadius || 0;
        return Math.max(0, cardCornerRadius - 6);
    }
    return buttonHeight / 2;
  };

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }, [isDark]);

  return (
    <LicenseGate isDark={isDark}>
      <div
        className={`h-screen w-full flex flex-col font-sans ${
          isDark ? 'bg-[#0f172a]' : 'bg-[#F9FAFB]'
        }`}
      >

        <HeaderToolbar
        onConfigExport={handleConfigExport}
        onConfigImport={handleConfigImport}
        config={config}
        svgContainerRef={svgContainerRef}
        buttonSvgContainerRef={buttonSvgContainerRef}
        buttonWithHoverSvgContainerRef={buttonWithHoverSvgContainerRef}
        onError={(message) => setError(message)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onUndo={undo}
        onRedo={redo}
        onReset={handleReset}
        canUndo={canUndo}
        canRedo={canRedo}
        isDark={isDark}
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {error && (
        <div className="bg-red-100 border-b border-red-400 text-red-700 px-6 py-3 flex justify-between items-center z-50" role="alert">
          <div>
            <strong className="font-bold">Error:</strong>
            <span className="ml-2">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="font-bold text-red-700 hover:text-red-900 text-xl" aria-label="Close">&times;</button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>

        <div className={`w-80 flex flex-col ${
          isDark ? 'bg-[#1a232e] border-r border-[#2d3748]' : 'bg-[#F9FAFB] border-r border-gray-200'
        }`} style={{ fontSize: `${settings.uiFontSize}px` }}>
          <ControlPanel
            config={config}
            setConfig={setConfig}
            onImageUpload={handleImageUpload}
            onCustomCurrencyIconUpload={handleCustomCurrencyIconUpload}
            layouts={allLayouts}
            activeLayoutId={activeLayoutId}
            onLayoutChange={handleLayoutChange}
            onThemeChange={handleThemeChange}
            customFonts={customFonts}
            onFontUpload={handleFontUpload}
            isDark={isDark}
          />
        </div>

        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ backgroundColor: settings.canvasBackgroundColor }}
        >
          <div
            ref={svgContainerRef}
            className="max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden"
            style={{
              aspectRatio: `${config.cardWidth} / ${config.cardHeight}`,
              width: 'min(100%, 500px)',
              height: 'auto'
            }}
          >
            {activeBaseLayoutId === 'vertical' && <CardSvg config={config} customFonts={customFonts} />}
            {activeBaseLayoutId === 'horizontal' && <CardSvgHorizontal config={config} customFonts={customFonts} />}
          </div>
        </div>

        <div className={`w-80 flex flex-col ${
          isDark ? 'bg-[#1a232e] border-l border-[#2d3748]' : 'bg-[#F9FAFB] border-l border-gray-200'
        }`} style={{ fontSize: `${settings.uiFontSize}px` }}>
          <RightPanel
            layouts={allLayouts}
            activeLayoutId={activeLayoutId}
            onLayoutChange={handleLayoutChange}
            onThemeChange={handleThemeChange}
            config={config}
            onImageUpload={handleImageUpload}
            customFonts={customFonts}
            onFontUpload={handleFontUpload}
            isDark={isDark}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSettingsChange={updateSettings}
        onReset={resetSettings}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        isDark={isDark}
      />

      {/* Off-screen containers for standalone SVGs used for export */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={buttonSvgContainerRef}>
            <ButtonSvg 
              buttonColor={config.buttonColor} 
              buttonText={config.buttonText} 
              buttonTextColor={config.buttonTextColor} 
              buttonFontFamily={config.buttonFontFamily} 
              buttonBold={config.buttonBold} 
              buttonFontSize={config.buttonFontSize}
              buttonGradientEnabled={config.buttonGradientEnabled}
              buttonGradientColorStart={config.buttonGradientColorStart}
              buttonGradientColorEnd={config.buttonGradientColorEnd}
              buttonGradientAngle={config.buttonGradientAngle}
              buttonWidth={config.buttonWidth}
              buttonHeight={config.buttonHeight}
              cornerRadius={getButtonCornerRadius()}
              customFonts={customFonts}
              buttonTextOffsetX={config.buttonTextOffsetX}
              buttonTextOffsetY={config.buttonTextOffsetY}
            />
          </div>
          <div ref={buttonWithHoverSvgContainerRef}>
            <ButtonSvg 
              buttonColor={darkenColor(config.buttonColor, 15)} 
              buttonText={config.buttonText} 
              buttonTextColor={config.buttonTextColor} 
              buttonFontFamily={config.buttonFontFamily} 
              buttonBold={config.buttonBold} 
              buttonFontSize={config.buttonFontSize}
              buttonGradientEnabled={config.buttonGradientEnabled}
              buttonGradientColorStart={darkenColor(config.buttonGradientColorStart || '#ffffff', 15)}
              buttonGradientColorEnd={darkenColor(config.buttonGradientColorEnd || '#000000', 15)}
              buttonGradientAngle={config.buttonGradientAngle}
              buttonWidth={config.buttonWidth}
              buttonHeight={config.buttonHeight}
              cornerRadius={getButtonCornerRadius()}
              customFonts={customFonts}
              buttonTextOffsetX={config.buttonTextOffsetX}
              buttonTextOffsetY={config.buttonTextOffsetY}
            />
          </div>
      </div>
      </div>
    </LicenseGate>
  );
};

export default App;