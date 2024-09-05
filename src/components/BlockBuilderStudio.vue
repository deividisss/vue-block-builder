<script setup lang="ts">
import BuildBlock from './BuildBlock.vue';
import BuildGrid from './BuildGrid.vue';

import { ref } from 'vue';

const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

const columnCount = ref(6);
const rowCount = ref(3);
const activeBuildBlockType = ref<BuildBlockType>(BUILD_BLOCK_TYPES.ONE_X);

const setActiveBuildBlockType = (type: BuildBlockType) => {
  activeBuildBlockType.value = type;
};
</script>

<template>
  <div>activeBuildBlockType= {{ activeBuildBlockType }}</div>
  <label>Column count <input type="number" v-model="columnCount" min="1" /></label>
  <label>Row count <input type="number" v-model="rowCount" min="1" /></label>

  <div>
    <BuildGrid
      :activeBuildBlockType="activeBuildBlockType"
      :columnCount="columnCount"
      :rowCount="rowCount"
    />
  </div>

  <br />
  <ul class="build-block-list">
    <li
      :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.ONE_X }"
      @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.ONE_X)"
    >
      <BuildBlock hasStud />
    </li>

    <li
      :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X, 'two-x': true }"
      @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.TWO_X)"
    >
      <BuildBlock hasStud isStartPart />
      <BuildBlock hasStud isEndPart />
    </li>
  </ul>
</template>

<style scoped>
.build-block-list {
  display: flex;
  gap: 20px;
}

.build-block-list li {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #434242;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.build-block-list li:hover {
  background-color: #e0e0e0;
}

.build-block-list li.two-x {
  height: 40px;
  width: 80px;
}

.build-block-list li.active {
  background-color: #d0f0c0;
  border-color: #76c7c0;
}
</style>
