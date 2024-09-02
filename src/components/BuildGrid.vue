<script setup lang="ts">
import { ref, type Ref } from 'vue';
import BuildBlock from './BuildBlock.vue';

withDefaults(
  defineProps<{
    buildGridSize: number;
    columnCount?: number;
    rowCount?: number;
  }>(),
  {
    buildGridSize: 6,
    columnCount: 1,
    rowCount: 1,
  }
);

const activeBuildColor: Ref<string> = ref('#a1d6b2');
const cellColors = ref<boolean[]>([]);

function buildCellContent(index: number): void {
  console.log('cell was clicked');
  cellColors.value[index] = !cellColors.value[index];
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
      v-for="index in columnCount * rowCount"
      :key="index"
      @click="buildCellContent(index)"
    >
      <div class="build-block-wrapper">
        <BuildBlock v-if="cellColors[index]" />
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
