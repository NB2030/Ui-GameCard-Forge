/**
 * @file ButtonStyleTab.tsx
 * This component contains all UI controls for the "Button Style" tab.
 */
import React from 'react';
import type { TabPanelProps } from './ContentTab'; // Import shared props
// FIX: Import `LayoutId` to use for the `activeLayoutId` prop.
import type { CustomFont, LayoutId } from '../../types';
import Section from '../controls/Section';
import ColorInput from '../controls/ColorInput';
import NumberInput from '../controls/NumberInput';
import CheckboxInput from '../controls/CheckboxInput';
import PositionControl from '../controls/PositionControl';

/** @description A list of available Google Fonts for the text elements on the card. */
const availableFonts = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Nunito', sans-serif", label: "Nunito" },
  { value: "'Roboto Slab', serif", label: "Roboto Slab" },
  { value: "'Cinzel', serif", label: "Cinzel" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
];

/**
 * @interface ButtonStyleTabProps
 * @description Props for the ButtonStyleTab, extending the base TabPanelProps with additional properties.
 * @extends {TabPanelProps}
 */
interface ButtonStyleTabProps extends TabPanelProps {
  /** @type {LayoutId} The identifier for the currently active layout (e.g., 'vertical', 'horizontal'). */
  activeLayoutId: LayoutId;
  /** @type {CustomFont[]} An array of custom fonts that have been uploaded by the user. */
  customFonts: CustomFont[];
}

/**
 * @description A component that renders the UI controls for the "Button Style" tab in the control panel. It allows users to customize the button's font, colors, gradient, and dimensions.
 * @param {ButtonStyleTabProps} props The props for the component.
 * @returns {React.ReactElement} The rendered tab panel for button styling.
 */
const ButtonStyleTab: React.FC<ButtonStyleTabProps> = ({ config, handleChange, activeLayoutId, customFonts, isDark }) => {
    
    // Merge built-in fonts with custom uploaded fonts for the dropdown
    const allFonts = [
        ...availableFonts,
        ...customFonts.map(font => ({ value: `'${font.name}'`, label: font.name })),
    ];
    
    return (
        <div className="space-y-6">
            <Section title="Button Font" isDark={isDark}>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                    <select
                        id="buttonFontFamily"
                        name="buttonFontFamily"
                        value={config.buttonFontFamily}
                        onChange={handleChange}
                        className={`flex-grow px-3 py-2 border rounded-md shadow-sm transition ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'}`}
                    >
                        {allFonts.map(font => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                        ))}
                    </select>
                    <CheckboxInput label="Bold" id="buttonBold" checked={config.buttonBold} onChange={handleChange} isDark={isDark} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput label="Font Size (px)" id="buttonFontSize" value={config.buttonFontSize} onChange={handleChange} isDark={isDark} />
                        <ColorInput label="Button Text Color" id="buttonTextColor" value={config.buttonTextColor} onChange={handleChange} isDark={isDark} />
                    </div>
                    <PositionControl 
                        label="Position Offset"
                        idX="buttonTextOffsetX"
                        idY="buttonTextOffsetY"
                        valueX={config.buttonTextOffsetX}
                        valueY={config.buttonTextOffsetY}
                        onChange={handleChange}
                        isDark={isDark}
                    />
                </div>
            </Section>
            <Section title="Button Appearance" isDark={isDark}>
                <div className="space-y-4">
                    <CheckboxInput label="Enable Button Gradient" id="buttonGradientEnabled" checked={config.buttonGradientEnabled} onChange={handleChange} isDark={isDark} />
                    {config.buttonGradientEnabled ? (
                        <div className="space-y-4 pl-6 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <ColorInput label="Button Gradient Start" id="buttonGradientColorStart" value={config.buttonGradientColorStart} onChange={handleChange} isDark={isDark} />
                            <ColorInput label="Button Gradient End" id="buttonGradientColorEnd" value={config.buttonGradientColorEnd} onChange={handleChange} isDark={isDark} />
                        </div>
                        <NumberInput label="Gradient Angle" id="buttonGradientAngle" value={config.buttonGradientAngle} onChange={handleChange} isDark={isDark} />
                        </div>
                    ) : (
                        <div className="pt-2">
                        <ColorInput label="Button Color" id="buttonColor" value={config.buttonColor} onChange={handleChange} isDark={isDark} />
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <NumberInput label="Button Width (px)" id="buttonWidth" value={config.buttonWidth} onChange={handleChange} min={50} isDark={isDark} />
                        <NumberInput label="Button Height (px)" id="buttonHeight" value={config.buttonHeight} onChange={handleChange} min={20} isDark={isDark} />
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default ButtonStyleTab;