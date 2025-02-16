<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:value']);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:value', target.value);
};
</script>

<template>
  <input class="input-like-text" :value="props.value" @input="handleInput" type="text" />
</template>

<style scoped>
.input-like-text {
  background-color: blue;
  box-sizing: border-box;
  width: 100%;
  border: none;
  background: transparent;
  font: inherit;
  cursor: text;
  padding: 10px 15px;
  border-radius: 6px;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-like-text:focus,
.input-like-text:hover {
  outline: 2px solid lightgray;
}

input[type='text'] {
  font-size: xx-large;
}
</style>
