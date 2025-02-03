<script setup lang="ts">
import { useTresContext } from '@tresjs/core';
import { ref, defineExpose, onMounted } from 'vue';

const { renderer } = useTresContext();
const isRendererReady = ref(false);

onMounted(() => {
  if (renderer.value) {
    isRendererReady.value = true;
  }
});

const captureImage = () =>
  new Promise<string | null>((resolve) => {
    if (isRendererReady.value && renderer.value) {
      requestAnimationFrame(() => {
        resolve(renderer.value.domElement.toDataURL('image/png'));
      });
    } else {
      resolve(null);
    }
  });

defineExpose({
  captureImage,
});
</script>
