<script setup lang="ts">
defineOptions({ name: 'ExploreBuildsView' });
import BuildGrid3D from '@/components/BuildGrid3D.vue';
import IconSvgCube from '@/components/icons/IconSvgCube.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { CAMERA_VIEWS, type CameraView } from '@/types/cameraConstants';
import type { Cell } from '@/types/cell';
import type { RenderedBuildBlock } from '@/types/renderedBuildBlock';
import { debounce } from '@/utils/commonUtils';
import { ref, onMounted, reactive, onActivated } from 'vue';

interface BlockBuilderBuild {
  buildGridSize: {
    columnCount: number;
    rowCount: number;
  };
  cells: Cell[];
  renderedBuildBlocks: RenderedBuildBlock[];
  buildId: string;
  images: {
    front: string;
    iso: string;
  };
}

onMounted(() => {
  console.log('Component mounted');
});

onActivated(() => {
  console.log('Component activated (restored from cache)');
});

// TODO: Implemnt skeleton loading
// TODO: Implemnt tests
// TODO: Disable 3D rendering when user scrolls
// TODO: *Add height slider controls

const blockBuilderBuilds = ref<BlockBuilderBuild[]>([]);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const isLoadMoreDisabled = ref<boolean>(false);
const ExclusiveStartKey = ref<string | null>(null);
const hasMore = ref<boolean>(true);
const limit = 9;
const selectedView = ref<CameraView>(CAMERA_VIEWS.ISO);

const canvasState = reactive({
  hoverDelayTimeout: null as NodeJS.Timeout | null,
  visibleCanvasIndex: null as number | null,
  loadingCanvasIndex: null as number | null,
  hoveredCanvasIndex: null as number | null,
});

const selectView = (view: CameraView) => {
  selectedView.value = view;
};

const fetchAWSData = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  try {
    const response = await fetch(
      `https://jywqfnzo48.execute-api.eu-central-1.amazonaws.com/dev/build-blocks?limit=${limit}${
        ExclusiveStartKey.value ? `&ExclusiveStartKey=${ExclusiveStartKey.value}` : ''
      }`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const builds = result.blockBuilderBuilds || [];
    ExclusiveStartKey.value = result.LastEvaluatedKey || null;
    hasMore.value = result.hasMore;
    blockBuilderBuilds.value = [...blockBuilderBuilds.value, ...builds];

    if (!hasMore.value) {
      isLoadMoreDisabled.value = true;
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

const loadMoreBuilds = () => {
  fetchAWSData();
};

const toggleCanvasVisibilityOnHover = debounce((canvasIndex: number, isHovering: boolean) => {
  if (!isHovering) {
    if (canvasState.hoverDelayTimeout !== null) clearTimeout(canvasState.hoverDelayTimeout);
    canvasState.visibleCanvasIndex = null;
    canvasState.loadingCanvasIndex = null;
    canvasState.hoveredCanvasIndex = null;
    return;
  }

  if (canvasState.hoveredCanvasIndex === canvasIndex) return;

  canvasState.hoveredCanvasIndex = canvasIndex;
  canvasState.loadingCanvasIndex = canvasIndex;

  if (canvasState.hoverDelayTimeout !== null) clearTimeout(canvasState.hoverDelayTimeout);
  canvasState.visibleCanvasIndex = null;

  canvasState.hoverDelayTimeout = setTimeout(() => {
    canvasState.loadingCanvasIndex = null;
    canvasState.visibleCanvasIndex = canvasIndex;
  }, 200);
}, 200);

onMounted(() => {
  fetchAWSData();
});
</script>

<template>
  <div class="explore-builds-page">
    <h1>Explore Builds</h1>

    <div class="view-selection">
      <label
        :class="{ active: selectedView === CAMERA_VIEWS.ISO }"
        tabindex="0"
        @keydown.enter="selectView(CAMERA_VIEWS.ISO)"
        @keydown.space="selectView(CAMERA_VIEWS.ISO)"
        :aria-selected="selectedView === CAMERA_VIEWS.ISO ? 'true' : 'false'"
        role="tab"
      >
        <input type="radio" v-model="selectedView" :value="CAMERA_VIEWS.ISO" />
        <IconSvgCube class="view-icon" path-fill-color="black" />
        Isometric View
      </label>

      <label
        :class="{ active: selectedView === CAMERA_VIEWS.FRONT }"
        tabindex="0"
        @keydown.enter="selectView(CAMERA_VIEWS.FRONT)"
        @keydown.space="selectView(CAMERA_VIEWS.FRONT)"
        :aria-selected="selectedView === CAMERA_VIEWS.FRONT ? 'true' : 'false'"
        role="tab"
      >
        <input type="radio" v-model="selectedView" :value="CAMERA_VIEWS.FRONT" />
        <svg class="view-icon" width="24" height="24" viewBox="0 0 24 24" fill="#a1d6b2">
          <rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="2" />
        </svg>
        2D Front View
      </label>
    </div>

    <!-- <div v-if="isLoading && blockBuilderBuilds.length === 0" class="loader">Loading...</div> -->
    <div v-if="error" class="error">Error: {{ error }}</div>

    <SkeletonLoader v-if="isLoading && blockBuilderBuilds.length === 0" />

    <div v-if="!error" class="builds-container">
      <div
        v-for="(build, index) in blockBuilderBuilds"
        :key="build.buildId + index"
        class="build-item"
        @mouseenter="toggleCanvasVisibilityOnHover(index, true)"
        @mouseleave="toggleCanvasVisibilityOnHover(index, false)"
      >
        <h2>
          <span v-if="build.buildGridSize">
            {{ build.buildGridSize.columnCount ?? 1 }}x{{ build.buildGridSize.rowCount ?? 1 }}
          </span>
        </h2>

        <BuildGrid3D
          v-if="build && build.buildGridSize"
          :columnCount="build.buildGridSize.columnCount ?? 1"
          :rowCount="build.buildGridSize.rowCount ?? 1"
          :renderedBuildBlocks="build.renderedBuildBlocks ?? []"
          :hasControlsDisabled="false"
          hasAxesHelperDisabled
          hasGridHelperDisabled
          heightSize="small"
          :isCanvasVisible="canvasState.visibleCanvasIndex === index"
          :isLoading="canvasState.loadingCanvasIndex === index"
          :camera-view="selectedView"
          :isZoomEnabled="false"
          :is-placeholder-message-visible="!(build.images.front || build.images.iso)"
        >
          <template #placholderImg v-if="build">
            <img
              v-show="
                build.images.front &&
                selectedView === CAMERA_VIEWS.FRONT &&
                canvasState.visibleCanvasIndex !== index
              "
              :src="build.images.front"
              alt="Front view"
              loading="lazy"
            />

            <img
              v-show="
                build.images.iso &&
                selectedView === CAMERA_VIEWS.ISO &&
                canvasState.visibleCanvasIndex !== index
              "
              :src="build.images.iso"
              alt="Isometric view"
              loading="lazy"
            />
          </template>
        </BuildGrid3D>

        <div v-if="!build">
          <p>Loading or no data available...</p>
        </div>
      </div>
    </div>

    <button v-if="!isLoading && hasMore" @click="loadMoreBuilds">Load more builds</button>
  </div>
</template>

<style scoped>
.view-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 15px 10px;
  border: 1px dashed lightgray;
  border-radius: 6px;
}

h1 {
  font-size: xx-large;
}
view-selection input[type='radio'] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.view-selection label {
  display: flex;
  align-items: center;
  font-size: large;
  cursor: pointer;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid lightgray;
  transition: all 0.2s ease-in-out;
}

.view-selection input[type='radio'] {
  display: none;
}

.view-selection label.active {
  background-color: #d0f0c0;
  border-color: #76c7c0;
}

.view-selection label:hover {
  border-color: #76c7c0;
}

.view-icon {
  width: 24px;
  height: 24px;
  transition:
    fill 0.2s ease-in-out,
    stroke 0.2s ease-in-out;
}

.explore-builds-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.builds-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .builds-container {
    grid-template-columns: minmax(0, 1fr);
  }
}

.build-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.build-item:hover {
  cursor: pointer;
}

.error {
  color: red;
}

.loader {
  font-size: 1.2em;
  font-weight: bold;
  color: #a1d6b2;
}

h2 {
  padding-bottom: 10px;
}

button {
  padding: 10px 20px;
  font-size: large;
  font-weight: bold;
  color: white;
  background-color: #a1d6b2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #7fbb98;
}

.build-item:hover {
  cursor: pointer;
}

img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
