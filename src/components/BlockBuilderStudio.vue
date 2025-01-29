<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import BuildBlock from './BuildBlock.vue';
import BuildGrid from './BuildGrid.vue';
import { clampValue } from '@/utils/commonUtils';
import { CURSOR_TYPES } from '@/types/cursorConstants';

const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

const MIN_VALUE = 1;
const MAX_VALUE = 12;

const TRANSLATIONS = {
  CLEAR_GRID: 'Do you really want to clear the entire grid?',
  CLEAR_GRID_CANCELED: 'Grid clear operation canceled.',
  COLUMN_COUNT_EXCEEDS_MAX: `The column count cannot exceed ${MAX_VALUE}. Please enter a valid value.`,
  COLUMN_COUNT_BELOW_MIN: `The column count cannot be less than ${MIN_VALUE}. Please enter a valid value.`,
  ROW_COUNT_EXCEEDS_MAX: `The row count cannot exceed ${MAX_VALUE}. Please enter a valid value.`,
  ROW_COUNT_BELOW_MIN: `The row count cannot be less than ${MIN_VALUE}. Please enter a valid value.`,
  CHANGE_ROW_COUNT: `Changing the row count will delete the current blocks in the grid. Do you want to proceed?`,
  CHANGE_COLUMN_COUNT: `Changing the column count will delete the current blocks in the grid. Do you want to proceed?`,
};

const columnCountRaw = ref(10);
const tempColumnCountRaw = ref(columnCountRaw.value);
const rowCountRaw = ref(3);
const tempRowCountRaw = ref(rowCountRaw.value);
const isDeleteModeActive = ref(false);
const activeBuildBlockType = ref<BuildBlockType>(BUILD_BLOCK_TYPES.TWO_X);
const hasRenderedBuildBlocks = ref(false);

const buildGridRef = ref<InstanceType<typeof BuildGrid> | null>(null);

onBeforeMount(() => {
  const storedbuilgridSize = localStorage.getItem('builgridSize');

  if (storedbuilgridSize) {
    try {
      const parsedStoredbuilgridSize = JSON.parse(storedbuilgridSize) as {
        columnCount: number;
        rowCount: number;
      };

      columnCountRaw.value = parsedStoredbuilgridSize.columnCount;
      tempColumnCountRaw.value = parsedStoredbuilgridSize.columnCount;
    } catch (error) {
      console.error('Failed to parse stored storedbuilgridSize:', error);
    }

    try {
      const parsedStoredbuilgridSize = JSON.parse(storedbuilgridSize) as {
        columnCount: number;
        rowCount: number;
      };
      rowCountRaw.value = parsedStoredbuilgridSize.rowCount;
      tempRowCountRaw.value = parsedStoredbuilgridSize.rowCount;
    } catch (error) {
      console.error('Failed to parse stored storedbuilgridSize:', error);
    }
  }
});

const setActiveBuildBlockType = (type: BuildBlockType) => {
  activeBuildBlockType.value = type;
};

const handleSaveClick = (): void => {
  buildGridRef.value?.saveBuild();
};

const handlePublishBuildToFakeServer = (): void => {
  buildGridRef.value?.publishBuildToFakeServer();
};

const handleClearGridClickAlert = (clearGrid: string, clearGridCanceled: string): void => {
  buildGridRef.value?.clearBuildGridAlert(clearGridCanceled, clearGrid);
};

const handleClearGridClick = (): void => {
  buildGridRef.value?.clearBuildGrid();
};

function setRenderedBlocksStatus(hasBlocks: boolean) {
  hasRenderedBuildBlocks.value = hasBlocks;
}

const handleColumnCountChange = (): void => {
  if (tempColumnCountRaw.value < MIN_VALUE) {
    alert(TRANSLATIONS.COLUMN_COUNT_BELOW_MIN);
    tempColumnCountRaw.value = MIN_VALUE;
    return;
  }

  if (tempColumnCountRaw.value > MAX_VALUE) {
    alert(TRANSLATIONS.COLUMN_COUNT_EXCEEDS_MAX);
    tempColumnCountRaw.value = MAX_VALUE;
    return;
  }

  if (hasRenderedBuildBlocks.value && !confirm(TRANSLATIONS.CHANGE_COLUMN_COUNT)) {
    tempColumnCountRaw.value = columnCountRaw.value;
    return;
  }

  if (hasRenderedBuildBlocks.value) handleClearGridClick();

  columnCountRaw.value = clampValue(tempColumnCountRaw.value, MIN_VALUE, MAX_VALUE);
};

const handleRowCountChange = (): void => {
  if (tempRowCountRaw.value < MIN_VALUE) {
    alert(TRANSLATIONS.ROW_COUNT_BELOW_MIN);
    tempRowCountRaw.value = MIN_VALUE;
    return;
  }

  if (tempRowCountRaw.value > MAX_VALUE) {
    alert(TRANSLATIONS.ROW_COUNT_EXCEEDS_MAX);
    tempRowCountRaw.value = MAX_VALUE;
    return;
  }

  if (hasRenderedBuildBlocks.value && !confirm(TRANSLATIONS.CHANGE_ROW_COUNT)) {
    tempRowCountRaw.value = rowCountRaw.value;
    return;
  }

  if (hasRenderedBuildBlocks.value) handleClearGridClick();

  rowCountRaw.value = clampValue(tempRowCountRaw.value, MIN_VALUE, MAX_VALUE);
};
</script>

<template>
  <div class="build-block-studio">
    <div class="input-list">
      <div>
        <label>
          Column count
          <input
            type="number"
            v-model.number="tempColumnCountRaw"
            :min="MIN_VALUE"
            :max="MAX_VALUE"
            @change="handleColumnCountChange"
          />
        </label>
      </div>
      <div>
        <label>
          Row count
          <input
            type="number"
            v-model.number="tempRowCountRaw"
            :min="MIN_VALUE"
            :max="MAX_VALUE"
            @change="handleRowCountChange"
          />
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
        @hasRenderedBuildBlocks="setRenderedBlocksStatus"
      >
        <ul class="build-block-list">
          <li
            v-if="!isDeleteModeActive"
            :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.ONE_X }"
            @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.ONE_X)"
          >
            <BuildBlock hasStud :cursor-type="CURSOR_TYPES.POINTER" />
          </li>

          <li
            v-if="!isDeleteModeActive"
            :class="{ active: activeBuildBlockType === BUILD_BLOCK_TYPES.TWO_X, 'two-x': true }"
            @click="setActiveBuildBlockType(BUILD_BLOCK_TYPES.TWO_X)"
          >
            <BuildBlock hasStud isStartPart :cursor-type="CURSOR_TYPES.POINTER" />
            <BuildBlock hasStud isEndPart :cursor-type="CURSOR_TYPES.POINTER" />
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
            @click="
              handleClearGridClickAlert(TRANSLATIONS.CLEAR_GRID, TRANSLATIONS.CLEAR_GRID_CANCELED)
            "
          >
            Clear Grid
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
            @click="handlePublishBuildToFakeServer"
          >
            PUBLISH
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
  padding: 40px 20px;
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
