<!-- Parent Component -->
<script setup lang="ts">
import { ref } from 'vue';
import BuildBlock from './BuildBlock.vue';
import BuildGrid from './BuildGrid.vue';

const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

const columnCount = ref(10);
const rowCount = ref(5);
const isDeleteModeActive = ref(false);
const activeBuildBlockType = ref<BuildBlockType>(BUILD_BLOCK_TYPES.TWO_X);

const buildGridRef = ref<InstanceType<typeof BuildGrid> | null>(null);

const setActiveBuildBlockType = (type: BuildBlockType) => {
  activeBuildBlockType.value = type;
};

const handleSaveClick = () => {
  buildGridRef.value?.saveBuild();
};

const handleClearGridClick = () => {
  buildGridRef.value?.clearBuildGrid();
};
</script>

<template>
  <div class="build-block-studio">
    <div class="input-list">
      <div>
        <label>Column count <input type="number" v-model="columnCount" min="1" max="12" /></label>
      </div>
      <div>
        <label>Row count <input type="number" v-model="rowCount" min="1" max="12" /></label>
      </div>
    </div>

    <div>
      <BuildGrid
        ref="buildGridRef"
        :activeBuildBlockType="activeBuildBlockType"
        :columnCount="columnCount"
        :rowCount="rowCount"
        :isDeleteModeActive="isDeleteModeActive"
      />
    </div>

    <br />
    <ul class="build-block-list">
      <li
        v-if="!isDeleteModeActive"
        :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.ONE_X }"
        @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.ONE_X)"
      >
        <BuildBlock hasStud />
      </li>

      <li
        v-if="!isDeleteModeActive"
        :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X, 'two-x': true }"
        @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.TWO_X)"
      >
        <BuildBlock hasStud isStartPart />
        <BuildBlock hasStud isEndPart />
      </li>

      <li
        class="delete-button"
        :class="{ active: isDeleteModeActive, 'two-x': true }"
        @click="isDeleteModeActive = !isDeleteModeActive"
      >
        Delete mode
      </li>

      <li
        v-if="!isDeleteModeActive"
        class="delete-button"
        :class="{ active: isDeleteModeActive, 'two-x': true }"
        @click="handleSaveClick"
      >
        SAVE
      </li>

      <li
        v-if="!isDeleteModeActive"
        class="delete-button"
        :class="{ active: isDeleteModeActive, 'two-x': true }"
        @click="handleClearGridClick"
      >
        Clear Grid
      </li>
    </ul>
  </div>
</template>

<style scoped>
input[type='number'] {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid darkgrey;
  font-size: large;
}

.build-block-studio {
  padding: 20px;
}

.build-block-studio label {
  font-size: large;
}
.input-list {
  display: flex;
  gap: 30px;
  padding-bottom: 30px;
}
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

.build-block-list li.delete-button {
  height: 40px;
  width: fit-content;
}

.build-block-list li.active {
  background-color: #d0f0c0;
  border-color: #76c7c0;
}
</style>
