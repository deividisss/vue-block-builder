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

const blockBuilderBuilds = ref<BlockBuilderBuild[]>([]);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const isLoadMoreDisabled = ref<boolean>(false);
const ExclusiveStartKey = ref<string | null>(null);
const hasMore = ref<boolean>(true);
const limit = 3;

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

onMounted(() => {
  fetchAWSData();
});
</script>

<template>
  <div class="explore-builds-page">
    <h1>Explore Builds</h1>
    <div v-if="isLoading && blockBuilderBuilds.length === 0" class="loader">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="!isLoading && !error" class="builds-container">
      <div
        v-for="(build, index) in blockBuilderBuilds"
        :key="build.buildId + index"
        class="build-item"
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
            heightSize="small"
          />
        </div>
        <div v-else>
          <p>Loading or no data available...</p>
        </div>
      </div>
    </div>

    <br />
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
</style>
