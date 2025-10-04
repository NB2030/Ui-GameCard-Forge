/**
 * @file PositionControl.tsx
 * A reusable UI component for adjusting X and Y coordinates with arrow buttons and number inputs.
 */
import React from 'react';
import type { CardConfig } from '../../types';

// --- Arrow Icons ---
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);
const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
);
const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
);

/**
 * @interface PositionControlProps
 * @description Props for the PositionControl component.
 */
interface PositionControlProps {
  /** @type {string} The text label displayed above the control. */
  label: string;
  /** @type {keyof CardConfig} The config key for the X-axis offset. */
  idX: keyof CardConfig;
  /** @type {keyof CardConfig} The config key for the Y-axis offset. */
  idY: keyof CardConfig;
  /** @type {number} The current value of the X-axis offset. */
  valueX: number;
  /** @type {number} The current value of the Y-axis offset. */
  valueY: number;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function triggered when either the X or Y value changes. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A reusable control for adjusting X and Y position offsets, featuring number inputs and increment/decrement buttons.
 * @param {PositionControlProps} props The props for the component.
 * @returns {React.ReactElement} The rendered position control element.
 */
const PositionControl: React.FC<PositionControlProps> = ({ label, idX, idY, valueX, valueY, onChange, isDark = false }) => {
  
  /**
   * @description Creates a synthetic event and calls the parent onChange handler to update the state. This allows button clicks to mimic input changes.
   * @param {keyof CardConfig} id - The name of the config property to change (e.g., 'titleOffsetX').
   * @param {number} value - The new numeric value.
   */
  const handleValueChange = (id: keyof CardConfig, value: number) => {
    // Create a synthetic event that mimics a real input event
    const syntheticEvent = {
      target: {
        name: id,
        value: String(value),
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    // This is a workaround because React's type expects target to be a full HTMLInputElement.
    // We define the 'value' property to be writable to satisfy the type system and ensure compatibility.
    Object.defineProperty(syntheticEvent.target, 'value', { writable: true, value: String(value) });

    onChange(syntheticEvent);
  };
  
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {/* X-axis controls */}
        <div className="flex items-center gap-1">
          <span className={`font-mono text-xs mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>X:</span>
          <button type="button" onClick={() => handleValueChange(idX, valueX - 1)} className={`p-1.5 rounded-md transition focus:outline-none focus:ring-2 ${isDark ? 'bg-[#475569] text-gray-300 hover:bg-[#5a6b82] focus:ring-cyan-500' : 'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500'}`}>
            <ArrowLeftIcon />
          </button>
          <input
            type="number"
            value={valueX}
            onChange={(e) => handleValueChange(idX, parseInt(e.target.value, 10) || 0)}
            lang="en"
            className={`w-full text-center px-1 py-1 border rounded-md shadow-sm transition ${isDark ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
          />
          <button type="button" onClick={() => handleValueChange(idX, valueX + 1)} className={`p-1.5 rounded-md transition focus:outline-none focus:ring-2 ${isDark ? 'bg-[#475569] text-gray-300 hover:bg-[#5a6b82] focus:ring-cyan-500' : 'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500'}`}>
            <ArrowRightIcon />
          </button>
        </div>

        {/* Y-axis controls */}
        <div className="flex items-center gap-1">
          <span className={`font-mono text-xs mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Y:</span>
           <button type="button" onClick={() => handleValueChange(idY, valueY - 1)} className={`p-1.5 rounded-md transition focus:outline-none focus:ring-2 ${isDark ? 'bg-[#475569] text-gray-300 hover:bg-[#5a6b82] focus:ring-cyan-500' : 'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500'}`}>
            <ArrowUpIcon />
          </button>
          <input
            type="number"
            value={valueY}
            onChange={(e) => handleValueChange(idY, parseInt(e.target.value, 10) || 0)}
            lang="en"
            className={`w-full text-center px-1 py-1 border rounded-md shadow-sm transition ${isDark ? 'bg-[#334155] border-[#475569] text-white focus:ring-cyan-500 focus:border-cyan-400' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`}
          />
          <button type="button" onClick={() => handleValueChange(idY, valueY + 1)} className={`p-1.5 rounded-md transition focus:outline-none focus:ring-2 ${isDark ? 'bg-[#475569] text-gray-300 hover:bg-[#5a6b82] focus:ring-cyan-500' : 'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500'}`}>
            <ArrowDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionControl;