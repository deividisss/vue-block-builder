import { CAMERA_VIEWS, type CameraView } from '@/types/cameraConstants';

/**
 * Calculates the target position for the camera based on the row count,
 * with optional x and z offsets.
 *
 * @param {number} rowCount - The number of rows in the grid.
 * @param {number} xOffset - The x offset for the camera target (default: 0).
 * @param {number} zOffset - The z offset for the camera target (default: 0).
 * @returns {[number, number, number]} The camera target position as [x, y, z].
 */
export function getCameraTarget(
  rowCount: number,
  xOffset: number = 0,
  zOffset: number = 0
): [number, number, number] {
  const y = rowCount / 2;
  const x = xOffset;
  const z = zOffset;
  return [x, y, z];
}

/**
 * Calculates the camera position based on the grid size and camera view.
 *
 * @param {number} rowCount - The number of rows in the grid.
 * @param {number} columnCount - The number of columns in the grid.
 * @param {CameraView} cameraView - The camera view type (from CAMERA_VIEWS).
 * @returns {[number, number, number]} - The camera position as a tuple [x, y, z].
 */
export function calculateCameraPosition(
  rowCount: number,
  columnCount: number,
  cameraView: CameraView
): [number, number, number] {
  const gridSize = Math.max(rowCount, columnCount);
  const verticalOffset = gridSize * 1.5;
  const zOffset = 5 + gridSize * 2;

  const positions: Record<CameraView, [number, number, number]> = {
    [CAMERA_VIEWS.FRONT]: [0.5, 2, zOffset],
    [CAMERA_VIEWS.LEFT]: [-gridSize * 1.2, verticalOffset, 0],
    [CAMERA_VIEWS.ISO]: [gridSize * 1.2, verticalOffset, 3 + gridSize * 1.5],
  };

  // Default to ISO if the cameraView is unknown
  return positions[cameraView] || positions[CAMERA_VIEWS.ISO];
}
