<script setup lang="ts">
import BuildGrid3D from '@/components/BuildGrid3D.vue';
import type { Cell } from '@/types/cell';
import type { RenderedBuildBlock } from '@/types/renderedBuildBlock';
import { ref, onMounted } from 'vue';

interface BlockBuilderBuild {
  builgridSize: {
    columnCount: number;
    rowCount: number;
  };
  cells: Cell[];
  renderedBuildBlocks: RenderedBuildBlock[];
}

const blockBuilderBuilds = ref<BlockBuilderBuild[]>([]);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/block-builder-builds');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: BlockBuilderBuild[] = await response.json();
    blockBuilderBuilds.value = data;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <div class="explore-builds-page">
    <h1>This is an explore builds page</h1>
    <div v-if="isLoading" class="loader">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="!isLoading && !error" class="builds-container">
      <div v-for="(build, index) in blockBuilderBuilds" :key="index" class="build-item">
        <h2>Grid Size: {{ build.builgridSize.columnCount }}x{{ build.builgridSize.rowCount }}</h2>
        <BuildGrid3D
          :columnCount="build.builgridSize.columnCount"
          :renderedBuildBlocks="build.renderedBuildBlocks"
          hasControlsDisabled
          heightSize="small"
        />
      </div>
    </div>
  </div>
</template>

<style>
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
