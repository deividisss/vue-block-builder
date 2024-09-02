<script setup lang="ts">
defineProps<{
  msg?: string;
  hasStud?: boolean;
}>();
</script>

<template>
  <div class="build-block">
    <H1 v-if="msg">BuildBlock - {{ msg }}</H1>
    <div v-if ="hasStud" class="build-block__stud"></div>
    <div class="build-block__body"></div>
  </div>
</template>

<style scoped>
h1 {
  padding-bottom: 0.5rem;
}
.build-block {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.build-block__body {
  background-color: #a1d6b2;
  /* border: 0.2rem solid #434242; */
  border-bottom: 0.2rem solid #434242;
  border-left: 0.2rem solid #434242;
  border-right: 0.2rem solid #434242;
  border-top: 0.2rem solid #434242;
  position: relative;
}

.build-block__body--fixed-size {
  width: 1.8rem;
  height: 1.8rem;
}

.build-block__body {
  width: 100%;
  height: 100%;
}

.build-block__stud--fixed {
  position: absolute;
  background-color: #a1d6b2;
  border: 0.2rem solid #434242;
  border-bottom: 0;
  width: 1rem;
  height: 0.3rem;
  top: -8px;
}

.build-block__stud {
  position: absolute;
  background-color: #a1d6b2;
  border: 0.2rem solid #434242;
  border-bottom: 0;
  width: 20%;
  height: 10%;
  top: -10%;
}
</style>
