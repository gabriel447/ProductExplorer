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
      <RouterLink
        :to="`/produto/${item.product.id}`"
        class="cart-item-title"
        :title="item.product.title"
        @click="$emit('close-cart')"
      >
        {{ item.product.title }}
      </RouterLink>
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
        <button
          type="button"
          class="cart-remove-btn"
          @click="cartStore.removeProduct(item.product.id)"
        >
          Remover
        </button>
      </div>
      <span class="cart-item-total">
        {{ formatBRL.format(item.product.price * item.quantity) }}
      </span>
    </div>
  </li>
</template>
