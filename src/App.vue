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
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/about">About</RouterLink>
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
  padding: 1rem;
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
