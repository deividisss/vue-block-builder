<script setup lang="ts">
import { ref } from 'vue';

// Define props with default value
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
</script>

<template>
  {{ 'Size=' + columnCount * rowCount }} | Row count = {{ rowCount }} | Column count =
  {{ columnCount }} <br /><br />

  <div
    class="build-grid"
    :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
  >
    <div class="build-grid__cell" v-for="index in columnCount * rowCount" :key="index"></div>
  </div>
</template>

<style scoped>
.build-grid {
  cursor: grab;
  display: grid;
  background-color: #ce93d8;
  border: 1px solid #ce93d8;
  gap: 1px;
}

.build-grid__cell {
  background-color: #e1bee7;
  aspect-ratio: 1 / 1;
  position: relative;
  transition:
    outline 0.25s ease-out,
    outline-offset 0.1s ease-out;
}

.build-grid__cell:hover {
  outline: 3px dotted #ffeb3b;
  outline-offset: -2px;
}
</style>
