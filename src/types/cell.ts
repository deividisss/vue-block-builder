export interface Cell {
  active: boolean;
  rowIndex: number;
  columnIndex: number;
  index: number;
  hasOutline: boolean;
  hasDisabledOutline: boolean;
  isStartCell: boolean;
  isEndCell: boolean;
  disabled: boolean;
  renderedBuildBLockId?: string;
  color: string;
}
