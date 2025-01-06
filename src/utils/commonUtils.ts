/**
 * Ensures a number is within the specified range [min, max].
 * @param value - The number to clamp.
 * @param min - The minimum allowed value.
 * @param max - The maximum allowed value.
 * @returns The clamped value.
 */
export const clampValue = (value: number, min: number, max: number): number => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};
