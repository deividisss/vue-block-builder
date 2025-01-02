<script setup lang="ts">
import { ref, watch } from 'vue';
import BuildBlock from './BuildBlock.vue';
import BuildGrid from './BuildGrid.vue';
import { clampValue } from '@/utils/commonUtils';

const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

const MIN_VALUE = 1;
const MAX_VALUE = 12;

type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

const columnCountRaw = ref(10);
const rowCountRaw = ref(3);
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

watch(columnCountRaw, (newValue) => {
  columnCountRaw.value = clampValue(newValue, MIN_VALUE, MAX_VALUE);
});

watch(rowCountRaw, (newValue) => {
  rowCountRaw.value = clampValue(newValue, MIN_VALUE, MAX_VALUE);
});
</script>

<template>
  <div class="build-block-studio">
    <div class="input-list">
      <div>
        <label>
          Column count
          <input type="number" v-model.number="columnCountRaw" :min="MIN_VALUE" :max="MAX_VALUE" />
        </label>
      </div>
      <div>
        <label>
          Row count
          <input type="number" v-model.number="rowCountRaw" :min="MIN_VALUE" :max="MAX_VALUE" />
        </label>
      </div>
    </div>

    <div>
      <BuildGrid
        ref="buildGridRef"
        :activeBuildBlockType="activeBuildBlockType"
        :columnCount="columnCountRaw"
        :rowCount="rowCountRaw"
        :isDeleteModeActive="isDeleteModeActive"
      >
        <ul class="build-block-list">
          <li
            v-if="!isDeleteModeActive"
            :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.ONE_X }"
            @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.ONE_X)"
          >
            <BuildBlock hasStud cursor-type="POINTER" />
          </li>

          <li
            v-if="!isDeleteModeActive"
            :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X, 'two-x': true }"
            @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.TWO_X)"
          >
            <BuildBlock hasStud isStartPart cursor-type="POINTER" />
            <BuildBlock hasStud isEndPart cursor-type="POINTER" />
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
        <br />
        <br />
      </BuildGrid>
    </div>
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
  min-height: 68px;
  display: flex;
  gap: 20px;
  border: 1px solid lightgrey;
  border-top: none;
  padding: 20px;
  align-items: center;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.build-block-list li {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid lightgrey;
  cursor: pointer;
  padding: 12px;
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
  padding: 6px 12px;
}

.build-block-list li.active {
  background-color: #d0f0c0;
  border-color: #76c7c0;
}
</style>
