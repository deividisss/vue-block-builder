<script setup lang="ts">
// import BuildGrid3D from '@/components/BuildGrid3D.vue';
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
    const response = await fetch(
      'https://ho65ikdkg5.execute-api.eu-central-1.amazonaws.com/Dev/customers'
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    const parsedBody = JSON.parse(result.body);
    const customers = parsedBody.data || [];

    const normalizedCustomers = customers.map((customer: any) => ({
      customer_id: customer.customer_id?.S || '',
      first_name: customer.first_name?.S || '',
      last_name: customer.last_name?.S || '',
      city: customer.City?.S || null,
    }));

    blockBuilderBuilds.value = normalizedCustomers;
    console.log('First customer ID:', normalizedCustomers[0]);
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
  <p>{{ blockBuilderBuilds }}</p>

  <div class="explore-builds-page">
    <h1>This is an explore builds page</h1>
    <div v-if="isLoading" class="loader">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <!-- <div v-if="!isLoading && !error" class="builds-container">
      <div v-for="(build, index) in blockBuilderBuilds" :key="index" class="build-item">
        <h2>Grid Size: {{ build.builgridSize.columnCount }}x{{ build.builgridSize.rowCount }}</h2>
        <BuildGrid3D
          :columnCount="build.builgridSize.columnCount"
          :renderedBuildBlocks="build.renderedBuildBlocks"
          hasControlsDisabled
          heightSize="small"
        />
      </div>
    </div> -->
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
