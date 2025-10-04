/**
 * @file CardSvg.tsx
 * This component renders the complete vertical SVG game card, including the frame,
 * background, image, text content, and interactive button.
 */
import React from 'react';
import type { CardConfig, CustomFont } from '../types';
import { darkenColor } from '../utils/color';
import CardButton from './CardButton';
import { generateFontFaces } from '../utils/fontUtils';

/**
 * Props for the CardSvg component.
 */
interface CardSvgProps {
  /** The configuration object that defines the appearance and content of the card. */
  config: CardConfig;
  /** An array of custom fonts to be embedded in the SVG. */
  customFonts: CustomFont[];
}

/**
 * A component that renders the vertical layout of the SVG game card.
 * @param {CardSvgProps} props - The properties for the component.
 * @returns {React.ReactElement} The rendered SVG card.
 */
const CardSvg: React.FC<CardSvgProps> = ({ config, customFonts }) => {
  const {
    title,
    price,
    priceCurrencySymbol,
    priceCurrencySymbolOffsetX,
    useCustomCurrencyIcon,
    customCurrencyIcon,
    customCurrencyIconSize,
    customCurrencyIconOffsetX,
    customCurrencyIconOffsetY,
    buttonText,
    cardColor,
    buttonColor,
    buttonTextColor,
    textColor,
    priceColor,
    priceCurrencyColor,
    matchPriceColor,
    frameColor,
    image,
    cardStrokeColor,
    cardStrokeWidth,
    cardStrokeEnabled,
    titleFontFamily,
    priceFontFamily,
    buttonFontFamily,
    titleBold,
    priceBold,
    buttonBold,
    titleFontSize,
    priceFontSize,
    buttonFontSize,
    cardCornerRadius,
    buttonGradientEnabled,
    buttonGradientColorStart,
    buttonGradientColorEnd,
    buttonGradientAngle,
    buttonWidth,
    buttonHeight,
    cardHeight,
    cardWidth,
    titleOffsetX,
    titleOffsetY,
    priceOffsetX,
    priceOffsetY,
    buttonTextOffsetX,
    buttonTextOffsetY,
    imageOffsetX,
    imageOffsetY,
    imageScale,
  } = config;
  
  // Calculate darker colors for hover states.
  const darkerButtonColor = darkenColor(buttonColor, 15);
  const darkerGradientStart = buttonGradientColorStart ? darkenColor(buttonGradientColorStart, 15) : '#000';
  const darkerGradientEnd = buttonGradientColorEnd ? darkenColor(buttonGradientColorEnd, 15) : '#000';
  
  // The inner panel's corner radius should be smaller than the outer frame's.
  const innerCornerRadius = Math.max(0, cardCornerRadius - 10);
  
  // --- Dynamic Layout Calculations ---
  const padding = 25;

  // Image layout: Occupies the top 40% of the card's height.
  const imageAreaHeight = cardHeight * 0.4;
  const imageAreaWidth = cardWidth - (padding * 2);
  const imageX = padding;
  const imageY = padding;

  const scaledWidth = imageAreaWidth * imageScale;
  const scaledHeight = imageAreaHeight * imageScale;
  
  // Calculate top-left corner for centered scaling
  const scaledX = imageX - (scaledWidth - imageAreaWidth) / 2;
  const scaledY = imageY - (scaledHeight - imageAreaHeight) / 2;
  
  // Apply user offset
  const finalImageX = scaledX + imageOffsetX;
  const finalImageY = scaledY + imageOffsetY;


  // Button layout: Positioned 100px from the bottom of the card.
  const buttonTranslateX = (cardWidth - buttonWidth) / 2;
  const buttonTranslateY = cardHeight - 100;

  // Content area: The space between the image and the button for text.
  const contentTop = imageY + imageAreaHeight;
  const contentBottom = buttonTranslateY;
  const contentSpace = contentBottom - contentTop;

  // Calculate vertical center for text positioning.
  const contentCenterY = contentTop + (contentSpace / 2);
  const titleY = contentCenterY - (titleFontSize / 2) + 4; // Adjust for better visual balance
  const priceY = contentCenterY + (priceFontSize / 2) + 8;

  // --- Price Rendering Logic ---
  const priceNumberText = price.toFixed(2);
  // Estimate width for centering the entire price group (icon/symbol + number)
  const priceNumberWidth = priceNumberText.length * priceFontSize * 0.6; // Heuristic for text width
  const iconWidth = customCurrencyIconSize; // Use the new size property
  const symbolWidth = priceFontSize * 0.6; // Heuristic for symbol width
  const spacing = 5;
  const useIcon = useCustomCurrencyIcon && customCurrencyIcon;
  const totalWidth = (useIcon ? iconWidth : symbolWidth) + spacing + priceNumberWidth;
  const priceGroupX = (cardWidth / 2) - (totalWidth / 2) + priceOffsetX;
  const priceGroupY = priceY + priceOffsetY;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${cardWidth} ${cardHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Define gradients for the button if enabled */}
        {buttonGradientEnabled && (
          <>
            <linearGradient id="button-gradient" gradientTransform={`rotate(${buttonGradientAngle || 0})`}>
              <stop offset="0%" stopColor={buttonGradientColorStart} />
              <stop offset="100%" stopColor={buttonGradientColorEnd} />
            </linearGradient>
            <linearGradient id="button-gradient-hover" gradientTransform={`rotate(${buttonGradientAngle || 0})`}>
              <stop offset="0%" stopColor={darkerGradientStart} />
              <stop offset="100%" stopColor={darkerGradientEnd} />
            </linearGradient>
          </>
        )}
        {/* Filter for the card's drop shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.15" />
        </filter>
        {/* Clip path to round the corners of the uploaded image */}
        <clipPath id="image-clip">
          <rect x={padding} y={padding} width={imageAreaWidth} height={imageAreaHeight} rx={innerCornerRadius} ry={innerCornerRadius} />
        </clipPath>
        {/* Embedded CSS for fonts and hover effects */}
        <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;600&family=Lato:wght@400;600&family=Montserrat:wght@400;600&family=Nunito:wght@400;600&family=Poppins:wght@400;600&family=Roboto+Slab:wght@400;600&display=swap');
              ${generateFontFaces(customFonts)}
              .card-button-rect {
                transition: fill 0.2s ease-in-out;
              }
              .card-button-rect:hover {
                fill: ${buttonGradientEnabled ? 'url(#button-gradient-hover)' : darkerButtonColor};
              }
            `}
        </style>
      </defs>

      {/* Outer Card with Shadow - Provides the frame color and shadow */}
      <rect
        x="10"
        y="10"
        width={cardWidth - 20}
        height={cardHeight - 20}
        rx={cardCornerRadius}
        ry={cardCornerRadius}
        fill={frameColor}
        filter="url(#shadow)"
      />

      {/* Inner Colored Panel - The main content area with its own border */}
      <rect
        x="25"
        y="25"
        width={cardWidth - 50}
        height={cardHeight - 50}
        rx={innerCornerRadius}
        ry={innerCornerRadius}
        fill={cardColor}
        stroke={cardStrokeEnabled ? cardStrokeColor : 'none'}
        strokeWidth={cardStrokeEnabled ? cardStrokeWidth : 0}
      />

      {/* Display uploaded image, clipped to the defined path */}
      {image && (
        <image
          href={image}
          x={finalImageX}
          y={finalImageY}
          width={scaledWidth}
          height={scaledHeight}
          clipPath="url(#image-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      )}

      {/* Title Text (using native SVG text for reliable export) */}
      <text
        x={(cardWidth / 2) + titleOffsetX}
        y={titleY + titleOffsetY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={titleFontFamily}
        fontSize={titleFontSize}
        fontWeight={titleBold ? "600" : "400"}
        fill={textColor}
      >
        {title}
      </text>
      
      {/* Price Group (Icon/Symbol + Number) */}
      <g transform={`translate(${priceGroupX}, ${priceGroupY})`}>
        {useIcon ? (
            <image
                href={customCurrencyIcon}
                x={customCurrencyIconOffsetX}
                y={-iconWidth / 2 + customCurrencyIconOffsetY}
                width={iconWidth}
                height={iconWidth}
                preserveAspectRatio="xMidYMid meet"
            />
        ) : (
            <text
                x={0 + priceCurrencySymbolOffsetX}
                y={0}
                dominantBaseline="middle"
                fontFamily={priceFontFamily}
                fontSize={priceFontSize}
                fontWeight={priceBold ? "600" : "400"}
                fill={matchPriceColor ? priceColor : priceCurrencyColor}
            >
                {priceCurrencySymbol}
            </text>
        )}
        <text
            x={(useIcon ? iconWidth : symbolWidth) + spacing}
            y={0}
            dominantBaseline="middle"
            fontFamily={priceFontFamily}
            fontSize={priceFontSize}
            fontWeight={priceBold ? "600" : "400"}
            fill={priceColor}
        >
            {priceNumberText}
        </text>
      </g>


      {/* Button Group - positioned using a transform */}
      <g id="card-button-group" transform={`translate(${buttonTranslateX}, ${buttonTranslateY})`}>
        <CardButton 
            buttonText={buttonText}
            buttonTextColor={buttonTextColor}
            fontFamily={buttonFontFamily}
            fontSize={buttonFontSize}
            bold={buttonBold}
            width={buttonWidth}
            height={buttonHeight}
            cornerRadius={buttonHeight / 2}
            fill={buttonGradientEnabled ? 'url(#button-gradient)' : buttonColor}
            className="card-button-rect"
            textOffsetX={buttonTextOffsetX}
            textOffsetY={buttonTextOffsetY}
        />
      </g>
    </svg>
  );
};

export default CardSvg;