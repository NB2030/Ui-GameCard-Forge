/**
 * @file CheckboxInput.tsx
 * A reusable checkbox component with a label.
 */
import React from 'react';
import type { CardConfig } from '../../types';

/**
 * @interface CheckboxInputProps
 * @description Props for the reusable CheckboxInput component.
 */
export interface CheckboxInputProps {
  /** @type {string} The text label displayed next to the checkbox. */
  label: string;
  /** @type {keyof CardConfig} The unique identifier for the input, corresponding to a key in the CardConfig type. */
  id: keyof CardConfig;
  /** @type {boolean} The current checked state of the checkbox. */
  checked: boolean;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function triggered when the checkbox state changes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A reusable checkbox component with a label, styled for the control panel.
 * @param {CheckboxInputProps} props The props for the component.
 * @returns {React.ReactElement} The rendered checkbox input element.
 */
const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, id, checked, onChange, isDark = false }) => (
  <div className="flex items-center">
    <input
      id={id}
      name={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 rounded transition-colors ${
        isDark
          ? 'text-cyan-400 focus:ring-cyan-500 border-[#475569] bg-[#334155] focus:ring-offset-[#1e293b]'
          : 'text-indigo-600 focus:ring-indigo-500 border-gray-300'
      }`}
    />
    <label htmlFor={id} className={`ml-2 block text-sm ${
      isDark ? 'text-gray-300' : 'text-gray-900'
    }`}>
      {label}
    </label>
  </div>
);

export default CheckboxInput;
