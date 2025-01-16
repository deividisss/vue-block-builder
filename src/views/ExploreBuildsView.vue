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
}

const blockBuilderBuilds = ref<BlockBuilderBuild[]>([]);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const normalizeBlockBuilderBuilds = (data: any): BlockBuilderBuild[] => {
  return data.map((build: any) => ({
    buildGridSize: {
      columnCount: build.buildGridSize?.M?.columnCount?.N || 1,
      rowCount: build.buildGridSize?.M?.rowCount?.N || 1,
    },
    renderedBuildBlocks:
      build.renderedBuildBlocks?.L?.map((block: any) => ({
        id: block.M?.id?.S || '',
        coordinates: {
          x: block.M?.coordinates?.M?.x?.N || 0,
          y: block.M?.coordinates?.M?.y?.N || 0,
          z: block.M?.coordinates?.M?.z?.N || 0,
        },
        cellIndexes: block.M?.cellIndexes?.L?.map((index: any) => index?.N || 0) || [],
        type: block.M?.type?.S || '',
      })) || [],
    buildId: build.buildId?.S || '',
    timestamp: build.timestamp?.S || '',
  }));
};

const fetchAWSData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(
      'https://jywqfnzo48.execute-api.eu-central-1.amazonaws.com/dev/build-blocks'
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const parsedBody = JSON.parse(result.body);
    const builds = parsedBody.data || [];

    blockBuilderBuilds.value = normalizeBlockBuilderBuilds(builds);
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

const fetchFakeJSONServerData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/block-builder-builds');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    blockBuilderBuilds.value = result;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAWSData();
  // fetchFakeJSONServerData();
});
</script>

<template>
  <div class="explore-builds-page">
    <h1>This is an explore builds page</h1>
    <div v-if="isLoading" class="loader">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="!isLoading && !error" class="builds-container">
      <div v-for="(build, index) in blockBuilderBuilds" :key="index" class="build-item">
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
</style>
