<script setup lang="ts">
// View de página não encontrada
// Responsabilidades: exibir 404 reutilizável com título, descrição e link home
import { RouterLink } from 'vue-router'
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    showHomeButton?: boolean
  }>(),
  {
    title: 'Oops! Esta página não pode ser encontrada!',
    description: '',
    showHomeButton: true,
  },
)
</script>

<template>
  <section class="notfound">
    <div class="notfound-inner">
      <div class="notfound-code">404 :(</div>
      <p class="notfound-title">
        {{ props.title }}
      </p>
      <p v-if="props.description" class="notfound-description">
        {{ props.description }}
      </p>
      <RouterLink
        v-if="props.showHomeButton"
        to="/"
        class="notfound-home-btn"
        aria-label="Voltar para a página inicial"
      >
        Voltar
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.notfound {
  width: 100%;
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}
.notfound-inner {
  text-align: center;
}
.notfound-code {
  font-size: 72px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 10px;
}
.notfound-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 12px;
}
.notfound-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 18px;
}
.notfound-home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
}
.notfound-home-btn:hover {
  background: #000;
  border-color: #000;
}
.notfound-home-btn:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .notfound-card {
    padding: 24px 18px 22px;
    border-radius: 18px;
  }
  .notfound-code {
    font-size: 40px;
  }
  .notfound-title {
    font-size: 20px;
  }
}
</style>
