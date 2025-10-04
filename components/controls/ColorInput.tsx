/**
 * @file ColorInput.tsx
 * A reusable color input component with both a text field and a color picker.
 */
import React from 'react';
import type { CardConfig } from '../../types';

/**
 * @interface ColorInputProps
 * @description Props for the reusable ColorInput component.
 */
export interface ColorInputProps {
  /** @type {string} The text label displayed above the input. */
  label: string;
  /** @type {keyof CardConfig} The unique identifier for the input, corresponding to a key in the CardConfig type. */
  id: keyof CardConfig;
  /** @type {string} The current color value (e.g., "#RRGGBB"). */
  value: string;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function triggered when the color value changes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} [disabled=false] Whether the color input is disabled. */
  disabled?: boolean;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A reusable color input component that includes both a text field for hex codes and a native color picker.
 * @param {ColorInputProps} props The props for the component.
 * @returns {React.ReactElement} The rendered color input element.
 */
const ColorInput: React.FC<ColorInputProps> = ({ label, id, value, onChange, disabled = false, isDark = false }) => (
  <div className={disabled ? 'opacity-50' : ''}>
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full pl-12 pr-3 py-2 border rounded-md shadow-sm transition disabled:cursor-not-allowed ${
          isDark
          ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400'
            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
        }`}
      />
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden border-2 border-gray-500">
        <input
          type="color"
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
        />
      </div>
    </div>
  </div>
);

export default ColorInput;
