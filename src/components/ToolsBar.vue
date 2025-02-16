<script setup lang="ts">
import { useSticky } from '@/composables/useSticky';
import { ref } from 'vue';

type ToolsBarSize = 'full' | 'half';

const props = defineProps<{
  columnCount: number;
  isExpanded?: boolean;
  size?: ToolsBarSize;
}>();

const size = props.size ?? 'full';

const emit = defineEmits<{
  (event: 'toggle-expand'): void;
}>();

const toolsBarRef = ref<HTMLElement | null>(null);
const { isSticky } = useSticky(toolsBarRef);
</script>

<template>
  <div
    v-if="props.columnCount && props.columnCount > 13"
    ref="toolsBarRef"
    class="tools-bar"
    :class="{
      'half-width': size === 'half',
      'full-width': size === 'full',
      'sticky-active': isSticky,
    }"
  >
    <button @click="emit('toggle-expand')">
      <span v-if="isExpanded">🔍➖</span>
      <span v-else>🔍➕</span>
    </button>
  </div>
</template>

<style scoped>
.tools-bar {
  box-sizing: border-box;
  display: inline-block;
  width: calc(50%);
  text-align: right;
  padding: 20px 20px;
  border-top: 4px dashed #e1bee7;
  border-right: 4px dashed #e1bee7;
  border-left: 4px dashed #e1bee7;
  position: sticky;
  border-top-right-radius: 23px;
  border-top-left-radius: 107px;
  top: 0;
  z-index: 500;
  transition: border ease-in-out 0.3s;
}

.tools-bar.full-width {
  width: 100%;
}

.tools-bar.sticky-active {
  border-top: 4px dashed transparent;
  border-left: 4px dashed transparent;
  border-right: 4px dashed transparent;
  background-color: transparent;
  transition: border ease-in-out 0.04s;
}

.tools-bar button {
  min-height: 42px;
  margin-left: 5px;
  padding: 8px 18px;
  font-size: 1rem;
  color: white;
  border: 3px dashed lightgray;
  background-color: #fff;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
