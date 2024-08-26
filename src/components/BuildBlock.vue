<script setup lang="ts">
defineProps<{
  msg?: string;
}>();
</script>

<template>
  <div class="build-block">
    <H1 v-if="msg">BuildBlock - {{ msg }}</H1>
    <div class="build-block__stud"></div>
    <div class="build-block__body"></div>
  </div>
</template>

<style scoped>
h1 {
  padding-bottom: 0.5rem;
}
.build-block {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.build-block__body {
  background-color: #a1d6b2;
  border: 0.2rem solid #434242;
  width: 1.8rem;
  height: 1.8rem;
  position: relative;
}

.build-block__stud {
  background-color: #a1d6b2;
  border: 0.2rem solid #434242;
  border-bottom: 0;
  width: 1rem;
  height: 0.3rem;
}
</style>
