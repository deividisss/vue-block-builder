export const CAMERA_VIEWS = {
  ISO: 'iso',
  FRONT: 'front',
  LEFT: 'left',
} as const;

export type CameraView = (typeof CAMERA_VIEWS)[keyof typeof CAMERA_VIEWS];
