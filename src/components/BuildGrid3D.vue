<script setup lang="ts">
import { computed } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import * as THREE from 'three';
import type { RenderedBuildBlock } from '@/types/renderedBuildBlock';
import { CAMERA_VIEWS, type CameraView } from '@/types/cameraConstants';

const props = withDefaults(
  defineProps<{
    renderedBuildBlocks?: RenderedBuildBlock[];
    columnCount: number;
    rowCount: number;
    hasControlsDisabled?: boolean;
    hasGridHelperDisabled?: boolean;
    hasAxesHelperDisabled?: boolean;
    heightSize?: 'small' | 'medium' | 'large';
    isCanvasVisible?: boolean;
    isLoading?: boolean;
    isZoomEnabled?: boolean;
    cameraView?: CameraView;
    isPlaceholderMessageVisible?: boolean;
  }>(),
  {
    isPlaceholderMessageVisible: false,
    isCanvasVisible: true,
    isLoading: false,
    isZoomEnabled: true,
    cameraView: CAMERA_VIEWS.ISO,
  }
);

const cameraPosition = computed<[number, number, number]>(() => {
  const gridSize = Math.max(props.rowCount, props.columnCount);
  const verticalOffset = gridSize * 1.5;
  const zOffset = 5 + gridSize * 2;

  if (props.cameraView === 'front') {
    return [0, 2, zOffset];
  }

  if (props.cameraView === 'left') {
    return [-gridSize * 1.2, verticalOffset, 0];
  }

  if (props.cameraView === 'iso') {
    return [gridSize * 1.2, verticalOffset, 3 + gridSize * 1.5];
  }

  throw new Error(`Unknown camera view: ${props.cameraView}`);
});

const createEdges = (geometry: THREE.BufferGeometry) => {
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: '#434242' });
  return new THREE.LineSegments(edgesGeometry, edgesMaterial);
};

const cameraTarget = computed<[number, number, number]>(() => {
  return [0, props.rowCount / 2, 0];
});
</script>

<template>
  <div>
    <div :class="['build-grid-3d', props.heightSize || 'medium']">
      <div v-if="isLoading" class="loader">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <TresCanvas
        v-if="isCanvasVisible && !isLoading"
        clear-color="#e1bee7"
        preset="realistic"
        enableProvideBridge
      >
        <TresPerspectiveCamera
          :position="cameraPosition"
          cameraPosition
          :fov="40"
          :near="0.1"
          :far="1000"
        />

        <OrbitControls
          :enabled="!props.hasControlsDisabled"
          :enableZoom="props.isZoomEnabled"
          :target="cameraTarget"
        />

        <TresGroup :position="[-props.columnCount / 2 + 0.5, 0.5, 0.5]">
          <TresGroup
            v-for="block in props.renderedBuildBlocks"
            :key="block.id"
            :position="[block.coordinates.x, block.coordinates.y, block.coordinates.z]"
          >
            <TresMesh v-if="block.type === '1x'">
              <TresBoxGeometry :args="[1, 1, 1]" />
              <TresMeshMatcapMaterial :color="block.color || '#a1d6b2'" />
              <primitive :object="createEdges(new THREE.BoxGeometry(1, 1, 1))" />
            </TresMesh>

            <TresGroup v-if="block.type === '2x'">
              <primitive
                :object="createEdges(new THREE.BoxGeometry(2, 1, 1))"
                :position="[0.5, 0, 0]"
              />
              <TresMesh :position="[0.5, 0, 0]">
                <TresBoxGeometry :args="[2, 1, 1]" />
                <TresMeshMatcapMaterial :color="block.color || '#a1d6b2'" />
              </TresMesh>
            </TresGroup>
          </TresGroup>
        </TresGroup>

        <TresDirectionalLight :position="[0, 2, 8]" :intensity="1.2" cast-shadow />
        <TresGridHelper v-if="!props.hasGridHelperDisabled" />
        <TresAxesHelper v-if="!props.hasAxesHelperDisabled" />
        <slot />
      </TresCanvas>

      <div v-show="!props.isLoading" class="placeholder">
        <slot name="placholderImg"></slot>
        <p v-if="isPlaceholderMessageVisible">
          3D Preview is currently disabled. Hover to reveal it.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.build-grid-3d {
  margin: 0;
  padding: 0;
  position: relative;
}

.build-grid-3d.small {
  height: 400px;
  border: 1px dashed grey;
  border-radius: 6px;
  overflow: hidden;
}

.build-grid-3d.medium {
  border-radius: 6px;
  height: 600px;
}
.build-grid-3d.large {
  height: 1000px;
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 18px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #76c7c0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  color: #666;
}

canvas {
  border: 1px dashed grey;
  border-radius: 6px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.build-grid-3d {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
