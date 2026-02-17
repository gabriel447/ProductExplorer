<script setup lang="ts">
import type { Product } from '@/types/Product'
import { useCartStore } from '@/stores/cartStore'
import ProductSummary from '@/components/ProductSummary.vue'
defineProps<{ product: Product; isAdding: boolean }>()
defineEmits<{ (e: 'add-to-cart'): void; (e: 'back'): void; (e: 'toggle-cart'): void }>()
const cartStore = useCartStore()
</script>

<template>
  <div class="panel">
    <div class="panel-actions">
      <button type="button" class="detail-back" aria-label="Voltar" @click="$emit('back')">
        <svg viewBox="0 0 24 24" class="detail-back-icon" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        class="detail-cart"
        :class="{ 'has-items': cartStore.totalItems }"
        aria-label="Abrir carrinho de compras"
        @click="$emit('toggle-cart')"
      >
        <svg viewBox="0 0 24 24" class="detail-cart-icon" aria-hidden="true">
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
        <span v-if="cartStore.totalItems" class="detail-cart-badge">
          {{ cartStore.totalItems }}
        </span>
      </button>
    </div>
    <ProductSummary :product="product">
      <template #actions>
        <button
          type="button"
          class="detail-add-btn"
          :disabled="isAdding"
          @click="$emit('add-to-cart')"
        >
          <span class="detail-add-icon" aria-hidden="true">
            <svg v-if="!isAdding" viewBox="0 0 24 24">
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
            <span v-else class="detail-spinner" />
          </span>
          <span class="detail-add-label">
            {{ isAdding ? 'Adicionando...' : 'Adicionar ao carrinho' }}
          </span>
        </button>
      </template>
      <template #category>
        <div class="top-line">
          <span class="category">{{ product.category }}</span>
        </div>
      </template>
      <template #rating>
        <div class="rating">
          <span class="stars">
            {{ '★'.repeat(Math.round(product.rating.rate)).slice(0, 5) }}
            <span class="stars-empty">
              {{ '☆'.repeat(5 - Math.round(product.rating.rate)) }}
            </span>
          </span>
          <span class="rating-count">({{ product.rating.count }})</span>
        </div>
      </template>
      <template #description>
        <p class="description">{{ product.description }}</p>
      </template>
    </ProductSummary>
  </div>
</template>
<style scoped>
.panel {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  max-width: 720px;
  margin: 0 auto;
}
.panel-actions {
  position: absolute;
  top: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
}
.top-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category {
  text-transform: uppercase;
  font-size: var(--font-category-size);
  opacity: 0.7;
}
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stars {
  color: #fbbf24;
  font-size: 16px;
}
.stars-empty {
  color: #d1d5db;
}
.rating-count {
  font-size: 14px;
  color: #6b7280;
}
.description {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.detail-back {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.detail-back-icon {
  width: 22px;
  height: 22px;
  color: #111;
}
.detail-add-btn {
  border-radius: 10px;
  border: 1px solid #bfdbfe;
  background: #e5f0ff;
  color: #2563eb;
  font-size: 14px;
  padding: 10px 18px;
  margin-top: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.detail-add-btn:disabled {
  opacity: 0.9;
  cursor: default;
}
.detail-add-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.detail-add-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}
.detail-cart {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.detail-cart.has-items {
  border-color: #ef4444;
}
.detail-cart-icon {
  width: 22px;
  height: 22px;
}
.detail-cart-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.detail-add-icon svg {
  width: 18px;
  height: 18px;
}
.detail-add-label {
  font-weight: 500;
}
.detail-spinner {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid transparent;
  border-top-color: #2563eb;
  border-right-color: #2563eb;
  animation: spin 0.6s linear infinite;
}
@media (max-width: 640px) {
  .detail-cart {
    display: none;
  }
  .detail-back {
    display: none;
  }
}
@media (max-width: 480px) {
  .description {
    font-size: 14px;
    -webkit-line-clamp: 5;
  }
  .detail-add-btn {
    padding: 10px 14px;
    margin-top: 8px;
  }
}
</style>
