/**
 * @file ImageAndFontsTab.tsx
 * This component contains image upload and custom fonts management.
 */
import React from 'react';
import type { CardConfig, CustomFont } from '../../types';
import FileInput from '../controls/FileInput';
import NumberInput from '../controls/NumberInput';
import Section from '../controls/Section';

/**
 * @interface ImageAndFontsTabProps
 * @description Props for the ImageAndFontsTab component.
 */
interface ImageAndFontsTabProps {
  /** @type {CardConfig} The main configuration object, used here to check for an existing image. */
  config: CardConfig;
  /** @type {(updates: Partial<CardConfig>) => void} The callback function to update the configuration. */
  setConfig: (updates: Partial<CardConfig>) => void;
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the main card image upload event. */
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @type {CustomFont[]} An array of custom fonts that have been uploaded by the user. */
  customFonts: CustomFont[];
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} The callback function to handle the font file upload event. */
  onFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  setConfig,
  onImageUpload,
  customFonts,
  onFontUpload,
  isDark
}) => {
  return (
    <div className="p-6 space-y-6">

      {/* Image Upload Section */}
      <Section title="Card Image" isDark={isDark}>
        <div className="space-y-4">
          <FileInput
            id="image-upload"
            label="Upload Image"
            accept="image/png, image/jpeg, image/webp"
            onChange={onImageUpload}
            buttonText="Choose Image"
            placeholderText="No image selected"
            isDark={isDark}
          />

          {config.image && (
            <>
              {/* Small Image Preview */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={config.image}
                    alt="معاينة"
                    className={`rounded-lg w-full h-full object-cover shadow-sm ${isDark ? 'border border-[#334155]' : 'border border-gray-100'}`}
                  />
                  <div className={`absolute -top-1 -right-1 text-white text-[10px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-green-600' : 'bg-green-500'}`}>
                    ✓
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image Uploaded</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Control position and size</p>
                </div>
              </div>

              {/* Image Controls */}
              <div className="space-y-3 pt-2">
                <NumberInput
                  id="imageOffsetX"
                  label="Horizontal Offset (X)"
                  value={config.imageOffsetX}
                  onChange={(e) => setConfig({ imageOffsetX: parseFloat(e.target.value) || 0 })}
                  min={-200}
                  step={1}
                  isDark={isDark}
                />

                <NumberInput
                  id="imageOffsetY"
                  label="Vertical Offset (Y)"
                  value={config.imageOffsetY}
                  onChange={(e) => setConfig({ imageOffsetY: parseFloat(e.target.value) || 0 })}
                  min={-200}
                  step={1}
                  isDark={isDark}
                />

                <NumberInput
                  id="imageScale"
                  label="Image Scale"
                  value={config.imageScale}
                  onChange={(e) => setConfig({ imageScale: parseFloat(e.target.value) || 1 })}
                  min={0.1}
                  step={0.1}
                  isDark={isDark}
                />

                <NumberInput
                  id="imageRotation"
                  label="Rotation (degrees)"
                  value={config.imageRotation}
                  onChange={(e) => setConfig({ imageRotation: parseFloat(e.target.value) || 0 })}
                  min={-180}
                  step={1}
                  isDark={isDark}
                />
              </div>
            </>
          )}

          {!config.image && (
            <div className={`text-center py-6 rounded-lg border-2 border-dashed ${isDark ? 'bg-[#1e293b]/50 border-[#475569]' : 'bg-gray-50 border-gray-300'}`}>
              <div className="text-gray-400 mb-2">
                <svg className={`mx-auto h-10 w-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>No Image</h4>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Upload an image to add it to the card
              </p>
            </div>
          )}

          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Supported formats: PNG, JPEG, WebP
          </p>
        </div>
      </Section>

      {/* Font Management Section */}
      <Section title="Custom Fonts" isDark={isDark}>
        <div className="space-y-4">
          <FileInput
            id="font-upload"
            label="Upload Font Files"
            multiple
            buttonText="Choose Fonts"
            accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2,application/font-woff,application/font-woff2,application/x-font-ttf,application/x-font-opentype"
            onChange={onFontUpload}
            placeholderText="No fonts selected"
            isDark={isDark}
          />

          {customFonts.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Uploaded Fonts ({customFonts.length}):
              </p>
              <div className="space-y-2">
                {customFonts.map(font => (
                  <div key={font.name} className={`flex items-center justify-between p-2.5 rounded-lg border ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-cyan-900/50' : 'bg-blue-100'}`}>
                        <svg className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{font.name}</p>
                        <p className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{font.format}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customFonts.length === 0 && (
            <div className={`text-center py-6 rounded-lg border-2 border-dashed ${isDark ? 'bg-[#1e293b]/50 border-[#475569]' : 'bg-gray-50 border-gray-300'}`}>
              <div className="text-gray-400 mb-2">
                <svg className={`mx-auto h-10 w-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>No Custom Fonts</h4>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Upload fonts to use in your card designs
              </p>
            </div>
          )}

          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Supported formats: TTF, OTF, WOFF, WOFF2
          </p>
        </div>
      </Section>
    </div>
  );
};

export default ImageAndFontsTab;
