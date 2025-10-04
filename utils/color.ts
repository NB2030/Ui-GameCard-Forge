/**
 * @file color.ts
 * This file contains utility functions related to color manipulation.
 */

/**
 * Darkens a hex color by a given percentage.
 * @param {string} hex - The hex color string (e.g., "#RRGGBB" or "#RGB").
 * @param {number} percent - The percentage to darken the color by (0-100).
 * @returns {string} The new, darkened hex color string in "#RRGGBB" format.
 */
export const darkenColor = (hex: string, percent: number): string => {
  // Remove '#' if present and expand 3-digit hex to 6-digit
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(char => char + char).join('');
  }

  // Convert hex to RGB integer
  const num = parseInt(color, 16);

  // Extract R, G, B components
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  // Calculate the amount to subtract from each component
  const amount = Math.floor(255 * (percent / 100));

  // Subtract the amount, ensuring the value doesn't go below 0
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Helper to convert a number to a 2-digit hex string
  const toHex = (c: number) => ('00' + c.toString(16)).slice(-2);

  // Reconstruct and return the new hex color string
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
