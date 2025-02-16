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

/**
 * Debounces a function, ensuring it's not called more than once within the specified delay.
 * @param fn - The function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttles a function, ensuring it's called at most once every `limit` milliseconds.
 * @param fn - The function to throttle.
 * @param limit - The throttle delay in milliseconds.
 * @returns A throttled version of the function.
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          lastCall = Date.now();
          fn(...args);
        },
        limit - (now - lastCall)
      );
    }
  };
}
