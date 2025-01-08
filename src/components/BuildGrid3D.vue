<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import * as THREE from 'three';
import type { RenderedBuildBlock } from '@/types/renderedBuildBlock';

const props = defineProps<{
  renderedBuildBlocks?: RenderedBuildBlock[];
  columnCount: number;
  hasControlsDisabled?: boolean;
  heightSize?: 'small' | 'medium' | 'large'; // Prop to handle height size
}>();

const createEdges = (geometry: THREE.BufferGeometry) => {
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: '#434242' });
  return new THREE.LineSegments(edgesGeometry, edgesMaterial);
};
</script>

<template>
  <div :class="['build-grid-3d', props.heightSize || 'medium']">
    <TresCanvas clear-color="#e1bee7" preset="realistic" enableProvideBridge>
      <TresPerspectiveCamera :position="[7, 7, 7]" />
      <OrbitControls :enabled="!props.hasControlsDisabled" />

      <TresGroup :position="[-props.columnCount / 2 + 0.5, 0.5, 0.5]">
        <TresGroup
          v-for="block in props.renderedBuildBlocks"
          :key="block.id"
          :position="[block.coordinates.x, block.coordinates.y, block.coordinates.z]"
        >
          <TresMesh v-if="block.type === '1x'">
            <TresBoxGeometry :args="[1, 1, 1]" />
            <TresMeshMatcapMaterial color="#a1d6b2" />
            <primitive :object="createEdges(new THREE.BoxGeometry(1, 1, 1))" />
          </TresMesh>

          <TresGroup v-if="block.type === '2x'">
            <primitive
              :object="createEdges(new THREE.BoxGeometry(2, 1, 1))"
              :position="[0.5, 0, 0]"
            />
            <TresMesh :position="[0.5, 0, 0]">
              <TresBoxGeometry :args="[2, 1, 1]" />
              <TresMeshMatcapMaterial color="#a1d6b2" />
            </TresMesh>
          </TresGroup>
        </TresGroup>
      </TresGroup>

      <TresDirectionalLight :position="[0, 2, 8]" :intensity="1.2" cast-shadow />
      <TresGridHelper />
      <TresAxesHelper />
    </TresCanvas>
  </div>
</template>

<style scoped>
.build-grid-3d {
  margin: 0;
  padding: 0;
}

.build-grid-3d.small {
  height: 400px;
}

.build-grid-3d.medium {
  height: 600px;
}

.build-grid-3d.large {
  height: 1000px;
}

canvas {
  border: 1px dashed grey;
  border-radius: 6px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
