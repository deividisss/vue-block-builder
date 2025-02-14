<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import IconSvgCube from './components/icons/IconSvgCube.vue';
import AppFooter from './components/AppFooter.vue';

const navIsVisible = ref(true);
const isPageReady = ref(false);

onMounted(() => {
  setTimeout(() => {
    isPageReady.value = true;
  }, 10);
});
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

  <main>
    <div class="wrapper">
      <div class="content">
        <RouterView />
      </div>
    </div>
  </main>

  <AppFooter v-if="isPageReady" />
</template>

<style scoped>
header {
  padding: 20px 0;
  font-size: xxx-large;
  border-bottom: 1px solid lightgray;
}

.content {
  padding: 40px 20px;
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
</style>
