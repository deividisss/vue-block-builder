<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';

const isPageReady = ref(false);

onMounted(() => {
  setTimeout(() => {
    isPageReady.value = true;
  }, 100);
});
</script>

<template>
  <AppHeader />

  <main>
    <div class="wrapper">
      <div class="content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['ExploreBuildsView']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </main>

  <AppFooter v-if="isPageReady" />
</template>

<style scoped>
.content {
  padding: 40px 20px;
}
</style>
