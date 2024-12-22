<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import * as THREE from 'three';

// Function to create edges for each box
const createEdges = (geometry: THREE.BufferGeometry) => {
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 'white' });
  return new THREE.LineSegments(edgesGeometry, edgesMaterial);
};
</script>

<template>
  <div class="build-grid-3d">
    <TresCanvas clear-color="#80DBC5" preset="realistic" enableProvideBridge>
      <TresPerspectiveCamera :position="[7, 6, 7]" :look-at="[0, 1, 0]" />
      <OrbitControls />

      <!-- Box 1 with edges -->

      <TresGroup :position="[-2.5, 0.5, 0.5]">
        <TresMesh :position="[0, 0, 0]">
          <TresBoxGeometry :args="[1, 1, 1]" />
          <TresMeshMatcapMaterial color="orange" />
          <primitive :object="createEdges(new THREE.BoxGeometry(1, 1, 1))" />
        </TresMesh>

        <!-- Box 2 with edges -->
        <TresMesh :position="[1, 0, 0]">
          <TresBoxGeometry :args="[1, 1, 1]" />
          <TresMeshMatcapMaterial color="orange" />
          <primitive :object="createEdges(new THREE.BoxGeometry(1, 1, 1))" />
        </TresMesh>

        <!-- Box 3 with edges -->
        <TresMesh :position="[2, 0, 0]">
          <TresBoxGeometry :args="[1, 1, 1]" />
          <TresMeshMatcapMaterial color="orange" />
          <primitive :object="createEdges(new THREE.BoxGeometry(1, 1, 1))" />
        </TresMesh>

        <TresGroup :position="[4, 0, 0]">
          <primitive :object="createEdges(new THREE.BoxGeometry(3, 1, 1))" :position="[0, 0, 0]" />
          <TresMesh :position="[0, 0, 0]">
            <TresBoxGeometry :args="[3, 1, 1]" />
            <TresMeshMatcapMaterial color="red" />
            <!-- <primitive :object="createEdges(new THREE.BoxGeometry(2, 1, 1))" /> -->
          </TresMesh>
        </TresGroup>
      </TresGroup>

      <TresDirectionalLight :position="[0, 2, 4]" :intensity="1.2" cast-shadow />
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
