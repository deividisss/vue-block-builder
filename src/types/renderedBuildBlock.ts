export const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

export type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

export interface RenderedBuildBlock {
  id: string;
  cellIndexes: number[];
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  type: BuildBlockType;
}
