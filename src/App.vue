<script setup lang="ts">
// Componente raiz da aplicação
// Responsabilidades: definir layout base e encaixar as rotas
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="app-main">
    <RouterView />
  </main>
</template>

<style scoped>
.app-main {
  width: 100%;
  padding: 24px;
}
</style>
