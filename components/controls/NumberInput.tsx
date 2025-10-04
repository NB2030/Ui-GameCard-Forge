/**
 * @file NumberInput.tsx
 * A reusable number input component.
 */
import React from 'react';
import type { CardConfig } from '../../types';

/**
 * @interface NumberInputProps
 * @description Props for the reusable NumberInput component.
 */
export interface NumberInputProps {
  /** @type {string} The text label displayed above the input. */
  label: string;
  /** @type {keyof CardConfig} The unique identifier for the input, corresponding to a key in the CardConfig type. */
  id: keyof CardConfig;
  /** @type {number} The current numeric value of the input. */
  value: number;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function triggered when the value changes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {number} [min=0] The minimum allowed value for the input. */
  min?: number;
  /** @type {number} [step=1] The step increment for the input. */
  step?: number;
  /** @type {boolean} [disabled=false] Whether the number input is disabled. */
  disabled?: boolean;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A reusable styled number input component for the control panel.
 * @param {NumberInputProps} props The props for the component.
 * @returns {React.ReactElement} The rendered number input element.
 */
const NumberInput: React.FC<NumberInputProps> = ({ label, id, value, onChange, min = 0, step = 1, disabled = false, isDark = false }) => (
  <div className={disabled ? 'opacity-50' : ''}>
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <input
      type="number"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      min={min}
      step={step}
      disabled={disabled}
      lang="en"
      className={`w-full px-3 py-2 border rounded-md shadow-sm transition disabled:cursor-not-allowed ${
        isDark
          ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400'
          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
      }`}
    />
  </div>
);

export default NumberInput;
