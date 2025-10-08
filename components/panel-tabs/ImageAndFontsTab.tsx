/**
 * @file ImageAndFontsTab.tsx
 * This component contains image upload and custom fonts management.
 */
import React from 'react';
import type { CardConfig, CustomFont } from '../../types';
import FileInput from '../controls/FileInput';
import NumberInput from '../controls/NumberInput';

/**
 * @interface ImageAndFontsTabProps
 * @description Props for the ImageAndFontsTab component.
 */
interface ImageAndFontsTabProps {
  /** @type {CardConfig} The main configuration object, used here to check for an existing image. */
  config: CardConfig;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the main card image upload event. */
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {CustomFont[]} An array of custom fonts that have been uploaded by the user. */
  customFonts: CustomFont[];
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the font file upload event. */
  onFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle configuration changes. */
  onConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {boolean} Flag indicating if the dark theme is active for UI styling. */
  isDark: boolean;
}

/**
 * @description A component that renders the "Image & Fonts" tab in the right-side panel. It provides UI for uploading a primary card image and custom font files, and displays the status of these assets.
 * @param {ImageAndFontsTabProps} props The props for the component.
 * @returns {React.ReactElement} The rendered tab panel for managing images and fonts.
 */
const ImageAndFontsTab: React.FC<ImageAndFontsTabProps> = ({
  config,
  onImageUpload,
  customFonts,
  onFontUpload,
  onConfigChange,
  isDark
}) => {
  return (
    <div className="p-6 space-y-8">
      
      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Card Image</h3>
        </div>
        
        <div className={`${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
          <FileInput
            id="image-upload"
            label="Upload Card Image"
            accept="image/png, image/jpeg, image/webp"
            onChange={onImageUpload}
            buttonText="Choose Image"
            placeholderText="No image selected"
            isDark={isDark}
          />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Supports PNG, JPEG, and WebP formats. Recommended size: 300x200px or higher.
          </p>
        </div>

        {config.image && (
          <div className={`${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
            <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Image Preview:</p>
            <div className="relative">
              <img
                src={config.image}
                alt="Uploaded card"
                className={`rounded-lg w-full object-cover max-h-48 shadow-sm ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}
              />
              <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${isDark ? 'bg-green-600' : 'bg-green-500'}`}>
                ✓ Uploaded
              </div>
            </div>

            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="space-y-3">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image Position:</p>
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    id="imageOffsetX"
                    label="Horizontal Offset (X)"
                    value={config.imageOffsetX}
                    onChange={onConfigChange}
                    step={1}
                    isDark={isDark}
                  />
                  <NumberInput
                    id="imageOffsetY"
                    label="Vertical Offset (Y)"
                    value={config.imageOffsetY}
                    onChange={onConfigChange}
                    step={1}
                    isDark={isDark}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image Transform:</p>
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    id="imageScale"
                    label="Scale (Zoom)"
                    value={config.imageScale}
                    onChange={onConfigChange}
                    min={0.1}
                    step={0.1}
                    isDark={isDark}
                  />
                  <NumberInput
                    id="imageRotation"
                    label="Rotation (Degrees)"
                    value={config.imageRotation}
                    onChange={onConfigChange}
                    step={1}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Font Management Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Custom Fonts</h3>
        </div>
        
        <div className={`${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
          <FileInput
            id="font-upload"
            label="Upload Font Files"
            multiple
            buttonText="Choose Font Files"
            accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2,application/font-woff,application/font-woff2,application/x-font-ttf,application/x-font-opentype"
            onChange={onFontUpload}
            placeholderText="No font files selected"
            isDark={isDark}
          />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Supports TTF, OTF, WOFF, and WOFF2 formats. You can select multiple files at once.
          </p>
        </div>

        {customFonts.length > 0 && (
          <div className={`${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
            <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Uploaded Custom Fonts ({customFonts.length}):
            </p>
            <div className="space-y-2">
              {customFonts.map(font => (
                <div key={font.name} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-[#334155]/50 border-[#475569]' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-900/50' : 'bg-blue-100'}`}>
                      <svg className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{font.name}</p>
                      <p className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{font.format} format</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>
                      Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`mt-3 p-3 rounded-lg border ${isDark ? 'bg-cyan-900/30 border-cyan-500/20' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm ${isDark ? 'text-cyan-200' : 'text-blue-800'}`}>
                <strong>Tip:</strong> Your custom fonts are now available in all font selection dropdowns throughout the application.
              </p>
            </div>
          </div>
        )}

        {customFonts.length === 0 && (
          <div className={`text-center py-8 rounded-lg border-2 border-dashed ${isDark ? 'bg-[#1e293b]/50 border-[#475569]' : 'bg-white border-gray-300'}`}>
            <div className="text-gray-400 mb-2">
              <svg className={`mx-auto h-10 w-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>No custom fonts uploaded</h4>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Upload your own font files to use them in your card designs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAndFontsTab;