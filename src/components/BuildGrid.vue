<script setup lang="ts">
import { ref, type Ref, watch, computed, defineExpose, onMounted } from 'vue';
import BuildBlock from './BuildBlock.vue';
import { getCellRightIndex, hasRightAdjacentColumn } from '@/utils/gridUtils/gridUtils';
import type { Cell } from '@/types/cell';
import { v4 as uuidv4 } from 'uuid';
import { CURSOR_TYPES } from '@/types/cursorConstants';
import BuildGrid3D from './BuildGrid3D.vue';
import {
  BUILD_BLOCK_TYPES,
  type BuildBlockType,
  type RenderedBuildBlock,
} from '@/types/renderedBuildBlock';

const props = defineProps<{
  buildGridSize?: number;
  columnCount?: number;
  rowCount?: number;
  activeBuildBlockType?: BuildBlockType;
  isDeleteModeActive: boolean;
  activeBuildColor: string;
}>();

// const API_URL = 'http://localhost:3000/block-builder-builds';
const API_URL = 'https://jywqfnzo48.execute-api.eu-central-1.amazonaws.com/dev/build-blocks';

onMounted(() => {
  const storeddBlocks = localStorage.getItem('renderedBuildBlocks');
  const storedCells = localStorage.getItem('cells');

  if (storeddBlocks && storedCells) {
    try {
      renderedBuildBlocks.value = JSON.parse(storeddBlocks) as RenderedBuildBlock[];
    } catch (error) {
      console.error('Failed to parse saved blocks:', error);
      renderedBuildBlocks.value = [];
    }

    try {
      cells.value = JSON.parse(storedCells) as Cell[];
    } catch (error) {
      console.error('Failed to parse saved cells:', error);
      cells.value = [];
    }
  }
});

async function publishBuildToServer(
  imageIsoUrlKey: string | URL,
  imageFrontUrlKey: string | URL
): Promise<void> {
  if (renderedBuildBlocks.value.length === 0) {
    throw new Error('No build blocks to publish');
  }

  const savedBuildData = {
    buildGridSize: {
      columnCount: props.columnCount,
      rowCount: props.rowCount,
    },
    renderedBuildBlocks: renderedBuildBlocks.value,
    cells: cells.value,
    images: {
      front: imageFrontUrlKey,
      iso: imageIsoUrlKey,
    },
  };

  console.log('Saved build data:', savedBuildData);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedBuildData),
    });

    if (!response.ok) {
      throw new Error('Failed to publish build');
    }

    const data = await response.json();
    console.log('Server response:', data);
  } catch (error) {
    console.error('Failed to publish build:', error);
  }
}

function saveBuild(): void {
  localStorage.setItem(
    'builgridSize',
    JSON.stringify({ columnCount: props.columnCount, rowCount: props.rowCount })
  );
  localStorage.setItem('renderedBuildBlocks', JSON.stringify(renderedBuildBlocks.value));
  localStorage.setItem('cells', JSON.stringify(cells.value));
}

function clearBuildGridAlert(msgCanceled: string, msgClearGrid: string): void {
  if (renderedBuildBlocks.value.length > 0) {
    const userConfirmed = confirm(msgClearGrid);

    if (userConfirmed) {
      renderedBuildBlocks.value = [];
      setupGridCells(props.columnCount ?? 0, props.rowCount ?? 0);
    } else {
      console.log(msgCanceled);
    }
  }
}

function clearBuildGrid(): void {
  if (renderedBuildBlocks.value.length === 0) return;

  renderedBuildBlocks.value = [];
  setupGridCells(props.columnCount ?? 0, props.rowCount ?? 0);
}

defineExpose({
  saveBuild,
  clearBuildGridAlert,
  clearBuildGrid,
  publishBuildToServer,
});

const cells = ref<Cell[]>([]);
const renderedBuildBlocks = ref<RenderedBuildBlock[]>([]);
const hoverColor: Ref<string> = ref('red');
const isExpanded = ref(false);

function setupGridCells(columnCount: number, rowCount: number) {
  cells.value = [];

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < columnCount; col++) {
      const index = row * columnCount + col;
      cells.value.push({
        active: false,
        rowIndex: row,
        columnIndex: col,
        index,
        hasOutline: false,
        hasDisabledOutline: false,
        disabled: false,
        isStartCell: false,
        isEndCell: false,
        color: '',
      });
    }
  }
}

watch(
  () => [props.columnCount, props.rowCount],
  ([columnCount, rowCount]) => {
    if (columnCount === undefined || rowCount === undefined) {
      return;
    }

    setupGridCells(columnCount, rowCount);
  },
  { immediate: true }
);

const emit = defineEmits<{
  (event: 'hasRenderedBuildBlocks', hasBlocks: boolean): void;
}>();

watch(
  () => renderedBuildBlocks.value.length,
  (newLength, oldLength) => {
    if (newLength !== oldLength) {
      emit('hasRenderedBuildBlocks', newLength > 0);
    }
  },
  { immediate: true }
);

function isCellRightActive(cell: Cell): boolean {
  const { rowIndex, columnIndex } = cell;

  const columnCount = props.columnCount ?? 1;
  const cellRightIndex = getCellRightIndex(rowIndex, columnIndex, columnCount);
  const cellRight = cells.value.find((c) => c.index === cellRightIndex);
  return cellRight ? cellRight.active : false;
}

function setCellHoverOutlineDeleteMode(
  renderedBuildBLockId: string | undefined,
  isHovered: boolean
): void {
  const renderedBuildBlock: RenderedBuildBlock | undefined = renderedBuildBlocks.value.find(
    (renderedBuildBlock) => renderedBuildBlock.id === renderedBuildBLockId
  );

  if (!renderedBuildBlock) return;

  renderedBuildBlock.cellIndexes.forEach((cellIndex) => {
    cells.value[cellIndex].hasOutline = isHovered;
    cells.value[cellIndex].hasDisabledOutline = isHovered;
    cells.value[cellIndex].disabled = isHovered;
  });
}

function setCellHoverOutline(cell: Cell, isHovered: boolean): void {
  const { active, columnIndex, rowIndex } = cell;

  if (active) {
    cell.disabled = isHovered;
    cell.hasOutline = isHovered;
    cell.hasDisabledOutline = isHovered;
  }

  if (!isTwoXBlock.value) return;
  if (!props.columnCount || props.columnCount <= 0) return;
  if (rowIndex == null || columnIndex == null) return;

  if (!hasRightAdjacentColumn(columnIndex, props.columnCount)) {
    cell.hasDisabledOutline = isHovered;
    return;
  }

  const nextCell = getNextCell(cell);

  if (!nextCell) return;
  setNextCellHoverOutline(nextCell, cell, isHovered);
}

function setNextCellHoverOutline(nextCell: Cell, cell: Cell, isHovered: boolean): void {
  nextCell.hasOutline = isHovered;

  if (cell.active || nextCell.active) {
    cell.hasDisabledOutline = isHovered;
    nextCell.hasDisabledOutline = isHovered;
  }

  if (nextCell.active) {
    nextCell.disabled = isHovered;
  }
}

function removeBuildBlock(index: number) {
  const cell = cells.value.find((cell) => cell.index === index);
  const renderedBuildBLockId = cell?.renderedBuildBLockId;

  const renderedBuildBlock: RenderedBuildBlock | undefined = renderedBuildBlocks.value.find(
    (renderedBuildBlock) => renderedBuildBlock.id === renderedBuildBLockId
  );

  if (!renderedBuildBlock) return;

  renderedBuildBlock.cellIndexes.forEach((cellIndex) => {
    cells.value[cellIndex].active = false;
    cells.value[cellIndex].hasOutline = false;
    cells.value[cellIndex].hasDisabledOutline = false;
    cells.value[cellIndex].disabled = false;
    cells.value[cellIndex].isStartCell = false;
    cells.value[cellIndex].isEndCell = false;
  });

  renderedBuildBlocks.value = renderedBuildBlocks.value.filter(
    (renderedBuildBlock) => renderedBuildBlock.id !== renderedBuildBLockId
  );
}

function buildCellContent(index: number): void {
  const cell = cells.value.find((cell) => cell.index === index);
  if (!cell || cell.active) return;
  const newUniqueId = uuidv4();

  if (!isTwoXBlock.value) {
    cell.active = true;
    cell.renderedBuildBLockId = newUniqueId;
    cell.color = props.activeBuildColor;

    const newRenderedBuildGBLock: RenderedBuildBlock = {
      id: newUniqueId,
      cellIndexes: [cell.index],
      coordinates: {
        x: cell.columnIndex,
        y: (props.rowCount ?? 1) - cell.rowIndex - 1,
        z: 0,
      },
      type: BUILD_BLOCK_TYPES.ONE_X,
      color: props.activeBuildColor,
    };

    renderedBuildBlocks.value.push(newRenderedBuildGBLock);
    return;
  }

  const columnCount = props.columnCount ?? 1;

  if (!hasRightAdjacentColumn(cell.columnIndex, columnCount)) return;

  const rightCellIndex = getCellRightIndex(cell.rowIndex, cell.columnIndex, columnCount);
  const cellRight = cells.value.find((cell) => cell.index === rightCellIndex)!;

  if (isCellRightActive(cell) && cellRight) return;

  cell.active = true;
  cellRight.active = true;
  cellRight.disabled = false;
  cellRight.hasOutline = false;
  cellRight.isEndCell = true;
  cell.isStartCell = true;
  cell.renderedBuildBLockId = newUniqueId;
  cellRight.renderedBuildBLockId = newUniqueId;
  cell.color = props.activeBuildColor;
  cellRight.color = props.activeBuildColor;

  const newRenderedBuildGBLock: RenderedBuildBlock = {
    id: newUniqueId,
    cellIndexes: [cell.index, cellRight.index],
    coordinates: {
      x: cell.columnIndex,
      y: (props.rowCount ?? 1) - cell.rowIndex - 1,
      z: 0,
    },
    type: BUILD_BLOCK_TYPES.TWO_X,
    color: props.activeBuildColor,
  };

  renderedBuildBlocks.value.push(newRenderedBuildGBLock);
}

function getNextCell(cell: Cell): Cell | undefined {
  const columnCount = props.columnCount ?? 1;
  const nextCellIndex = cell.rowIndex * columnCount + (cell.columnIndex + 1);
  return cells.value.find((c) => c.index === nextCellIndex);
}

function isCellAboveActive(cell: Cell): boolean {
  const columnCount = props.columnCount ?? 1;
  const { rowIndex, columnIndex } = cell;

  const cellAboveIndex = (cell.rowIndex - 1) * columnCount + cell.columnIndex;
  const cellAbove = cells.value.find((c) => c.index === cellAboveIndex);
  return cellAbove ? cellAbove.active : false;
}

const isTwoXBlock = computed(() => {
  return props.activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X;
});

const getCursorType = computed(() => {
  return (cell: Cell) => {
    if (props.isDeleteModeActive || !cell.disabled) {
      return CURSOR_TYPES.GRAB;
    }
    return CURSOR_TYPES.NOT_ALLOWED;
  };
});
</script>

<template>
  <div v-if="props.columnCount && props.columnCount > 13" class="tools-bar">
    <!-- <button>
      <span :style="{ color: props.activeBuildColor }">{{ props.activeBuildColor }}&nbsp;</span>
    </button> -->

    <button @click="isExpanded = !isExpanded">
      <span v-if="isExpanded">🔍➖</span>
      <span v-else>🔍➕</span>
    </button>
  </div>
  <div class="build-gri-wrapper">
    <div
      class="build-grid"
      :style="{
        gridTemplateColumns: `repeat(${props.columnCount}, minmax(${isExpanded ? 100 : 35}px, 1fr))`,
      }"
    >
      <div
        class="build-grid__cell"
        :class="{
          'has-outline': cell.hasOutline,
          'is-inactive': cell.hasDisabledOutline,
          'has-no-hover': cell.active || isDeleteModeActive,
        }"
        v-for="cell in cells"
        :key="cell.index"
        @click="isDeleteModeActive ? removeBuildBlock(cell.index) : buildCellContent(cell.index)"
        @mouseenter="
          isDeleteModeActive
            ? setCellHoverOutlineDeleteMode(cell.renderedBuildBLockId, true)
            : setCellHoverOutline(cell, true)
        "
        @mouseleave="
          isDeleteModeActive
            ? setCellHoverOutlineDeleteMode(cell.renderedBuildBLockId, false)
            : setCellHoverOutline(cell, false)
        "
      >
        <div
          class="build-block-wrapper"
          :class="{ 'is-multiblock': cell.isStartCell || cell.isEndCell }"
        >
          <BuildBlock
            :color="cell.color"
            v-if="cell.active"
            :is-disabled="cell.disabled"
            :has-stud="!isCellAboveActive(cell)"
            :is-start-part="cell.isStartCell"
            :is-end-part="cell.isEndCell"
            :cursor-type="getCursorType(cell)"
          />
        </div>
      </div>
    </div>
  </div>

  <slot></slot>

  <BuildGrid3D
    :renderedBuildBlocks="renderedBuildBlocks"
    :columnCount="columnCount ?? 1"
    :row-count="rowCount ?? 1"
  >
    <slot name="TresCanvas" />
  </BuildGrid3D>
</template>

<style scoped>
.build-block-wrapper {
  position: absolute;
  width: calc(100% - 4px);
  height: calc(100% + 2px);
  top: -1px;
  left: 2px;
}

.build-block-wrapper.is-multiblock {
  position: absolute;
  width: calc(100% - -1px);
  height: calc(100% + 2px);
  top: -1px;
  left: 0px;
}

.build-grid {
  cursor: grab;
  display: grid;
  background-color: #ce93d8;
  border: 1px solid #ce93d8;
  gap: 2px;
  overflow-x: auto;
  overflow-y: clip;
  position: relative;
}

.build-grid__cell {
  background-color: #e1bee7;
  aspect-ratio: 1 / 1;
  position: relative;
}

.build-grid__cell.has-outline {
  outline: 3px dotted #ffeb3b;
  outline-offset: -1px;
}

.build-grid__cell.has-outline.is-inactive {
  outline: 3px dotted red;
  z-index: 100;
  outline-offset: 0px;
}

.build-grid__cell:hover {
  outline: 3px dotted #ffeb3b;
  outline-offset: -1px;
}

.build-grid__cell.has-no-hover:hover {
  outline: none;
  outline-offset: unset;
}

.build-grid__cell.is-inactive:hover {
  outline: 3px dotted red;
  z-index: 100;
  outline-offset: 0px;
}

.active-build-color {
  width: 20px;
  height: 20px;
}

.wrapper {
  display: flex;
  gap: 5px;
}

.build-block-stud {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  top: -8px;
}

.build-block-stud__body {
  background-color: #a1d6b2;
  border: 0.2rem solid #434242;
  border-bottom: 0;
  width: 1rem;
  height: 0.3rem;
}
.build-gri-wrapper {
  position: relative;
}

.tools-bar {
  text-align: right;
  padding: 12px 20px;
  border: 1px solid lightgray;
  border-bottom: none;
  position: sticky;
  top: 0;
  z-index: 500;
}

.tools-bar button {
  min-height: 42px;
  margin-left: 5px;
}

.tools-bar button {
  padding: 8px 18px;
  font-size: 1rem;
  color: white;
  border: 2px solid lightgray;
  background-color: #fff;
  /* border: none; */
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
