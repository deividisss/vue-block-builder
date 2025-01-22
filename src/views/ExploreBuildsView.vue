<script setup lang="ts">
import BuildGrid3D from '@/components/BuildGrid3D.vue';
import type { Cell } from '@/types/cell';
import type { RenderedBuildBlock } from '@/types/renderedBuildBlock';
import { ref, onMounted } from 'vue';

interface BlockBuilderBuild {
  buildGridSize: {
    columnCount: number;
    rowCount: number;
  };
  cells: Cell[];
  renderedBuildBlocks: RenderedBuildBlock[];
  buildId: string;
}

// TODO: Render 3D instance only on clcik
// TODO: Hide Grid
// TODO: Enable navigation on hover with delay
// TODO: Implement 3D render imige generation using Lamda and S3
// TODO: Implemnt skeleton loading
// TODO: Implemnt tests
// TODO: Disable 3D rendering when user scrolls

const blockBuilderBuilds = ref<BlockBuilderBuild[]>([]);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const isLoadMoreDisabled = ref<boolean>(false);
const ExclusiveStartKey = ref<string | null>(null);
const hasMore = ref<boolean>(true);
const limit = 9;
const isCanvasVisible = ref<boolean[]>([]); // Controls visibility of canvas
const isCanvasLoading = ref<boolean[]>([]); // Controls loading spinner
const hoverTimeout = ref<NodeJS.Timeout | null>(null); // Track the timeout for hover

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

    builds.forEach(() => {
      isCanvasVisible.value.push(false);
      isCanvasLoading.value.push(false);
    });

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

const isHovered = ref<boolean[]>([]);
const isCanvasInitialized = ref<boolean[]>([]); // Track if canvas has been initialized for the first time

const toggleCanvasVisibilityOnHover = (index: number, isHovering: boolean) => {
  // Prevent repeated hover triggers within the same hover session
  if (isHovered.value[index] === isHovering) {
    return;
  }

  isHovered.value[index] = isHovering;

  if (isHovering) {
    // Reset and show the loading spinner
    isCanvasLoading.value[index] = true;

    if (hoverTimeout.value !== null) clearTimeout(hoverTimeout.value);
    hoverTimeout.value = setTimeout(() => {
      if (!isCanvasInitialized.value[index]) {
        isCanvasInitialized.value[index] = true; // Mark as initialized
      }

      if (isHovered.value[index]) {
        isCanvasVisible.value[index] = true; // Show canvas
        isCanvasLoading.value[index] = false; // Hide loading spinner
      }
    }, 300);
  } else {
    // Hide canvas and reset loading state on mouse leave
    if (hoverTimeout.value !== null) clearTimeout(hoverTimeout.value);
    isCanvasVisible.value[index] = false;
    isCanvasLoading.value[index] = false;
  }
};

onMounted(() => {
  fetchAWSData();
});
</script>

<template>
  <div class="explore-builds-page">
    <h1>Explore Builds</h1>
    <div v-if="isLoading && blockBuilderBuilds.length === 0" class="loader">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

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

        <div v-if="build && build.buildGridSize">
          <BuildGrid3D
            :columnCount="build.buildGridSize.columnCount ?? 1"
            :renderedBuildBlocks="build.renderedBuildBlocks ?? []"
            :hasControlsDisabled="false"
            hasAxesHelperDisabled
            hasGridHelperDisabled
            heightSize="small"
            :isLoading="isCanvasLoading[index]"
            :isCanvasVisible="isCanvasVisible[index]"
            :isZoomEnabled="false"
          />
        </div>
        <div v-else>
          <p>Loading or no data available...</p>
        </div>
      </div>
    </div>

    <button v-if="!isLoading && hasMore" @click="loadMoreBuilds">Load more builds</button>
  </div>
</template>

<style scoped>
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

.build-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.build-item:hover {
  cursor: pointer; /* Cursor changes to pointer on hover */
}

.error {
  color: red;
}

.loader {
  font-size: 1.2em;
  font-weight: bold;
  color: #007bff;
}

h2 {
  padding-bottom: 10px;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #0056b3;
}

.build-item:hover {
  cursor: pointer;
}
</style>
