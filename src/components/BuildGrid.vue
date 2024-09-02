<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import BuildBlock from './BuildBlock.vue';

// Define and access props
const props = defineProps<{
  buildGridSize: number;
  columnCount?: number;
  rowCount?: number;
}>();

// Initialize reactive references
const cells = ref<Cell[]>([]);
const activeBuildColor: Ref<string> = ref('#a1d6b2');

// Define the cell object structure
interface Cell {
  active: boolean;
  row: number;
  column: number;
  index: number;
}

// Function to initialize cells based on columnCount and rowCount
function initializeCells(columnCount: number, rowCount: number) {
  cells.value = [];

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < columnCount; col++) {
      const index = row * columnCount + col;
      cells.value.push({
        active: false,
        row,
        column: col,
        index,
      });
    }
  }
}

// Watch for changes in columnCount and rowCount
watch(
  () => [props.columnCount, props.rowCount],
  ([columnCount, rowCount]) => {
    if (columnCount === undefined || rowCount === undefined) {
      return; // Exit if props are not defined yet
    }

    initializeCells(columnCount, rowCount);
  },
  { immediate: true } // Initialize on component mount
);

// Toggle cell activation state
function buildCellContent(index: number): void {
  console.log('cell was clicked');
  const cell = cells.value.find((cell) => cell.index === index);
  if (cell) {
    cell.active = !cell.active;
  }
}

function isStudVisible() {
  console.log('columnCount', isCellBelowActive(cell));

  return;
}

function isCellAboveActive(cell: Cell): boolean {
  const columnCount = props.columnCount ?? 1;
  const cellAboveIndex = (cell.row - 1) * columnCount + cell.column;
  const cellAbove = cells.value.find((c) => c.index === cellAboveIndex);
  return cellAbove ? cellAbove.active : false;
}

// Check if the cell below is active
function isCellBelowActive(cell: Cell): boolean {
  const columnCount = props.columnCount ?? 1;
  const cellBelowIndex = (cell.row + 1) * columnCount + cell.column;
  const cellBelow = cells.value.find((c) => c.index === cellBelowIndex);
  return cellBelow ? cellBelow.active : false;
}
</script>

<template>
  <div class="wrapper">
    Active Build color = {{ activeBuildColor }}
    <div class="active-build-color" :style="{ backgroundColor: activeBuildColor }"></div>
  </div>
  {{ 'Size=' + columnCount * rowCount }} | Row count = {{ rowCount }} | Column count =
  {{ columnCount }} <br /><br />

  <div
    class="build-grid"
    :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
  >
    <div
      class="build-grid__cell"
      v-for="cell in cells"
      :key="cell.index"
      @click="buildCellContent(cell.index)"
    >
      <div class="build-block-wrapper">
        <BuildBlock v-if="cell.active" :has-stud="!isCellAboveActive(cell)" />
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
  transition:
    outline 0.2s ease-out,
    outline-offset 0.1s ease-out;
}

.build-grid__cell:hover {
  outline: 3px dotted #ffeb3b;
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
