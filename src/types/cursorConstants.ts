export const CURSOR_TYPES = {
  DEFAULT: 'default',
  POINTER: 'pointer',
  GRAB: 'grab',
  NOT_ALLOWED: 'not-allowed',
} as const;

// Change the type to use the values of CURSOR_TYPES
export type CursorType = (typeof CURSOR_TYPES)[keyof typeof CURSOR_TYPES]; // This will be a union of the cursor type strings
