<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import IconSvgCube from './components/icons/IconSvgCube.vue';
const navIsVisible = ref(true);
</script>

<template>
  <header v-if="navIsVisible">
    <nav>
      <div class="wrapper">
        <ul>
          <li>
            <IconSvgCube class="view-icon" path-fill-color="green" size="61" />
            <RouterLink to="/">BlockO</RouterLink>
          </li>
          <li>
            <!-- <RouterLink to="/about">| Explore builds</RouterLink> -->
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="wrapper">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  padding: 1.4rem;
  font-size: xxx-large;
  border: 1px solid lightgray;
}

@media (max-width: 576px) {
  header {
    font-size: xx-large;
  }
}

ul {
  padding: 0 20px;
  gap: 0.4rem;
}

li {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

li a {
  /* color: #3d6c4d; */
  font-weight: 700;
}

main {
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
</style>
