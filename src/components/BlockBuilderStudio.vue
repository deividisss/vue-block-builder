<script setup lang="ts">
import BuildGrid from './BuildGrid.vue';

import { ref } from 'vue';
const columnCount = ref(6);
const rowCount = ref(3);
</script>

<template>
  <label>Coumn count <input type="number" v-model="columnCount" min="1" /></label>
  <label>Row count <input type="number" v-model="rowCount" min="1" /></label>

  <div>
    <BuildGrid :columnCount="columnCount" :rowCount="rowCount" />
  </div>
</template>

<style scoped></style>
