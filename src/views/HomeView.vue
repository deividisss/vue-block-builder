<script setup lang="ts">
import BlockBuilderStudio from '@/components/BlockBuilderStudio.vue';
import BuildBlock from '@/components/BuildBlock.vue';
</script>

<template>
  <main>
    <div class="content">
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

.content {
  width: 100%;
}

ul.titles {
  gap: 1rem;
}

ul {
  display: flex;
}
</style>
