<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import type { Product } from '@/types/Product'
import { useCartStore } from '@/stores/cartStore'
const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'added'): void }>()
const cartStore = useCartStore()
const isPressed = ref(false)

const handleAdd = () => {
  if (isPressed.value) return
  isPressed.value = true
  cartStore.addProduct(props.product)
  emit('added')
  window.setTimeout(() => {
    isPressed.value = false
  }, 160)
}
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
      <h3 class="title" :title="product.title">{{ product.title }}</h3>
      <span class="category">{{ product.category }}</span>
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
    <button
      type="button"
      class="add-btn"
      :class="{ 'is-pressed': isPressed }"
      aria-label="Adicionar ao carrinho"
      @click.prevent.stop="handleAdd"
    >
      <span class="add-icon" aria-hidden="true">+</span>
    </button>
  </RouterLink>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
  overflow: hidden;
  height: 100%;
  text-decoration: none;
  color: #111;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
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
  min-height: 240px;
  background: var(--color-background-mute);
}
.image {
  height: 220px;
  max-width: 100%;
  object-fit: contain;
}
.add-btn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
}
.add-btn:active {
  background: #000;
  border-color: #000;
  color: #fff;
  transform: scale(0.97);
}
.add-btn.is-pressed {
  background: #000;
  border-color: #000;
  color: #fff;
  transform: scale(0.97);
}
.add-btn:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}
.add-icon {
  font-size: 20px;
  line-height: 1;
  color: inherit;
}

@media (hover: hover) and (pointer: fine) {
  .card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .add-btn:hover {
    background: #111;
    border-color: #111;
    color: #fff;
    transform: scale(1.03);
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
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

@media (max-width: 480px) {
  .image-wrap {
    padding: 12px;
    min-height: 240px;
  }
  .image {
    width: 100%;
    height: 240px;
    object-fit: contain;
  }
  .add-btn {
    right: 10px;
    bottom: 10px;
    width: 38px;
    height: 38px;
  }
  .info {
    padding: 10px 12px;
    gap: 6px;
  }
}
</style>
