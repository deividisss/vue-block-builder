<script setup lang="ts">
import IconSvgCube from './icons/IconSvgCube.vue';
import { RouterLink } from 'vue-router';
</script>
<template>
  <header>
    <div class="wrapper">
      <nav>
        <div class="logo">
          <IconSvgCube class="view-icon" path-fill-color="green" size="61" />
          <RouterLink to="/">BlockO</RouterLink>
        </div>

        <ul class="nav-list">
          <li>
            <RouterLink to="/" class="nav-item">New build</RouterLink>
          </li>
          <li>
            <RouterLink to="/explore-builds" class="nav-item">Explore builds</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  padding: 20px 0;
  font-size: xxx-large;
  border-bottom: 1px solid lightgray;
}

@media (max-width: 576px) {
  header {
    display: flex;
    font-size: xx-large;
  }
}

nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 21px;
}

.logo {
  gap: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.logo a {
  font-weight: 700;
}

.logo a:hover {
  color: #3d6c4d;
}

.nav-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.nav-item {
  display: inline-flex;
  text-decoration: none;
  color: #a1d6b2;
  font-weight: bold;
  padding: 10px 20px;
  font-size: large;
  border-radius: 6px;
  white-space: nowrap;
  transition:
    background 0.3s,
    color 0.3s;
}

.nav-item:hover {
  color: #3d6c4d;
}

.nav-item.router-link-active {
  color: white !important;
  background: #7fbb98;
}
</style>
