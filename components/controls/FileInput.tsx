/**
 * @file FileInput.tsx
 * A custom file input component that provides a consistent, non-localized UI.
 */
import React, { useState, useRef } from 'react';

/**
 * @interface FileInputProps
 * @description Props for the FileInput component.
 */
interface FileInputProps {
  /** @type {string} The unique identifier for the hidden file input element. */
  id: string;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function triggered when a file is selected. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {string} The text label displayed above the component. */
  label: string;
  /** @type {string} [buttonText="Choose File"] The text displayed on the action button. */
  buttonText?: string;
  /** @type {string} [placeholderText="No file selected"] The text displayed when no file is chosen. */
  placeholderText?: string;
  /** @type {string} A string defining the file types the input should accept (e.g., "image/*"). */
  accept?: string;
  /** @type {boolean} [multiple=false] Whether the user can select multiple files. */
  multiple?: boolean;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A custom file input component that provides a consistent, non-localized UI across different browsers. It hides the native input and uses a styled button and text display.
 * @param {FileInputProps} props The props for the component.
 * @returns {React.ReactElement} The rendered file input component.
 */
const FileInput: React.FC<FileInputProps> = ({
  id,
  onChange,
  label,
  buttonText = "Choose File",
  placeholderText = "No file selected",
  accept,
  multiple = false,
  isDark = false,
}) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 1) {
        setFileName(`${e.target.files.length} files selected`);
      } else if (e.target.files.length === 1) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName('');
      }
    } else {
        setFileName('');
    }
    onChange(e); // Propagate the event up to the parent handler
  };

  const handleButtonClick = () => {
    // When the custom button is clicked, it triggers a click on the hidden file input.
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        {/* The hidden native file input */}
        <input
            ref={fileInputRef}
            id={id}
            name={id}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="sr-only"
        />
        {/* The custom, styled button */}
        <button
          type="button"
          onClick={handleButtonClick}
          className={`px-4 py-2 text-sm font-semibold rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark
              ? 'bg-cyan-900/50 text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/80 focus:ring-cyan-500 focus:ring-offset-[#1a232e]'
              : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-500'
          }`}
        >
          {buttonText}
        </button>
        {/* The text display for the selected file name */}
        <span className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`} title={fileName || placeholderText}>
            {fileName || placeholderText}
        </span>
      </div>
    </div>
  );
};

export default FileInput;