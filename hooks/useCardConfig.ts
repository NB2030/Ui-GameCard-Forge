/**
 * @file useCardConfig.ts
 * This custom hook manages the state for the card's configuration, including
 * layout and theme selection logic.
 */
import { useState, useEffect } from 'react';
import type { CardConfig, Layout, LayoutId, BaseLayoutId, Theme } from '../types';
import { layouts as initialLayouts } from '../themes';

const IMPORTED_THEMES_STORAGE_KEY = 'gamecard-forge-imported-themes';

/**
 * @description A custom hook to manage the game card's configuration state, including the current design settings, active layout, and theme selection. It also handles the persistence of user-imported themes to localStorage.
 * @returns {{
 *   config: CardConfig;
 *   setConfig: React.Dispatch<React.SetStateAction<CardConfig>>;
 *   activeLayoutId: LayoutId;
 *   setActiveLayoutId: React.Dispatch<React.SetStateAction<LayoutId>>;
 *   activeBaseLayoutId: BaseLayoutId;
 *   setActiveBaseLayoutId: React.Dispatch<React.SetStateAction<BaseLayoutId>>;
 *   handleLayoutChange: (layoutId: LayoutId) => void;
 *   handleThemeChange: (themeName: string) => void;
 *   allLayouts: Layout[];
 *   setAllLayouts: React.Dispatch<React.SetStateAction<Layout[]>>;
 * }} An object containing the current config, state setters, and event handlers for managing the card's state.
 */
const useCardConfig = () => {
  /**
   * @description State containing all layout categories and their associated themes, including both initial themes and user-imported ones.
   */
  const [allLayouts, setAllLayouts] = useState<Layout[]>(initialLayouts);

  /**
   * @description State for the active layout *category* selected by the user (e.g., 'vertical', 'horizontal', or 'imported'). This determines which set of themes is displayed in the library.
   */
  const [activeLayoutId, setActiveLayoutId] = useState<LayoutId>('vertical');

  /**
   * @description State for the unique name of the currently active theme. This is used to reliably highlight the correct theme in the UI, especially for imported themes that might share the same title.
   */
  const [activeThemeName, setActiveThemeName] = useState<string>(() => {
    // Initialize with the name of the very first theme.
    return initialLayouts[0].themes[0].name;
  });

  /**
   * @description State for the underlying base layout *type* ('vertical' or 'horizontal'). This determines which SVG component (`CardSvg` or `CardSvgHorizontal`) is rendered. It's derived from the selected theme.
   */
  const [activeBaseLayoutId, setActiveBaseLayoutId] = useState<BaseLayoutId>('vertical');
  
  /**
   * @description State for the complete card configuration object. It holds all the specific properties (colors, fonts, text, etc.) that define the card's appearance. It's initialized with the first theme of the first layout.
   */
  const [config, setConfig] = useState<CardConfig>(() => {
    const firstLayout = initialLayouts[0];
    const firstTheme = firstLayout.themes[0];
    return {
      ...firstTheme.config,
      image: undefined, // Start without an image
    };
  });

  /**
   * @description Effect hook that runs once on component mount to load any user-imported themes from localStorage. This ensures that custom themes persist across browser sessions.
   */
  useEffect(() => {
    try {
      const savedThemesJson = localStorage.getItem(IMPORTED_THEMES_STORAGE_KEY);
      if (savedThemesJson) {
        const savedThemes: Theme[] = JSON.parse(savedThemesJson);
        // Basic validation to ensure we have an array
        if (Array.isArray(savedThemes)) {
          setAllLayouts(prevLayouts => {
            const layoutsCopy = JSON.parse(JSON.stringify(prevLayouts));
            const importedLayout = layoutsCopy.find((l: Layout) => l.id === 'imported');
            if (importedLayout) {
              importedLayout.themes = savedThemes;
            }
            return layoutsCopy;
          });
        }
      }
    } catch (error) {
      console.error("Failed to load imported themes from localStorage:", error);
      // If data is corrupted, clear it to prevent future errors
      localStorage.removeItem(IMPORTED_THEMES_STORAGE_KEY);
    }
  }, []); // Empty dependency array means this runs only once on mount

  /**
   * @description Effect hook that runs whenever `allLayouts` changes. It saves the themes from the 'imported' layout category to localStorage, ensuring that any newly imported or modified themes are persisted.
   */
  useEffect(() => {
    const importedLayout = allLayouts.find(l => l.id === 'imported');
    // Find the initial state to avoid saving it on first render before hydration
    const initialImportedLayout = initialLayouts.find(l => l.id === 'imported');

    // Only save if the imported layout exists and its themes are different from the initial empty state
    if (importedLayout && JSON.stringify(importedLayout.themes) !== JSON.stringify(initialImportedLayout?.themes)) {
        try {
            if (importedLayout.themes.length > 0) {
                const themesToSave = JSON.stringify(importedLayout.themes);
                localStorage.setItem(IMPORTED_THEMES_STORAGE_KEY, themesToSave);
            } else {
                // If the user somehow removes all themes, clear storage
                localStorage.removeItem(IMPORTED_THEMES_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Failed to save imported themes to localStorage:", error);
        }
    }
  }, [allLayouts]); // This effect runs whenever allLayouts changes
  
  /**
   * @description Handles changing the active layout category (e.g., from 'vertical' to 'horizontal'). It updates the active layout ID and sets the current card configuration to the first theme of the newly selected layout, preserving the user's uploaded image.
   * @param {LayoutId} layoutId - The ID of the layout category to switch to.
   */
  const handleLayoutChange = (layoutId: LayoutId) => {
    const newLayout = allLayouts.find(l => l.id === layoutId);
    if (newLayout) {
        setActiveLayoutId(layoutId);
        // Set config to the first theme of the new layout, but only if it has themes.
        if (newLayout.themes.length > 0) {
          const firstTheme = newLayout.themes[0];
          setConfig(prevConfig => ({
              ...firstTheme.config,
              image: prevConfig.image, // keep image if it exists
          }));
          // Also update the base layout ID and active theme name.
          setActiveBaseLayoutId(firstTheme.layoutId);
          setActiveThemeName(firstTheme.name);
        }
    }
  };

  /**
   * @description Handles changing the active theme from the presets library. It finds the selected theme within the currently active layout category and applies its configuration to the card, preserving the user's uploaded image.
   * @param {string} themeName - The name of the theme to apply.
   */
  const handleThemeChange = (themeName: string) => {
    const currentLayout = allLayouts.find(l => l.id === activeLayoutId);
    if (currentLayout) {
        const selectedTheme = currentLayout.themes.find(theme => theme.name === themeName);
        if (selectedTheme) {
            setConfig(prevConfig => ({
                ...selectedTheme.config,
                image: prevConfig.image,
            }));
            // Update the base layout ID and active theme name to match the selected theme.
            setActiveBaseLayoutId(selectedTheme.layoutId);
            setActiveThemeName(selectedTheme.name);
        }
    }
  };

  return {
    config,
    setConfig,
    activeLayoutId,
    setActiveLayoutId,
    activeBaseLayoutId,
    setActiveBaseLayoutId,
    activeThemeName,
    setActiveThemeName,
    handleLayoutChange,
    handleThemeChange,
    allLayouts,
    setAllLayouts,
  };
};

export default useCardConfig;