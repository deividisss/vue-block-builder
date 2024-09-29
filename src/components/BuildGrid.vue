<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import BuildBlock from './BuildBlock.vue';
import { getCellRightIndex, hasRightAdjacentColumn } from '@/utils/gridUtils/gridUtils';
import type { Cell } from '@/types/cell';

const props = defineProps<{
  buildGridSize?: number;
  columnCount?: number;
  rowCount?: number;
  activeBuildBlockType?: BuildBlockType;
}>();

const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

const cells = ref<Cell[]>([]);
const renderedBuildBlocks = ref([]);
const activeBuildColor: Ref<string> = ref('#a1d6b2');
const hoverColor: Ref<string> = ref('red');

function initializeCells(columnCount: number, rowCount: number) {
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
        disabled: false,
        isStartCell: false,
        isEndCell: false,
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

    initializeCells(columnCount, rowCount);
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

function setNextCellHoverOutline(cell: Cell, isHovered: boolean): void {
  const { columnIndex, rowIndex } = cell;

  if (!props.columnCount || props.columnCount <= 0) return;
  if (rowIndex == null || columnIndex == null) return;
  if (!hasRightAdjacentColumn(columnIndex, props.columnCount)) return;

  const columnCount = props.columnCount ?? 1;
  const nextCellIndex = cell.rowIndex * columnCount + (cell.columnIndex + 1);
  const nextCell = cells.value.find((c) => c.index === nextCellIndex);

  if (nextCell && props.activeBuildBlockType !== BUILD_BLOCK_TYPES.ONE_X) {
    nextCell.hasOutline = isHovered;
    nextCell.disabled = isHovered;
  }
}

function buildCellContent(index: number): void {
  console.log('cell was clicked');
  const cell = cells.value.find((cell) => cell.index === index);
  if (!cell) return;

  cell.active = !cell.active;

  console.log('isCellRightActive(cell)', isCellRightActive(cell));
  const columnCount = props.columnCount ?? 1;

  if (props.activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X && !isCellRightActive(cell)) {
    const rightCellIndex = getCellRightIndex(cell.rowIndex, cell.columnIndex, columnCount);
    console.log('rightCellIndex', rightCellIndex);

    const cellRigt = cells.value.find((cell) => cell.index === rightCellIndex);

    if (cellRigt && !cellRigt.active) {
      cellRigt.active = true;
      cellRigt.isEndCell = true;
      cell.isStartCell = true;
    }
  }
}

function isCellAboveActive(cell: Cell): boolean {
  const columnCount = props.columnCount ?? 1;
  const { rowIndex, columnIndex } = cell;

  const cellAboveIndex = (cell.rowIndex - 1) * columnCount + cell.columnIndex;
  const cellAbove = cells.value.find((c) => c.index === cellAboveIndex);
  return cellAbove ? cellAbove.active : false;
}

function isCellInactiveForBuild(cell: Cell): boolean {
  const { columnIndex } = cell;

  if (props.columnCount == null || columnIndex == null) {
    return false;
  }

  const isTwoXBlock = props.activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X;
  const hasRightAdjacent = hasRightAdjacentColumn(columnIndex, props.columnCount);
  const isRightCellActive = isCellRightActive(cell);

  const isInactiveDueToNoRightAdjacent = isTwoXBlock && !hasRightAdjacent;
  const isInactiveDueToRightCellActive = isTwoXBlock && isRightCellActive;

  if (isInactiveDueToNoRightAdjacent || isInactiveDueToRightCellActive) {
    return true;
  }

  return false;
}
</script>

<template>
  <div class="wrapper">
    Active Build color = {{ activeBuildColor }}
    <div class="active-build-color" :style="{ backgroundColor: activeBuildColor }"></div>
  </div>
  {{ 'Size=' + (props.columnCount ?? 0) * (props.rowCount ?? 0) }} | Row count =
  {{ props.rowCount ?? 0 }} | Column count = {{ props.columnCount ?? 0 }} <br /><br />

  <div
    class="build-grid"
    :style="{ gridTemplateColumns: `repeat(${props.columnCount}, minmax(0, 1fr))` }"
  >
    <div
      class="build-grid__cell"
      :class="{
        'has-outline': cell.hasOutline,
        'is-inactive': isCellInactiveForBuild(cell),
      }"
      v-for="cell in cells"
      :key="cell.index"
      @click="buildCellContent(cell.index)"
      @mouseover="setNextCellHoverOutline(cell, true)"
      @mouseleave="setNextCellHoverOutline(cell, false)"
    >
      <div
        class="build-block-wrapper"
        :class="{ 'is-multiblock': cell.isStartCell || cell.isEndCell }"
      >
        <BuildBlock
          v-if="cell.active"
          :is-disabled="cell.disabled"
          :has-stud="!isCellAboveActive(cell)"
          :is-start-part="cell.isStartCell"
          :is-end-part="cell.isEndCell"
        />
      </div>
    </div>
  </div>
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

.build-grid__cell:hover {
  outline: 3px dotted #ffeb3b;
  outline-offset: -1px;
}

.build-grid__cell.is-inactive:hover {
  outline: 3px dotted red;
  outline-offset: -1px;
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
</style>
