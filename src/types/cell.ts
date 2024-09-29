export interface Cell {
  active: boolean;
  rowIndex: number;
  columnIndex: number;
  index: number;
  hasOutline: boolean;
  isStartCell: boolean;
  isEndCell: boolean;
}
