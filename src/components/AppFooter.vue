<script setup lang="ts">
const name = 'Deividas Kasperavičius';
</script>

<template>
  <footer class="footer">
    <p>
      <span class="year">© 2025 </span>
      <span class="name">{{ name }}. </span>
      <span class="rights">All rights reserved.</span>
    </p>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 2rem;
  color: lightblack;
  font-size: larger;
  border-top: 1px solid lightgray;
}

@media (max-width: 768px) {
  .footer p {
    display: flex;
    gap: 0.4rem;
    flex-direction: column;
  }
}
</style>
