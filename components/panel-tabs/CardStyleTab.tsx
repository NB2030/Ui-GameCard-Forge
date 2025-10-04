/**
 * @file CardStyleTab.tsx
 * This component contains all UI controls for the "Card Style" tab.
 */
import React from 'react';
import type { TabPanelProps } from './ContentTab'; // Import shared props
import type { CustomFont } from '../../types';
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
 * @interface CardStyleTabProps
 * @description Props for the CardStyleTab, extending the base TabPanelProps.
 * @extends {TabPanelProps}
 */
interface CardStyleTabProps extends TabPanelProps {
    /** @type {CustomFont[]} An array of custom fonts that have been uploaded by the user. */
    customFonts: CustomFont[];
    /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the font file upload event. */
    onFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @description A component that renders the UI controls for the "Card Style" tab. It allows users to customize text styles, card colors, dimensions, and stroke.
 * @param {CardStyleTabProps} props The props for the component.
 * @returns {React.ReactElement} The rendered tab panel for card styling.
 */
const CardStyleTab: React.FC<CardStyleTabProps> = ({ config, handleChange, customFonts, onFontUpload, isDark }) => {
    // Merge built-in fonts with custom uploaded fonts for dropdowns
    const allFonts = [
        ...availableFonts,
        ...customFonts.map(font => ({ value: `'${font.name}'`, label: font.name })),
    ];

    return (
        <div className="space-y-6">
            <Section title="Text Style" isDark={isDark}>
                <div className="space-y-4">
                    <label htmlFor="titleFontFamily" className={`block text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Title Font</label>
                    <div className="flex items-center gap-4">
                    <select
                        id="titleFontFamily"
                        name="titleFontFamily"
                        value={config.titleFontFamily}
                        onChange={handleChange}
                        className={`flex-grow px-3 py-2 border rounded-md shadow-sm transition ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    >
                        {allFonts.map(font => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                        ))}
                    </select>
                    <CheckboxInput label="Bold" id="titleBold" checked={config.titleBold} onChange={handleChange} isDark={isDark} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput label="Font Size (px)" id="titleFontSize" value={config.titleFontSize} onChange={handleChange} isDark={isDark} />
                        <ColorInput label="Title Color" id="textColor" value={config.textColor} onChange={handleChange} isDark={isDark} />
                    </div>
                    <PositionControl 
                        label="Position Offset"
                        idX="titleOffsetX"
                        idY="titleOffsetY"
                        valueX={config.titleOffsetX || 0}
                        valueY={config.titleOffsetY || 0}
                        onChange={handleChange}
                        isDark={isDark}
                    />
                </div>
                <div className={`space-y-4 border-t pt-4 mt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <label htmlFor="priceFontFamily" className={`block text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Price Font</label>
                    <div className="flex items-center gap-4">
                    <select
                        id="priceFontFamily"
                        name="priceFontFamily"
                        value={config.priceFontFamily}
                        onChange={handleChange}
                        className={`flex-grow px-3 py-2 border rounded-md shadow-sm transition ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    >
                        {allFonts.map(font => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                        ))}
                    </select>
                    <CheckboxInput label="Bold" id="priceBold" checked={config.priceBold} onChange={handleChange} isDark={isDark} />
                    </div>
                    <NumberInput label="Font Size (px)" id="priceFontSize" value={config.priceFontSize} onChange={handleChange} isDark={isDark} />
                    <PositionControl 
                        label="Position Offset"
                        idX="priceOffsetX"
                        idY="priceOffsetY"
                        valueX={config.priceOffsetX || 0}
                        valueY={config.priceOffsetY || 0}
                        onChange={handleChange}
                        isDark={isDark}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <ColorInput label="Price Color" id="priceColor" value={config.priceColor} onChange={handleChange} isDark={isDark} />
                        <ColorInput 
                            label="Currency Symbol Color" 
                            id="priceCurrencyColor" 
                            value={config.priceCurrencyColor} 
                            onChange={handleChange} 
                            disabled={!!config.matchPriceColor}
                            isDark={isDark}
                        />
                    </div>
                    <CheckboxInput 
                        label="Use price color for currency symbol" 
                        id="matchPriceColor" 
                        checked={!!config.matchPriceColor} 
                        onChange={handleChange} 
                        isDark={isDark}
                    />
                </div>
            </Section>
            <Section title="Card Appearance" isDark={isDark}>
                <div className="grid grid-cols-2 gap-4">
                    <ColorInput label="Card Color" id="cardColor" value={config.cardColor} onChange={handleChange} isDark={isDark} />
                    <ColorInput label="Frame Color" id="frameColor" value={config.frameColor} onChange={handleChange} isDark={isDark} />
                </div>
                <NumberInput label="Corner Radius (px)" id="cardCornerRadius" value={config.cardCornerRadius} onChange={handleChange} min={0} isDark={isDark} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Card Width (px)" id="cardWidth" value={config.cardWidth} onChange={handleChange} min={200} isDark={isDark} />
                    <NumberInput label="Card Height (px)" id="cardHeight" value={config.cardHeight} onChange={handleChange} min={100} isDark={isDark} />
                </div>
            </Section>
            <Section title="Card Stroke" isDark={isDark}>
                <CheckboxInput label="Enable Card Stroke" id="cardStrokeEnabled" checked={config.cardStrokeEnabled} onChange={handleChange} isDark={isDark} />
                <div className="grid grid-cols-2 gap-4">
                    <ColorInput label="Card Stroke Color" id="cardStrokeColor" value={config.cardStrokeColor} onChange={handleChange} disabled={!config.cardStrokeEnabled} isDark={isDark} />
                    <NumberInput label="Stroke Width (px)" id="cardStrokeWidth" value={config.cardStrokeWidth} onChange={handleChange} disabled={!config.cardStrokeEnabled} isDark={isDark} />
                </div>
            </Section>
        </div>
    );
};

export default CardStyleTab;