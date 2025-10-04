/**
 * @file TextInput.tsx
 * A reusable text input component with a label.
 */
import React from 'react';
import type { CardConfig } from '../../types';

/**
 * @interface TextInputProps
 * @description Props for the reusable TextInput component.
 */
export interface TextInputProps {
  /** @type {string} The text label displayed above the input. */
  label: string;
  /** @type {keyof CardConfig} The unique identifier for the input, corresponding to a key in the CardConfig type. */
  id: keyof CardConfig;
  /** @type {string} The current text value of the input. */
  value: string;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function triggered when the text value changes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A reusable styled text input component with a label, for use in the control panel.
 * @param {TextInputProps} props The props for the component.
 * @returns {React.ReactElement} The rendered text input element.
 */
const TextInput: React.FC<TextInputProps> = ({ label, id, value, onChange, isDark = false }) => (
  <div>
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md shadow-sm transition ${
        isDark
          ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400'
          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
      }`}
    />
  </div>
);

export default TextInput;
