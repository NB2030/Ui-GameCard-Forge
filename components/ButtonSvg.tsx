/**
 * @file ButtonSvg.tsx
 * This component renders a standalone, non-interactive SVG button. It is used
 * primarily for exporting the button design as a separate SVG or PNG file.
 */
import React from 'react';
import type { CustomFont } from '../types';
import { generateFontFaces } from '../utils/fontUtils';

/**
 * Props for the ButtonSvg component.
 */
interface ButtonSvgProps {
  /** The text displayed on the button. */
  buttonText: string;
  /** The solid background color of the button. Used when gradient is disabled. */
  buttonColor?: string;
  /** The color of the button's text. */
  buttonTextColor: string;
  /** The font family for the button's text. */
  buttonFontFamily: string;
  /** Whether the button's text is bold. */
  buttonBold: boolean;
  /** The font size for the button's text in pixels. */
  buttonFontSize: number;
  /** Whether to use a gradient for the button's background. */
  buttonGradientEnabled?: boolean;
  /** The starting color of the gradient. */
  buttonGradientColorStart?: string;
  /** The ending color of the gradient. */
  buttonGradientColorEnd?: string;
  /** The angle of the gradient in degrees. */
  buttonGradientAngle?: number;
  /** The width of the button in pixels. */
  buttonWidth?: number;
  /** The height of the button in pixels. */
  buttonHeight?: number;
  /** The corner radius of the button in pixels. */
  cornerRadius?: number;
  /** An array of custom fonts to be embedded in the SVG. */
  customFonts: CustomFont[];
  /** Horizontal offset for the button text. */
  buttonTextOffsetX?: number;
  /** Vertical offset for the button text. */
  buttonTextOffsetY?: number;
}

/**
 * A component that renders a standalone SVG button, suitable for exporting.
 * @param {ButtonSvgProps} props - The properties to configure the button.
 * @returns {React.ReactElement} The rendered SVG button.
 */
const ButtonSvg: React.FC<ButtonSvgProps> = ({ 
  buttonText, 
  buttonColor, 
  buttonTextColor, 
  buttonFontFamily, 
  buttonBold, 
  buttonFontSize,
  buttonGradientEnabled,
  buttonGradientColorStart,
  buttonGradientColorEnd,
  buttonGradientAngle,
  buttonWidth = 200,
  buttonHeight = 55,
  cornerRadius,
  customFonts,
  buttonTextOffsetX = 0,
  buttonTextOffsetY = 0,
}) => {
  // If a specific cornerRadius is provided, use it; otherwise, default to a pill shape.
  const finalCornerRadius = cornerRadius !== undefined ? cornerRadius : buttonHeight / 2;
  return (
    <svg
      width={buttonWidth}
      height={buttonHeight}
      viewBox={`0 0 ${buttonWidth} ${buttonHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Define the linear gradient if enabled */}
        {buttonGradientEnabled && (
          <linearGradient id="button-gradient-static" gradientTransform={`rotate(${buttonGradientAngle || 0})`}>
            <stop offset="0%" stopColor={buttonGradientColorStart} />
            <stop offset="100%" stopColor={buttonGradientColorEnd} />
          </linearGradient>
        )}
        {/* Import Google Fonts to ensure they are available within the SVG */}
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;600&family=Lato:wght@400;600&family=Montserrat:wght@400;600&family=Nunito:wght@400;600&family=Poppins:wght@400;600&family=Roboto+Slab:wght@400;600&display=swap');
          ${generateFontFaces(customFonts)}
          `}
        </style>
      </defs>
      {/* Button background rectangle */}
      <rect
        x="0"
        y="0"
        width={buttonWidth}
        height={buttonHeight}
        rx={finalCornerRadius}
        ry={finalCornerRadius}
        fill={buttonGradientEnabled ? 'url(#button-gradient-static)' : buttonColor}
      />
      {/* Button text */}
      <text
        x={(buttonWidth / 2) + buttonTextOffsetX}
        y={(buttonHeight * 0.55) + buttonTextOffsetY} // Vertically center the text with a slight adjustment
        textAnchor="middle"
        alignmentBaseline="middle"
        fontFamily={buttonFontFamily}
        fontSize={buttonFontSize}
        fontWeight={buttonBold ? "600" : "400"}
        fill={buttonTextColor}
        style={{ pointerEvents: 'none' }} // Ensure text doesn't interfere with clicks on the rect
      >
        {buttonText}
      </text>
    </svg>
  );
};

export default ButtonSvg;