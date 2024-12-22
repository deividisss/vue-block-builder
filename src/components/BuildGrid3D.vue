<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import * as THREE from 'three';

const props = defineProps<{
  renderedBuildBlocks?: RenderedBuildBlock[];
  columnCount: number;
}>();

// Function to create edges for each box
const createEdges = (geometry: THREE.BufferGeometry) => {
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 'white' });
  return new THREE.LineSegments(edgesGeometry, edgesMaterial);
};
</script>

<template>
  <!-- <ul>
    <li v-for="(block, index) in renderedBuildBlocks" :key="block.id">
      X:{{ index }}: {{ block.cordinates.x }} (y: {{ block.cordinates.y }}) z:
      {{ block.cordinates.z }})
    </li>
  </ul> -->
  <div class="build-grid-3d">
    <TresCanvas clear-color="#e1bee7" preset="realistic" enableProvideBridge>
      <TresPerspectiveCamera :position="[9, 6, 7]" />
      <OrbitControls />

      <!-- Box 1 with edges -->
      <TresGroup :position="[-columnCount / 2 + 0.5, 0.5, 0.5]">
        <TresMesh
          v-for="block in renderedBuildBlocks"
          :key="block.id"
          :position="[block.cordinates.x, block.cordinates.y, block.cordinates.z]"
        >
          <TresBoxGeometry :args="[1, 1, 1]" />
          <TresMeshMatcapMaterial color="#a1d6b2" />
          <primitive :object="createEdges(new THREE.BoxGeometry(1, 1, 1))" />
        </TresMesh>

        <!-- <TresGroup :position="[4, 0, 0]">
          <primitive :object="createEdges(new THREE.BoxGeometry(3, 1, 1))" :position="[0, 0, 0]" />
          <TresMesh :position="[0, 0, 0]">
            <TresBoxGeometry :args="[3, 1, 1]" />
            <TresMeshMatcapMaterial color="red" />
          </TresMesh>
        </TresGroup> -->
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
  height: 800px;
}
</style>
