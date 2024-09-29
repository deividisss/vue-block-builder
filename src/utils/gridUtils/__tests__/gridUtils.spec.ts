import { describe, it, expect } from 'vitest';
import { hasRightAdjacentColumn, getCellRightIndex } from '../gridUtils';

describe('Grid Utility Functions', () => {
  describe('hasRightAdjacentColumn', () => {
    it('should return true when there is a right adjacent column', () => {
      expect(hasRightAdjacentColumn(1, 3)).toBe(true); // 2nd column in 3 total columns
      expect(hasRightAdjacentColumn(0, 2)).toBe(true); // 1st column in 2 total columns
    });

    it('should return false when there is no right adjacent column', () => {
      expect(hasRightAdjacentColumn(2, 3)).toBe(false); // Last column
      expect(hasRightAdjacentColumn(1, 1)).toBe(false); // Only one column
      expect(hasRightAdjacentColumn(4, 2)).toBe(false); // Only one column
    });

    it('should return false when current column index is out of bounds', () => {
      expect(hasRightAdjacentColumn(3, 3)).toBe(false); // Out of bounds (one index past the last column)
    });
  });

  describe('getCellRightIndex', () => {
    it('should return the correct right cell index', () => {
      expect(getCellRightIndex(0, 0, 3)).toBe(1); // First row, first column
      expect(getCellRightIndex(1, 1, 3)).toBe(5); // Second row, second column (1*3 + (1+1))
    });

    it('should handle edge cases correctly', () => {
      expect(getCellRightIndex(0, 2, 3)).toBe(3); // First row, last column (0*3 + (2+1))
    });
  });
});
