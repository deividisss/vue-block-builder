<!-- src/components/SkeletonLoader.vue -->
<template>
  <div class="skeleton-loader">
    <div class="skeleton-item" v-for="i in 9" :key="i">
      <div class="skeleton-header shimmer"></div>
      <div class="skeleton-image shimmer"></div>
      <!-- <div class="skeleton-text shimmer"></div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this simple skeleton loader
</script>

<style scoped>
.skeleton-loader {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .skeleton-loader {
    grid-template-columns: minmax(0, 1fr);
  }
}

.skeleton-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.skeleton-image {
  width: 100%;
  height: 400px;
  background-color: #e1bee7;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.skeleton-text {
  width: 60%;
  height: 20px;
  background-color: #e0e0e0;
  margin-top: 10px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-header {
  width: 15%;
  height: 16px;
  background-color: #e0e0e0;
  margin-bottom: 10px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

/* Shimmer Animation */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
