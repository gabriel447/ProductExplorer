<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container">
        <span class="navbar-brand">Product Explorer</span>
      </div>
    </nav>
  </header>

  <main class="container mt-4">
    <RouterView />
  </main>
</template>
