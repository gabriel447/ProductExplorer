<script setup lang="ts">
// Modal de carrinho
// Responsabilidades: listar itens do carrinho, total e fechar modal
import CartInfo from '@/components/CartInfo.vue'
import type { CartItem } from '@/stores/cartStore'

defineProps<{
  items: CartItem[]
  totalItems: number
  totalPrice: number
}>()

defineEmits<{
  (e: 'close'): void
}>()

const formatBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <div class="cart-modal-backdrop" @click.self="$emit('close')">
    <div class="cart-modal" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      <div class="cart-header">
        <div class="cart-header-left">
          <h2 class="cart-title">Carrinho</h2>
          <span class="cart-subtitle">
            {{ totalItems }} item{{ totalItems === 1 ? '' : 's' }}
          </span>
        </div>
      </div>

      <ul class="cart-list" :class="{ 'cart-list-scroll': items.length > 4 }" v-if="items.length">
        <CartInfo
          v-for="item in items"
          :key="item.product.id"
          :item="item"
          @close-cart="$emit('close')"
        />
      </ul>
      <div v-else class="cart-empty">Nada por aqui ainda :(</div>

      <div class="cart-summary">
        <span class="cart-summary-label">Total da compra</span>
        <span class="cart-summary-value">
          {{ formatBRL.format(totalPrice) }}
        </span>
      </div>

      <button
        type="button"
        class="cart-modal-close"
        @click="$emit('close')"
        aria-label="Fechar carrinho"
      >
        ×
      </button>
    </div>
  </div>
</template>
