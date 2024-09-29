// TODO add Tests

export function hasRightAdjacentColumn(currentColumnIndex: number, columnCount: number): boolean {
  return currentColumnIndex + 1 < columnCount;
}

export function getCellRightIndex(
  cellRowIndex: number,
  cellColumnIndex: number,
  columnCount: number
): number {
  return cellRowIndex * columnCount + (cellColumnIndex + 1);
}
