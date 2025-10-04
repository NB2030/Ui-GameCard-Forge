/**
 * @file validation.ts
 * This file contains utility functions for validating and sanitizing
 * imported card configuration data to ensure it is safe and correctly formatted.
 */
import type { CardConfig } from '../types';

/**
 * @const {object} configSchema
 * @description A schema that defines the expected structure and JavaScript type for each property in a `CardConfig` object. This is the source of truth for validating imported theme files. It ensures that all required fields are present and have the correct data type. The `image` and `customCurrencyIcon` properties are omitted from the strict requirement as they are not part of the theme export/import process.
 */
const configSchema: { [key in keyof Omit<CardConfig, 'image' | 'customCurrencyIcon'>]: string } & { customCurrencyIcon?: string } = {
  title: 'string',
  price: 'number',
  priceCurrencySymbol: 'string',
  priceCurrencySymbolOffsetX: 'number',
  useCustomCurrencyIcon: 'boolean',
  customCurrencyIcon: 'string',
  customCurrencyIconSize: 'number',
  customCurrencyIconOffsetX: 'number',
  customCurrencyIconOffsetY: 'number',
  buttonText: 'string',
  cardColor: 'string',
  buttonColor: 'string',
  buttonTextColor: 'string',
  textColor: 'string',
  priceColor: 'string',
  priceCurrencyColor: 'string',
  matchPriceColor: 'boolean',
  frameColor: 'string',
  cardStrokeColor: 'string',
  cardStrokeWidth: 'number',
  cardStrokeEnabled: 'boolean',
  titleFontFamily: 'string',
  priceFontFamily: 'string',
  buttonFontFamily: 'string',
  titleBold: 'boolean',
  priceBold: 'boolean',
  buttonBold: 'boolean',
  titleFontSize: 'number',
  priceFontSize: 'number',
  buttonFontSize: 'number',
  cardCornerRadius: 'number',
  buttonGradientEnabled: 'boolean',
  buttonGradientColorStart: 'string',
  buttonGradientColorEnd: 'string',
  buttonGradientAngle: 'number',
  buttonWidth: 'number',
  buttonHeight: 'number',
  cardHeight: 'number',
  cardWidth: 'number',
  titleOffsetX: 'number',
  titleOffsetY: 'number',
  priceOffsetX: 'number',
  priceOffsetY: 'number',
  buttonTextOffsetX: 'number',
  buttonTextOffsetY: 'number',
  imageOffsetX: 'number',
  imageOffsetY: 'number',
  imageScale: 'number',
};

// ... (rest of the file remains the same)
/**
 * @description Validates a given card configuration object against the predefined `configSchema`. It checks for missing required fields, type mismatches, and any extra, unrecognized fields. This is a critical security and data integrity measure for the theme import functionality.
 * @param {any} config - The configuration object to validate, typically parsed from an imported JSON file.
 * @returns {{isValid: boolean; errors: string[]}} An object containing a boolean `isValid` which is true if the configuration passes all checks, and an `errors` array containing descriptive messages for any validation failures.
 */
export const validateCardConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (typeof config !== 'object' || config === null) {
    return { isValid: false, errors: ['Imported config must be an object.'] };
  }

  // Check for missing or invalid properties based on the schema
  for (const key in configSchema) {
    const typedKey = key as keyof Omit<CardConfig, 'image'>;
    const expectedType = configSchema[typedKey];

    // The custom icon is not exported, so it can be missing on import.
    if (typedKey === 'customCurrencyIcon') {
        if (typedKey in config && typeof config[typedKey] !== expectedType) {
             errors.push(`Invalid type for field '${typedKey}'. Expected ${expectedType}, but got ${typeof config[typedKey]}.`);
        }
        continue;
    }
    
    if (!(typedKey in config)) {
      errors.push(`Missing required field: '${typedKey}'.`);
      continue;
    }

    const value = config[typedKey];
    const actualType = typeof value;

    if (actualType !== expectedType) {
      errors.push(`Invalid type for field '${typedKey}'. Expected ${expectedType}, but got ${actualType}.`);
    }
  }
  
  // Check for extra, unknown properties not defined in the schema
  for (const key in config) {
    if (!(key in configSchema)) {
        errors.push(`Unknown field found: '${key}'.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ... (rest of the file remains the same)
/**
 * @description Sanitizes a string by removing any characters that form HTML/XML-like tags. This is a basic security measure to prevent Cross-Site Scripting (XSS) attacks when importing theme files with string values that will be rendered in the UI or SVG.
 * @param {string} input The string to sanitize.
 * @returns {string} The sanitized string, with all tag-like structures removed. If the input is not a string, it is returned unmodified.
 */
export const sanitizeString = (input: string): string => {
    if (typeof input !== 'string') return input;
    // A simple regex to strip anything that looks like an HTML tag.
    return input.replace(/<[^>]*>/g, '');
};