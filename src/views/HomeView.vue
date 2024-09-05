<script setup lang="ts">
import BlockBuilderStudio from '@/components/BlockBuilderStudio.vue';
import BuildBlock from '@/components/BuildBlock.vue';
</script>

<template>
  <main>
    <div>
      <BlockBuilderStudio />
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
