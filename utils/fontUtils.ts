/**
 * @file fontUtils.ts
 * This file contains utility functions for handling custom fonts.
 */
import type { CustomFont } from '../types';

/**
 * @description Generates a string of CSS `@font-face` rules from an array of custom font objects. This is crucial for embedding user-uploaded fonts directly into the generated SVG, ensuring that the final output is portable and renders correctly with the intended fonts on any system.
 * @param {CustomFont[]} fonts - An array of custom font objects, where each object contains the font's name, its data URL, and its format (e.g., 'truetype', 'woff').
 * @returns {string} A single string containing all the generated `@font-face` CSS rules, ready to be embedded in a `<style>` tag within an SVG. Returns an empty string if the input array is empty.
 */
export const generateFontFaces = (fonts: CustomFont[]): string => {
  if (!fonts || fonts.length === 0) {
    return '';
  }
  return fonts
    .map(
      (font) => `
    @font-face {
      font-family: '${font.name}';
      src: url(${font.dataUrl}) format('${font.format}');
    }
  `
    )
    .join('');
};
