/* © 2025 IMRAN — All rights reserved. */

export const SLICE_PALETTE: string[] = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#D946EF', // Fuchsia
  '#84CC16', // Lime
  '#FB923C', // Orange
  '#4338CA', // Deep Indigo
  '#059669', // Deep Emerald
  '#E11D48', // Crimson
  '#0284C7', // Sky
  '#A855F7', // Violet
  '#F97316', // Deep Orange
  '#0D9488', // Dark Teal
  '#E056FD', // Orchid
];

/**
 * Assigns colors to N slices ensuring no two adjacent slices have identical colors,
 * including wrap-around from slice (N-1) to slice 0.
 */
export function getSliceColors(count: number): string[] {
  if (count <= 0) return [];
  if (count === 1) return [SLICE_PALETTE[0]];

  const result: string[] = [];
  const paletteLen = SLICE_PALETTE.length;

  for (let i = 0; i < count; i++) {
    let colorIdx = i % paletteLen;
    // If it's the last item and matches the first item, pick an alternate
    if (i === count - 1 && SLICE_PALETTE[colorIdx] === result[0]) {
      colorIdx = (colorIdx + 1) % paletteLen;
      // If it also matches the previous item, bump again
      if (SLICE_PALETTE[colorIdx] === result[i - 1]) {
        colorIdx = (colorIdx + 1) % paletteLen;
      }
    } else if (i > 0 && SLICE_PALETTE[colorIdx] === result[i - 1]) {
      colorIdx = (colorIdx + 1) % paletteLen;
    }
    result.push(SLICE_PALETTE[colorIdx]);
  }

  return result;
}

/**
 * Computes relative luminance and returns optimal high-contrast text color
 */
export function getContrastColor(hex: string): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  // Standard WCAG luminance approximation
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? '#0F172A' : '#FFFFFF';
}
