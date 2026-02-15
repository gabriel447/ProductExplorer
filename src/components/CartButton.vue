<script setup lang="ts">
// Botão flutuante do carrinho
// Responsabilidades: exibir atalho com badge de quantidade e emitir clique
defineProps<{
  totalItems: number
  extraClass?: string
}>()
defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    type="button"
    class="floating-cart"
    :class="[{ 'has-items': totalItems }, extraClass]"
    @click="$emit('click')"
    aria-label="Abrir carrinho de compras"
  >
    <svg viewBox="0 0 24 24" class="floating-cart-icon" aria-hidden="true">
      <path
        d="M7 4h-2l-1 2v1h2l3 9h8l3-9h-14"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="10" cy="19" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
    <span v-if="totalItems" class="floating-cart-badge">
      {{ totalItems }}
    </span>
  </button>
</template>
