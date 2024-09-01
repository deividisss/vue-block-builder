<script setup lang="ts">
import BuildBlock from '@/components/BuildBlock.vue';
import BuildGrid from '@/components/BuildGrid.vue';
import { ref } from 'vue';
const columnCount = ref(6);
const rowCount = ref(4);
</script>

<template>
  <main>
    <div>
      <BuildGrid :columnCount="columnCount" :rowCount="rowCount" />
    </div>
    <label>Coumn count <input type="number" v-model="columnCount" min="1" /></label>
    <label>Row count <input type="number" v-model="rowCount" min="1" /></label>
    <div>
      <ul class="titles">
        <BuildBlock msg="1x" />
        <BuildBlock msg="1x" />
      </ul>
    </div>

    <div>
      <ul>
        <BuildBlock />
        <BuildBlock />
        <BuildBlock />
        <BuildBlock />
      </ul>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

ul.titles {
  gap: 1rem;
}

ul {
  display: flex;
}
</style>
