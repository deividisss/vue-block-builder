<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const navIsVisible = ref(true);
</script>

<template>
  <header v-if="navIsVisible">
    <nav>
      <ul>
        <li>
          <RouterLink to="/">BLOCK_BUILDER</RouterLink>
        </li>
        <li>
          <!-- <RouterLink to="/about">| Explore builds</RouterLink> -->
        </li>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
  padding: 2rem;
  font-size: xxx-large;
}

@media (max-width: 576px) {
  header {
    font-size: xx-large;
  }
}

ul {
  display: flex;
  gap: 0.4rem;
}

main {
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
</style>
