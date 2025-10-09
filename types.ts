/**
 * @file types.ts
 * This file contains all the TypeScript type definitions and interfaces
 * used throughout the application, providing a single source of truth for data structures.
 */

/**
 * Defines the complete set of configurable properties for a game card.
 */
export interface CardConfig {
  /** The main title text on the card. */
  title: string;
  /** The numeric value of the price. */
  price: number;
  /** The currency symbol for the price (e.g., "$", "€"). */
  priceCurrencySymbol: string;
  /** Horizontal offset for the currency symbol. */
  priceCurrencySymbolOffsetX: number;
  /** Whether to use a custom image icon instead of the currency symbol. */
  useCustomCurrencyIcon: boolean;
  /** The base64-encoded Data URL of the custom currency icon. */
  customCurrencyIcon?: string;
  /** The size (width and height) of the custom currency icon in pixels. */
  customCurrencyIconSize: number;
  /** Horizontal offset for the custom currency icon. */
  customCurrencyIconOffsetX: number;
  /** Vertical offset for the custom currency icon. */
  customCurrencyIconOffsetY: number;
  /** The text displayed on the call-to-action button. */
  buttonText: string;
  /** The background color of the main content area of the card. */
  cardColor: string;
  /** The solid background color of the button (used when gradient is disabled). */
  buttonColor: string;
  /** The color of the button's text. */
  buttonTextColor: string;
  /** The color of the main title text. */
  textColor: string;
  /** The color of the price text. */
  priceColor: string;
  /** The color of the currency symbol ($) in the price text. */
  priceCurrencyColor: string;
  /** Whether the currency symbol color should match the price color. */
  matchPriceColor: boolean;
  /** The color of the card's outer frame. */
  frameColor: string;
  /** The base64-encoded Data URL of the user-uploaded image. */
  image?: string;
  /** The color of the stroke (border) around the main content area. */
  cardStrokeColor: string;
  /** The width of the card's stroke in pixels. */
  cardStrokeWidth: number;
  /** Toggles the visibility of the card's stroke. */
  cardStrokeEnabled: boolean;
  /** The CSS font-family for the title text. */
  titleFontFamily: string;
  /** The CSS font-family for the price text. */
  priceFontFamily: string;
  /** The CSS font-family for the button text. */
  buttonFontFamily: string;
  /** Whether the title text should be bold. */
  titleBold: boolean;
  /** Whether the price text should be bold. */
  priceBold: boolean;
  /** Whether the button text should be bold. */
  buttonBold: boolean;
  /** The font size of the title text in pixels. */
  titleFontSize: number;
  /** The font size of the price text in pixels. */
  priceFontSize: number;
  /** The font size of the button text in pixels. */
  buttonFontSize: number;
  /** The corner radius of the outer card frame in pixels. */
  cardCornerRadius: number;
  /** Toggles whether the button uses a gradient background. */
  buttonGradientEnabled: boolean;
  /** The starting color of the button's gradient. */
  buttonGradientColorStart: string;
  /** The ending color of the button's gradient. */
  buttonGradientColorEnd: string;
  /** The angle of the button's gradient in degrees. */
  buttonGradientAngle: number;
  /** The width of the button in pixels. */
  buttonWidth: number;
  /** The height of the button in pixels. */
  buttonHeight: number;
  /** The total height of the card in pixels. */
  cardHeight: number;
  /** The total width of the card in pixels. */
  cardWidth: number;
  /** Horizontal offset for the title text. */
  titleOffsetX: number;
  /** Vertical offset for the title text. */
  titleOffsetY: number;
  /** Horizontal offset for the price text. */
  priceOffsetX: number;
  /** Vertical offset for the price text. */
  priceOffsetY: number;
  /** Horizontal offset for the button text. */
  buttonTextOffsetX: number;
  /** Vertical offset for the button text. */
  buttonTextOffsetY: number;
  /** Horizontal offset for the uploaded image. */
  imageOffsetX: number;
  /** Vertical offset for the uploaded image. */
  imageOffsetY: number;
  /** Scale factor (zoom) for the uploaded image. */
  imageScale: number;
  /** Rotation angle for the uploaded image in degrees. */
  imageRotation: number;
}

/**
 * Defines the unique identifiers for base layouts.
 */
export type BaseLayoutId = 'vertical' | 'horizontal';

/**
 * Defines the unique identifiers for available layouts in the UI.
 */
export type LayoutId = BaseLayoutId | 'imported';

/**
 * Defines the structure for a theme preset.
 */
export interface Theme {
  /** The display name of the theme (e.g., "Space Explorer"). */
  name: string;
  /** The pre-configured set of styles for this theme. Does not include the user-uploaded image. */
  config: Omit<CardConfig, 'image' | 'customCurrencyIcon'>;
  /** The base layout this theme is intended for. */
  layoutId: BaseLayoutId;
}

/**
 * Defines the structure for a layout option.
 */
export interface Layout {
  /** A unique identifier for the layout. */
  id: LayoutId;
  /** The display name of the layout (e.g., "Vertical Card"). */
  name: string;
  /** An array of theme presets available for this specific layout. */
  themes: Theme[];
}

/**
 * Defines the structure for a custom uploaded font.
 */
export interface CustomFont {
  /** The font-family name, derived from the filename. */
  name: string;
  /** The base64-encoded Data URL of the font file. */
  dataUrl: string;
  /** The format of the font file (e.g., 'truetype', 'woff2'). */
  format: string;
}

/**
 * Defines the structure for application settings.
 */
export interface AppSettings {
  /** The theme mode of the application ('light' or 'dark'). */
  theme: 'light' | 'dark';
  /** The background color of the canvas/preview area. */
  canvasBackgroundColor: string;
}