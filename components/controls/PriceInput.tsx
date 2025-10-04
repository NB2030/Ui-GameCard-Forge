/**
 * @file PriceInput.tsx
 * A specialized input for price, including a currency selector and a number input.
 */
import React from 'react';
import type { CardConfig } from '../../types';
import NumberInput from './NumberInput';
import PositionControl from './PositionControl';

// --- Arrow Icons (local to this component for the symbol offset control) ---
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);


/** A list of common currency symbols for the dropdown. */
const currencySymbols = ['$', '€', '£', '¥', '₹'];

/**
 * @interface PriceInputProps
 * @description Props for the reusable PriceInput component.
 */
interface PriceInputProps {
  /** @type {string} The main label for the entire control. */
  label: string;
  /** @type {keyof CardConfig} The config key for the numerical price value. */
  priceId: keyof CardConfig;
  /** @type {keyof CardConfig} The config key for the currency symbol (e.g., '$'). */
  currencyId: keyof CardConfig;
  /** @type {keyof CardConfig} The config key for the horizontal offset of the currency symbol. */
  priceCurrencySymbolOffsetXId: keyof CardConfig;
  /** @type {keyof CardConfig} The config key for the boolean flag to switch between symbol and icon. */
  useIconId: keyof CardConfig;
  /** @type {number} The current numerical price value. */
  priceValue: number;
  /** @type {string} The current currency symbol. */
  currencyValue: string;
  /** @type {number} The current horizontal offset of the currency symbol. */
  priceCurrencySymbolOffsetXValue: number;
  /** @type {boolean} The current state of the switch between using a symbol or a custom icon. */
  useIconValue: boolean;
  /** @type {keyof CardConfig} The config key for the custom icon's size. */
  iconSizeId: keyof CardConfig;
  /** @type {keyof CardConfig} The config key for the custom icon's X offset. */
  iconOffsetXId: keyof CardConfig;
  /** @type {keyof CardConfig} The config key for the custom icon's Y offset. */
  iconOffsetYId: keyof CardConfig;
  /** @type {number} The current size of the custom icon. */
  iconSizeValue: number;
  /** @type {number} The current X offset of the custom icon. */
  iconOffsetXValue: number;
  /** @type {number} The current Y offset of the custom icon. */
  iconOffsetYValue: number;
  /** @type {(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void} The callback for changes to inputs, selects, and checkboxes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback specifically for the custom icon file upload. */
  onIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A complex component for inputting a price, allowing the user to switch between a standard currency symbol and a custom uploaded icon, with controls for positioning and sizing.
 * @param {PriceInputProps} props The props for the component.
 * @returns {React.ReactElement} The rendered price input control.
 */
const PriceInput: React.FC<PriceInputProps> = ({
  label,
  priceId,
  currencyId,
  priceCurrencySymbolOffsetXId,
  useIconId,
  priceValue,
  currencyValue,
  priceCurrencySymbolOffsetXValue,
  useIconValue,
  iconSizeId,
  iconOffsetXId,
  iconOffsetYId,
  iconSizeValue,
  iconOffsetXValue,
  iconOffsetYValue,
  onChange,
  onIconUpload,
  isDark = false,
}) => {

  /**
   * @description Creates a synthetic event and calls the parent onChange handler. This is a helper function to allow UI elements like buttons (e.g., arrow controls) to trigger state updates through the same mechanism as standard inputs.
   * @param {keyof CardConfig} id - The name of the config property to change.
   * @param {number} value - The new numeric value.
   */
  const handleValueChange = (id: keyof CardConfig, value: number) => {
    const syntheticEvent = {
      target: {
        name: id,
        value: String(value),
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    Object.defineProperty(syntheticEvent.target, 'value', { writable: true, value: String(value) });
    onChange(syntheticEvent);
  };

  const currencyControl = useIconValue ? (
    <div>
        <label htmlFor="custom-icon-upload" className={`cursor-pointer text-xs font-semibold px-3 py-2 rounded-md transition-colors border ${
          isDark
            ? 'bg-cyan-900/50 text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/80'
            : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
        }`}>
            Upload Icon
        </label>
        <input 
            id="custom-icon-upload" 
            type="file" 
            accept="image/png, image/svg+xml, image/webp"
            className="sr-only" 
            onChange={onIconUpload} 
        />
    </div>
  ) : (
    <select
      id={currencyId}
      name={currencyId}
      value={currencyValue}
      onChange={onChange}
      className={`px-3 py-1 border rounded-md shadow-sm transition ${isDark ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
      aria-label="Currency Symbol"
    >
      {currencySymbols.map(symbol => (
        <option key={symbol} value={symbol}>{symbol}</option>
      ))}
    </select>
  );

  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Left: Currency Control */}
        <div className="flex-shrink-0 w-28 text-center">{currencyControl}</div>
        
        {/* Middle: Price Input */}
        <input
          type="number"
          id={priceId}
          name={priceId}
          value={priceValue}
          onChange={onChange}
          lang="en"
          className={`flex-grow w-full px-3 py-1 border rounded-md shadow-sm transition ${isDark ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
          placeholder="4.99"
          step="0.01"
        />

        {/* Right: Switch */}
        <div className={`flex items-center gap-2 pl-2 border-l ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
            <input
                id={useIconId}
                name={useIconId}
                type="checkbox"
                checked={useIconValue}
                onChange={onChange}
                className={`h-4 w-4 rounded ${isDark ? 'text-cyan-400 focus:ring-cyan-500 border-[#475569] bg-[#334155]' : 'text-indigo-600 focus:ring-indigo-500 border-gray-300'}`}
            />
            <label htmlFor={useIconId} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Icon
            </label>
        </div>
      </div>

      {!useIconValue && (
        <div className={`pl-6 pr-2 py-3 mt-2 space-y-4 rounded-md ${isDark ? 'bg-[#334155]/50 border-[#475569]' : 'bg-gray-50/70 border-gray-200'}`}>
            <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Symbol Position</label>
                <div className="flex items-center gap-1 max-w-[150px]">
                    <span className={`font-mono text-xs mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>X:</span>
                    <button type="button" onClick={() => handleValueChange(priceCurrencySymbolOffsetXId, priceCurrencySymbolOffsetXValue - 1)} className={`p-1.5 rounded-md transition focus:outline-none focus:ring-2 ${isDark ? 'bg-[#475569] text-gray-300 hover:bg-[#5a6b82] focus:ring-cyan-500' : 'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500'}`}>
                        <ArrowLeftIcon />
                    </button>
                    <input
                        type="number"
                        id={priceCurrencySymbolOffsetXId}
                        name={priceCurrencySymbolOffsetXId}
                        value={priceCurrencySymbolOffsetXValue}
                        onChange={onChange}
                        lang="en"
                        className={`w-full text-center px-1 py-1 border rounded-md shadow-sm transition ${isDark ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    />
                    <button type="button" onClick={() => handleValueChange(priceCurrencySymbolOffsetXId, priceCurrencySymbolOffsetXValue + 1)} className={`p-1.5 rounded-md transition focus:outline-none focus:ring-2 ${isDark ? 'bg-[#475569] text-gray-300 hover:bg-[#5a6b82] focus:ring-cyan-500' : 'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500'}`}>
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </div>
      )}

      {useIconValue && (
        <div className={`pl-6 pr-2 py-3 mt-2 space-y-4 rounded-md ${isDark ? 'bg-[#334155]/50 border-[#475569]' : 'bg-gray-50/70 border-gray-200'}`}>
            <NumberInput 
                label="Icon Size (px)"
                id={iconSizeId}
                value={iconSizeValue}
                onChange={onChange}
                min={8}
                isDark={isDark}
            />
            <PositionControl
                label="Icon Position"
                idX={iconOffsetXId}
                idY={iconOffsetYId}
                valueX={iconOffsetXValue}
                valueY={iconOffsetYValue}
                onChange={onChange}
                isDark={isDark}
            />
        </div>
      )}
    </div>
  );
};

export default PriceInput;