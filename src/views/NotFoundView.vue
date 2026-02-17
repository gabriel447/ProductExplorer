<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

type NotFoundContext = 'home-load-error' | 'product-not-found' | 'route-not-found'

const props = withDefaults(
  defineProps<{
    context?: NotFoundContext
    title?: string
    description?: string
    showHomeButton?: boolean
    actionLabel?: string
  }>(),
  {
    context: 'route-not-found',
    title: '',
    description: '',
    showHomeButton: undefined,
    actionLabel: '',
  },
)

const emit = defineEmits<{
  (e: 'action'): void
}>()

const notFoundMessagesByContext: Record<
  NotFoundContext,
  { title: string; description: string; actionLabel: string; showHomeButton: boolean }
> = {
  'home-load-error': {
    title: 'Não foi possível carregar os produtos.',
    description: 'Tente recarregar a página ou voltar mais tarde.',
    actionLabel: '',
    showHomeButton: false,
  },
  'product-not-found': {
    title: 'Produto não encontrado',
    description: 'Não encontramos este produto. Ele pode não existir mais.',
    actionLabel: '',
    showHomeButton: true,
  },
  'route-not-found': {
    title: 'Oops! Esta página não pode ser encontrada!',
    description: '',
    actionLabel: '',
    showHomeButton: true,
  },
}

const notFoundViewModel = computed(() => {
  const context = props.context ?? 'route-not-found'
  const base = notFoundMessagesByContext[context]

  return {
    title: props.title || base.title,
    description: props.description || base.description,
    actionLabel: props.actionLabel || base.actionLabel,
    showHomeButton:
      typeof props.showHomeButton === 'boolean' ? props.showHomeButton : base.showHomeButton,
  }
})

const handlePrimaryActionClick = () => {
  emit('action')
}
</script>

<template>
  <section class="notfound">
    <div class="notfound-inner">
      <div class="notfound-code">404 :(</div>
      <p class="notfound-title">
        {{ notFoundViewModel.title }}
      </p>
      <p v-if="notFoundViewModel.description" class="notfound-description">
        {{ notFoundViewModel.description }}
      </p>
      <button
        v-if="notFoundViewModel.actionLabel"
        type="button"
        class="notfound-home-btn"
        @click="handlePrimaryActionClick"
      >
        <span>{{ notFoundViewModel.actionLabel }}</span>
      </button>
      <RouterLink
        v-else-if="notFoundViewModel.showHomeButton"
        to="/"
        class="notfound-home-btn"
        aria-label="Voltar para a página inicial"
      >
        <span>Voltar</span>
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
  gap: 8px;
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
