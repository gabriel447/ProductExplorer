<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Product } from '@/types/Product'
defineProps<{ product: Product }>()
</script>

<template>
  <RouterLink
    :to="`/produto/${product.id}`"
    class="card"
    :aria-label="`Abrir detalhes: ${product.title}`"
    :title="product.title"
  >
    <div class="image-wrap">
      <img :src="product.image" :alt="product.title" class="image" />
    </div>
    <div class="info">
      <span class="category">{{ product.category }}</span>
      <h3 class="title" :title="product.title">{{ product.title }}</h3>
      <div class="rating">
        <span class="stars">
          {{ '★'.repeat(Math.round(product.rating.rate)).slice(0, 5) }}
          <span class="stars-empty">
            {{ '☆'.repeat(5 - Math.round(product.rating.rate)) }}
          </span>
        </span>
        <span class="rating-count">({{ product.rating.count }})</span>
      </div>
      <div class="price">R$ {{ product.price.toFixed(2) }}</div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
  text-decoration: none;
  color: inherit;
  padding: 0;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.card:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  min-height: 220px;
  background: var(--color-background-mute);
}
.image {
  height: 200px;
  max-width: 100%;
  object-fit: contain;
}
.info {
  display: grid;
  grid-template-rows: auto auto auto auto;
  gap: 8px;
  padding: 12px 16px;
}
.category {
  display: inline-block;
  text-transform: uppercase;
  font-size: var(--font-category-size);
  color: var(--color-text);
  opacity: 0.7;
}
.title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--font-card-title-size);
  line-height: var(--line-tight);
}
.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.stars {
  color: #fbbf24;
}
.stars-empty {
  color: #d1d5db;
}
.rating-count {
  font-size: 12px;
  color: #6b7280;
}
.price {
  font-size: var(--font-card-price-size);
  font-weight: 700;
  color: #111;
}
</style>
