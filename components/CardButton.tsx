/**
 * @file CardButton.tsx
 * This component renders the button part of the SVG card. It's a reusable
 * graphical group (`<g>`) element containing the button's shape and text.
 */
import React from 'react';

/**
 * Props for the CardButton component.
 */
interface CardButtonProps {
  /** The text to display on the button. */
  buttonText: string;
  /** The color of the button's text. */
  buttonTextColor: string;
  /** The font family for the button's text. */
  fontFamily: string;
  /** The font size for the button's text in pixels. */
  fontSize: number;
  /** Whether the button's text should be bold. */
  bold: boolean;
  /** The width of the button in pixels. */
  width: number;
  /** The height of the button in pixels. */
  height: number;
  /** The corner radius of the button in pixels. */
  cornerRadius: number;
  /** The fill color or gradient URL for the button's background. */
  fill: string;
  /** An optional CSS class name to apply to the button's rectangle element, used for hover effects. */
  className?: string;
  /** Horizontal offset for the button text. */
  textOffsetX?: number;
  /** Vertical offset for the button text. */
  textOffsetY?: number;
}

/**
 * A reusable component that renders the visual elements of a button within an SVG.
 * @param {CardButtonProps} props - The properties to configure the button's appearance.
 * @returns {React.ReactElement} An SVG `<g>` element representing the button.
 */
const CardButton: React.FC<CardButtonProps> = ({
  buttonText,
  buttonTextColor,
  fontFamily,
  fontSize,
  bold,
  width,
  height,
  cornerRadius,
  fill,
  className,
  textOffsetX = 0,
  textOffsetY = 0,
}) => {
  return (
    <g>
      {/* The main rectangle shape of the button */}
      <rect
        className={className}
        x="0"
        y="0"
        width={width}
        height={height}
        rx={cornerRadius}
        ry={cornerRadius}
        fill={fill}
      />
      {/* The text label for the button */}
      <text
        x={(width / 2) + textOffsetX}
        y={(height * 0.55) + textOffsetY} // Adjust for better visual vertical centering
        textAnchor="middle"
        alignmentBaseline="middle"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={bold ? "600" : "400"}
        fill={buttonTextColor}
        style={{ pointerEvents: 'none' }} // Prevent text from capturing mouse events
      >
        {buttonText}
      </text>
    </g>
  );
};

export default CardButton;