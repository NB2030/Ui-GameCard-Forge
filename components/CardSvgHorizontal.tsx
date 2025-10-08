/**
 * @file CardSvgHorizontal.tsx
 * This component renders the horizontal "banner" style SVG game card,
 * with an image on the left, text in the middle, and a button on the right.
 */
import React from 'react';
import type { CardConfig, CustomFont } from '../types';
import { darkenColor } from '../utils/color';
import CardButton from './CardButton';
import { generateFontFaces } from '../utils/fontUtils';

/**
 * Props for the CardSvgHorizontal component.
 */
interface CardSvgHorizontalProps {
  /** The configuration object that defines the appearance and content of the card. */
  config: CardConfig;
  /** An array of custom fonts to be embedded in the SVG. */
  customFonts: CustomFont[];
}

/**
 * A component that renders the horizontal layout of the SVG game card.
 * @param {CardSvgHorizontalProps} props - The properties for the component.
 * @returns {React.ReactElement} The rendered SVG card.
 */
const CardSvgHorizontal: React.FC<CardSvgHorizontalProps> = ({ config, customFonts }) => {
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
    imageRotation,
  } = config;
  
  // Calculate darker colors for hover states.
  const darkerButtonColor = darkenColor(buttonColor, 10);
  const darkerGradientStart = buttonGradientColorStart ? darkenColor(buttonGradientColorStart, 10) : '#000';
  const darkerGradientEnd = buttonGradientColorEnd ? darkenColor(buttonGradientColorEnd, 10) : '#000';

  // The inner panel's corner radius is slightly smaller than the frame's.
  const innerCornerRadius = Math.max(0, cardCornerRadius - 6);
  
  // --- Layout Calculations for Horizontal Card ---
  const framePadding = 5;
  const contentPadding = 15;
  
  const innerRectX = framePadding;
  const innerRectY = framePadding;
  const innerRectWidth = cardWidth - (framePadding * 2);
  const innerRectHeight = cardHeight - (framePadding * 2);

  // Image Area (Left): A square area for the image.
  const imageAreaSize = innerRectHeight - (contentPadding * 2);
  const imageX = innerRectX + contentPadding;
  const imageY = innerRectY + contentPadding;

  const scaledSize = imageAreaSize * imageScale;

  // Calculate top-left corner for centered scaling
  const scaledX = imageX - (scaledSize - imageAreaSize) / 2;
  const scaledY = imageY - (scaledSize - imageAreaSize) / 2;

  // Apply user offset
  const finalImageX = scaledX + imageOffsetX;
  const finalImageY = scaledY + imageOffsetY;
  
  // Button Area (Right): Positioned on the far right.
  const buttonX = innerRectX + innerRectWidth - contentPadding - buttonWidth;
  const buttonY = (cardHeight - buttonHeight) / 2;

  // Text Area (Center): Occupies the space between the image and the button.
  const textX = imageX + imageAreaSize + contentPadding;
  const textYCoord = innerRectY + contentPadding;
  const textHeight = imageAreaSize;

  // Calculate vertical center for text positioning.
  const textCenterY = textYCoord + textHeight / 2;
  const titleY = textCenterY - (titleFontSize / 2);
  const priceY = textCenterY + (priceFontSize / 2) + 4; // Add margin

  // --- Price Rendering Logic ---
  const priceNumberText = price.toFixed(2);
  const iconWidth = customCurrencyIconSize;
  const symbolWidth = priceFontSize * 0.6;
  const spacing = 5;
  const useIcon = useCustomCurrencyIcon && customCurrencyIcon;
  const priceGroupX = textX + priceOffsetX;
  const priceGroupY = priceY + priceOffsetY;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${cardWidth} ${cardHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for the horizontal button */}
        {buttonGradientEnabled && (
          <>
            <linearGradient id="h-button-gradient" gradientTransform={`rotate(${buttonGradientAngle || 0})`}>
              <stop offset="0%" stopColor={buttonGradientColorStart} />
              <stop offset="100%" stopColor={buttonGradientColorEnd} />
            </linearGradient>
            <linearGradient id="h-button-gradient-hover" gradientTransform={`rotate(${buttonGradientAngle || 0})`}>
              <stop offset="0%" stopColor={darkerGradientStart} />
              <stop offset="100%" stopColor={darkerGradientEnd} />
            </linearGradient>
          </>
        )}
        {/* A more subtle drop shadow for the banner style */}
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.08" />
        </filter>
        {/* Clip path for the image */}
        <clipPath id="h-image-clip">
          <rect x={imageX} y={imageY} width={imageAreaSize} height={imageAreaSize} rx={innerCornerRadius} ry={innerCornerRadius} />
        </clipPath>
        {/* Embedded CSS for fonts and hover effects */}
        <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;600&family=Lato:wght@400;600&family=Montserrat:wght@400;600&family=Nunito:wght@400;600&family=Poppins:wght@400;600&family=Roboto+Slab:wght@400;600&display=swap');
              ${generateFontFaces(customFonts)}
              .h-card-button-rect {
                transition: fill 0.2s ease-in-out;
              }
              .h-card-button-rect:hover {
                fill: ${buttonGradientEnabled ? 'url(#h-button-gradient-hover)' : darkerButtonColor};
              }
            `}
        </style>
      </defs>

      {/* Outer Card with Shadow (Frame) */}
      <rect
        x={0}
        y={0}
        width={cardWidth}
        height={cardHeight}
        rx={cardCornerRadius}
        ry={cardCornerRadius}
        fill={frameColor}
        filter="url(#shadow)"
      />

      {/* Inner Content Panel */}
      <rect
        x={innerRectX}
        y={innerRectY}
        width={innerRectWidth}
        height={innerRectHeight}
        rx={innerCornerRadius}
        ry={innerCornerRadius}
        fill={cardColor}
        stroke={cardStrokeEnabled ? cardStrokeColor : 'none'}
        strokeWidth={cardStrokeEnabled ? cardStrokeWidth : 0}
      />

      {/* Display uploaded image or a placeholder if no image is present */}
      {image ? (
        <g clipPath="url(#h-image-clip)">
          <image
            href={image}
            x={finalImageX}
            y={finalImageY}
            width={scaledSize}
            height={scaledSize}
            preserveAspectRatio="xMidYMid slice"
            transform={`rotate(${imageRotation}, ${imageX + imageAreaSize / 2}, ${imageY + imageAreaSize / 2})`}
          />
        </g>
      ) : (
         <rect
          x={imageX}
          y={imageY}
          width={imageAreaSize}
          height={imageAreaSize}
          rx={innerCornerRadius}
          ry={innerCornerRadius}
          fill="#E2E8F0"
        />
      )}
      
      {/* Title Text (using native SVG text for reliable export) */}
      <text
        x={textX + titleOffsetX}
        y={titleY + titleOffsetY}
        textAnchor="start"
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


      {/* Button */}
      <g id="card-button-group" transform={`translate(${buttonX}, ${buttonY})`}>
         <CardButton 
            buttonText={buttonText}
            buttonTextColor={buttonTextColor}
            fontFamily={buttonFontFamily}
            fontSize={buttonFontSize}
            bold={buttonBold}
            width={buttonWidth}
            height={buttonHeight}
            cornerRadius={innerCornerRadius}
            fill={buttonGradientEnabled ? 'url(#h-button-gradient)' : buttonColor}
            className="h-card-button-rect"
            textOffsetX={buttonTextOffsetX}
            textOffsetY={buttonTextOffsetY}
        />
      </g>
    </svg>
  );
};

export default CardSvgHorizontal;