<script setup lang="ts">
import { useTresContext } from '@tresjs/core';
import { ref, onMounted } from 'vue';
import * as THREE from 'three';

const { renderer, scene, camera } = useTresContext();
const isRendererReady = ref(false);

onMounted(() => {
  if (renderer.value) {
    isRendererReady.value = true;
  }
});

const captureImageBlob = (width: number, height: number) =>
  new Promise<Blob | null>((resolve) => {
    if (isRendererReady.value && renderer.value && scene.value && camera.value) {
      scene.value.children.forEach((child) => {
        if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) {
          child.visible = false;
        }
      });

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const newContext = offscreenCanvas.getContext('webgl2', {
        preserveDrawingBuffer: true,
      });

      if (newContext) {
        const newRenderer = new THREE.WebGLRenderer({
          canvas: offscreenCanvas,
          context: newContext,
        });

        newRenderer.setSize(width, height);
        newRenderer.setClearColor(0xe1bee7, 1);
        newRenderer.toneMapping = renderer.value.toneMapping;
        newRenderer.toneMappingExposure = renderer.value.toneMappingExposure;
        newRenderer.shadowMap.enabled = renderer.value.shadowMap.enabled;
        newRenderer.shadowMap.type = renderer.value.shadowMap.type;
        
        newRenderer.render(scene.value, camera.value);

        offscreenCanvas.toBlob(
          (blob) => {
            console.log('Captured high-quality blob:', blob);
            resolve(blob);
            newRenderer.dispose();
          },
          'image/webp',
          0.9
        );
      } else {
        resolve(null);
      }

      scene.value.children.forEach((child) => {
        if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) {
          child.visible = true;
        }
      });
    } else {
      resolve(null);
    }
  });

defineExpose({
  captureImageBlob,
});
</script>
