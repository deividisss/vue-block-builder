<script setup lang="ts">
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import BuildBlock from './BuildBlock.vue';
import BuildGrid from './BuildGrid.vue';
import { clampValue } from '@/utils/commonUtils';
import { CURSOR_TYPES } from '@/types/cursorConstants';
import CaptureImage from './CaptureImage.vue';
import { CAMERA_VIEWS, type CameraView } from '@/types/cameraConstants';
import { usePreSignedUrl } from '@/composables/useS3PreSignedUrl';
import { useS3ImageUpload } from '@/composables/useS3ImageUpload';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

const BUILD_BLOCK_TYPES = {
  ONE_X: '1x',
  TWO_X: '2x',
} as const;

type BuildBlockType = (typeof BUILD_BLOCK_TYPES)[keyof typeof BUILD_BLOCK_TYPES];

const MIN_VALUE = 1;
const MAX_VALUE = 32;
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

const API_URL_GENRATE_IMG =
  'https://3uvosftfob.execute-api.eu-central-1.amazonaws.com/dev/generateUrl';

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

const columnCountRaw = ref(16);
const tempColumnCountRaw = ref(columnCountRaw.value);
const rowCountRaw = ref(6);
const tempRowCountRaw = ref(rowCountRaw.value);
const isDeleteModeActive = ref(false);
const activeBuildBlockType = ref<BuildBlockType>(BUILD_BLOCK_TYPES.TWO_X);
const hasRenderedBuildBlocks = ref(false);
const captureImageRef = ref<InstanceType<typeof CaptureImage> | null>(null);
const capturedImage = ref<string | null>(null);
const buildGridRef = ref<InstanceType<typeof BuildGrid> | null>(null);
const isPublishingBuild = ref(false);
const isSavingBuildToDatabase = ref(false);

const hue = ref(145); // Greenish color
const saturation = ref(40); // 40% saturation
const luminosity = ref(70); // 70% lightness
const alpha = ref(1); // Fully opaque

const { isGeneratingImageUrl, getPreSignedUrl } = usePreSignedUrl(API_URL_GENRATE_IMG);
const { isUploading, uploadImageToS3 } = useS3ImageUpload();

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

const handlePublishBuildToServer = async (): Promise<void> => {
  isPublishingBuild.value = true;

  const imageIsoUrlKey = await captureAndUploadImage(
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    rowCountRaw.value,
    columnCountRaw.value,
    CAMERA_VIEWS.ISO
  );

  const imageFrontUrlKey = await captureAndUploadImage(
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    rowCountRaw.value,
    columnCountRaw.value,
    CAMERA_VIEWS.FRONT
  );

  if (!imageIsoUrlKey || !imageFrontUrlKey) return;
  isSavingBuildToDatabase.value = true;

  try {
    await buildGridRef.value?.publishBuildToServer(imageIsoUrlKey, imageFrontUrlKey);
  } catch (error) {
    console.error('Failed to publish build to server:', error);
  }

  isSavingBuildToDatabase.value = false;
  isPublishingBuild.value = false;
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

function generateUniqueImageName(): string {
  return `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
}

const captureAndUploadImage = async (
  imageWidth: number,
  imageHeight: number,
  rowCount: number,
  columnCount: number,
  cameraType: CameraView = CAMERA_VIEWS.ISO // Default to 'iso'
): Promise<string | null> => {
  try {
    if (!captureImageRef.value) {
      console.error('Capture Image Reference not found');
      return null;
    }

    const imageBlob = await captureImageRef.value.captureImageBlob(
      imageWidth,
      imageHeight,
      rowCount,
      columnCount,
      cameraType
    );

    if (!imageBlob) {
      console.error('Failed to capture image blob');
      return null;
    }

    const uniqueImageName = generateUniqueImageName();

    const preSignedUrl = await getPreSignedUrl(uniqueImageName, 'image/webp');
    if (!preSignedUrl) {
      console.error('Failed to get pre-signed URL');
      return null;
    }

    await uploadImageToS3(imageBlob, preSignedUrl);
    const imageUrlKey = getS3ImageKey(uniqueImageName);

    console.log('Image captured and uploaded successfully!');
    return imageUrlKey;
  } catch (error) {
    console.error('Error during image capture and upload process:', error);
    return null;
  }
};

const getS3ImageKey = (imageName: string): string => {
  return `images/${imageName}`;
};

const hslToHex = computed(() => {
  const h = hue.value;
  const s = saturation.value / 100;
  const l = luminosity.value / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
});

const onInput = (newHue: number) => {
  hue.value = newHue;
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
        :activeBuildColor="hslToHex"
      >
        <template v-slot:TresCanvas><CaptureImage ref="captureImageRef" /></template>
        <div v-if="isPublishingBuild" class="build-block-list">
          <div class="loader">
            <div class="spinner"></div>
            <p>Publishing:</p>
          </div>
          <div v-if="isGeneratingImageUrl">
            <p>Generating image URL</p>
          </div>
          <div v-else-if="isUploading">
            <p>Uploading image</p>
          </div>
          <div v-else-if="isSavingBuildToDatabase">
            <p>Publishing build to server with image URLs</p>
          </div>
        </div>

        <ul class="build-block-list" v-if="!isPublishingBuild">
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

          <li class="color-wrapper">
            <ColorPicker
              v-model:hue="hue"
              v-model:saturation="saturation"
              v-model:luminosity="luminosity"
              v-model:alpha="alpha"
              @input="onInput"
              :initially-collapsed="true"
              class="color-picker"
            />
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
            v-if="hasRenderedBuildBlocks && !isDeleteModeActive"
            class="delete-button"
            :class="{ active: isDeleteModeActive, 'two-x': true }"
            @click="handlePublishBuildToServer"
          >
            PUBLISH
          </li>
        </ul>
        <br />
        <br />
      </BuildGrid>
    </div>

    <div v-if="capturedImage">
      <p>Captured Image:</p>
      <img :src="capturedImage" alt="Captured Scene" />
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
  position: sticky;
  z-index: 999;
  bottom: -9px;
  background-color: #fff;
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

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 18px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #76c7c0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.color-picker {
  position: absolute;
}

li.color-wrapper {
  position: relative;

  border: none;
}

li.color-wrapper:hover {
  background-color: #fff;
}
</style>
