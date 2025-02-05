<script setup lang="ts">
import { useTresContext } from '@tresjs/core';
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { calculateCameraPosition, getCameraTarget } from '@/utils/cameraUtils';
import { CAMERA_VIEWS, type CameraView } from '@/types/cameraConstants';

const { renderer, scene } = useTresContext();
const isRendererReady = ref(false);

onMounted(() => {
  if (renderer.value) {
    isRendererReady.value = true;
  }
});

const hideHelpers = () => {
  scene.value.children.forEach((child) => {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) {
      child.visible = false;
    }
  });
};

const restoreHelpers = () => {
  scene.value.children.forEach((child) => {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) {
      child.visible = true;
    }
  });
};

const createRenderer = (canvas: HTMLCanvasElement, width: number, height: number) => {
  const newContext = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
  if (!newContext) return null;

  const newRenderer = new THREE.WebGLRenderer({
    canvas,
    context: newContext,
  });

  newRenderer.setSize(width, height);
  newRenderer.setClearColor(0xe1bee7, 1);
  newRenderer.toneMapping = renderer.value.toneMapping;
  newRenderer.toneMappingExposure = renderer.value.toneMappingExposure;
  newRenderer.shadowMap.enabled = renderer.value.shadowMap.enabled;
  newRenderer.shadowMap.type = renderer.value.shadowMap.type;

  return newRenderer;
};

const captureImageBlob = (
  width: number,
  height: number,
  rowCount: number,
  columnCount: number,
  cameraType: CameraView = CAMERA_VIEWS.ISO
): Promise<Blob | null> => {
  return new Promise<Blob | null>((resolve) => {
    if (!isRendererReady.value || !renderer.value || !scene.value) {
      resolve(null);
      return;
    }

    hideHelpers();

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const newRenderer = createRenderer(offscreenCanvas, width, height);
    if (!newRenderer) {
      restoreHelpers();
      resolve(null);
      return;
    }

    const cameraPosition = calculateCameraPosition(rowCount, columnCount, cameraType);
    const frontCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    frontCamera.position.set(...cameraPosition);
    frontCamera.lookAt(new THREE.Vector3(...getCameraTarget(rowCount)));
    frontCamera.aspect = width / height;
    frontCamera.updateProjectionMatrix();

    newRenderer.render(scene.value, frontCamera);

    offscreenCanvas.toBlob(
      (blob) => {
        if (blob) {
          console.log('Captured high-quality blob:', blob);
          resolve(blob);
        } else {
          console.error('Error capturing image');
          resolve(null);
        }

        newRenderer.dispose();
      },
      'image/webp',
      0.9
    );

    restoreHelpers();
  });
};

defineExpose({
  captureImageBlob,
});
</script>
