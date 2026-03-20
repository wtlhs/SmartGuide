<template>
  <div id="app">
    <nav class="nav">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/about" class="nav-link">关于</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App 组件不需要额外逻辑
</script>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-link:hover {
  background: #e0e0e0;
}

.nav-link.router-link-active {
  background: #1976d2;
  color: white;
}
</style>
