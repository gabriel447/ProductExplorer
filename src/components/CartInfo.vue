<script setup lang="ts">
// Linha de informação do carrinho
// Responsabilidades: mostrar título, quantidade, remover e total por item
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import type { CartItem } from '@/stores/cartStore'

defineProps<{
  item: CartItem
}>()

defineEmits<{
  (e: 'close-cart'): void
}>()

const cartStore = useCartStore()
const formatBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <li class="cart-item">
    <div class="cart-item-row">
      <div class="cart-thumb-wrap">
        <RouterLink
          :to="`/produto/${item.product.id}`"
          class="cart-thumb-link"
          :title="item.product.title"
          @click="$emit('close-cart')"
        >
          <img :src="item.product.image" :alt="item.product.title" class="cart-thumb" />
        </RouterLink>
      </div>
      <div class="cart-title-row">
        <RouterLink
          :to="`/produto/${item.product.id}`"
          class="cart-item-title"
          :title="item.product.title"
          @click="$emit('close-cart')"
        >
          {{ item.product.title }}
        </RouterLink>
        <button
          type="button"
          class="cart-remove-btn"
          aria-label="Remover item do carrinho"
          @click="cartStore.removeProduct(item.product.id)"
        >
          <svg viewBox="0 0 24 24" class="cart-remove-icon" aria-hidden="true">
            <path
              d="M6 7h12M10 7v-2h4v2m-6 0v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-11"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div class="cart-controls-inline">
        <button
          type="button"
          class="cart-qty-btn"
          @click="cartStore.decreaseQuantity(item.product.id)"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span class="cart-qty" aria-label="Quantidade no carrinho">
          {{ item.quantity }}
        </span>
        <button
          type="button"
          class="cart-qty-btn"
          :disabled="item.quantity >= 9"
          @click="cartStore.increaseQuantity(item.product.id)"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>
      <span class="cart-item-total">
        {{ formatBRL.format(item.product.price * item.quantity) }}
      </span>
    </div>
  </li>
</template>
