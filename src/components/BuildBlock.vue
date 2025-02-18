<script setup lang="ts">
import { CURSOR_TYPES, type CursorType } from '@/types/cursorConstants';
import { defineProps, withDefaults } from 'vue';

// Define props with cursoType type
const props = withDefaults(
  defineProps<{
    msg?: string;
    hasStud?: boolean;
    type?: '1x' | '2x';
    isStartPart?: boolean;
    isEndPart?: boolean;
    isDisabled?: boolean;
    cursorType?: CursorType;
    color?: string;
  }>(),
  {
    cursorType: CURSOR_TYPES.DEFAULT as CursorType,
  }
);
</script>

<template>
  <div
    class="build-block"
    :class="{
      'is-inactive': isDisabled,
    }"
    :style="{ cursor: cursorType, backgroundColor: props.color }"
  >
    <h1 v-if="msg">BuildBlock - {{ msg }}</h1>
    <div v-if="hasStud" class="build-block__stud" :style="{ backgroundColor: props.color }"></div>
    <div
      v-if="!isStartPart && !isEndPart"
      class="build-block__body build-block__body has-border-left has-border-right has-border-bottom has-border-top"
      :style="{ backgroundColor: props.color }"
    ></div>
    <!-- {{ props.cursorType }} -->
    <template v-if="isStartPart">
      <div
        class="build-block__body has-border-left has-border-bottom has-border-top"
        :style="{ backgroundColor: props.color }"
      ></div>
    </template>

    <template v-if="isEndPart">
      <div
        class="build-block__body has-border-right has-border-bottom has-border-top"
        :style="{ backgroundColor: props.color }"
      ></div>
    </template>
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
  position: relative;
}

.build-block.is-inactive .build-block__body {
  background: repeating-linear-gradient(-60deg, white 0, red 1px, red 10px, white 11px, white 20px);
  /* cursor: not-allowed; */
}

.build-block.is-inactive .build-block__stud {
  background: repeating-linear-gradient(-60deg, white 0, red 1px, red 10px, white 11px, white 20px);
  /* cursor: not-allowed; */
}

.has-border-left {
  border-left: 0.2rem solid #434242;
}

.has-border-bottom {
  border-bottom: 0.2rem solid #434242;
}

.has-border-right {
  border-right: 0.2rem solid #434242;
}

.has-border-top {
  border-top: 0.2rem solid #434242;
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

.build-block__stud.is-nactive {
  background: repeating-linear-gradient(-60deg, white 0, red 1px, red 10px, white 11px, white 20px);
}
</style>
