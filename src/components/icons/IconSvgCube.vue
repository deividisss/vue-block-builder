<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  size: {
    type: String,
    default: '50px',
  },
  primaryColor: {
    type: String,
    default: '#A1D6B2',
  },
  secondaryColor: {
    type: String,
    default: '#8AC8A0',
  },
  tertiaryColor: {
    type: String,
    default: '#7ABF8F',
  },
  strokeColor: {
    type: String,
    default: '#000000',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
  pathFillColor: {
    type: String,
    default: '#fff',
  },
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512.132 512.132"
    style="enable-background: new 0 0 512.132 512.132"
    xml:space="preserve"
  >
    <g transform="translate(1)">
      <!-- Main Cube Faces -->
      <polygon
        :style="{ fill: primaryColor }"
        points="254.639,503.599 32.773,392.665 32.773,119.599 254.639,230.532"
      />
      <polygon
        :style="{ fill: secondaryColor }"
        points="254.639,503.599 476.506,392.665 476.506,119.599 254.639,230.532"
      />
      <polygon
        :style="{ fill: tertiaryColor }"
        points="32.773,119.599 246.106,8.665 476.506,119.599 254.639,230.532"
      />
      <!-- Cube Paths (Details) -->
      <path
        :fill="pathFillColor"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        d="M254.639,512.132c-1.707,0-2.56,0-3.413-0.853L29.359,400.345c-3.413-1.707-5.12-4.267-5.12-7.68V119.599
             c0-2.56,1.707-5.973,4.267-7.68s5.973-1.707,8.533,0l221.867,110.933c2.56,1.707,5.12,4.267,5.12,7.68v273.067
             c0,2.56-1.707,5.973-4.267,7.68C258.053,511.279,256.346,512.132,254.639,512.132z M41.306,387.545l204.8,102.4V235.652
             l-204.8-102.4V387.545z"
      />
      <path
        :fill="pathFillColor"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        d="M254.639,512.132c-1.707,0-3.413,0-4.267-0.853c-2.56-1.707-4.267-5.12-4.267-7.68V230.532
             c0-3.413,1.707-5.973,5.12-7.68l221.867-110.933c2.56-1.707,5.973-0.853,8.533,0c2.56,1.707,4.267,4.267,4.267,7.68v273.067
             c0,3.413-1.707,5.973-5.12,7.68L258.906,511.279C257.199,512.132,256.346,512.132,254.639,512.132z M263.173,235.652v254.293
             l204.8-102.4V133.252L263.173,235.652z"
      />
      <path
        :fill="pathFillColor"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        d="M254.639,239.065c-1.707,0-2.56,0-3.413-0.853L29.359,127.279c-3.413-1.707-5.12-4.267-5.12-7.68
             s1.707-5.973,4.267-7.68L241.839,0.985c2.56-0.853,5.12-1.707,7.68,0l230.4,110.933c2.56,1.707,5.12,4.267,5.12,7.68
             s-1.707,5.973-5.12,7.68L258.053,238.212C257.199,239.065,256.346,239.065,254.639,239.065z M51.546,119.599l203.093,101.547
             l202.24-101.547L246.106,18.052L51.546,119.599z"
      />
    </g>
  </svg>
</template>

<style scoped>
svg {
  display: block;
}
</style>
