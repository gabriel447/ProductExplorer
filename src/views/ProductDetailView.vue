<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductById } from '@/services/api'
import type { Product } from '@/types/Product'

const props = defineProps<{ id: string }>()
const router = useRouter()

const formatBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const product = ref<Product | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  error.value = null
  try {
    product.value = await getProductById(props.id)
  } catch (e) {
    error.value = 'Não foi possível carregar o produto. Tente novamente.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="details">
    <div v-if="isLoading" class="loading">
      <div class="spinner" aria-label="Carregando"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button @click="router.back()" class="back-btn">Voltar</button>
    </div>

    <div v-else-if="product" class="panel">
      <div class="content">
        <div class="image-wrap">
          <img :src="product.image" :alt="product.title" class="image" />
        </div>
        <div class="info">
          <div class="top-line">
            <span class="category">{{ product.category }}</span>
          </div>
          <h2 class="title" :title="product.title">{{ product.title }}</h2>
          <div class="rating">
            <span class="stars">
              {{ '★'.repeat(Math.round(product.rating.rate)).slice(0, 5) }}
              <span class="stars-empty">
                {{ '☆'.repeat(5 - Math.round(product.rating.rate)) }}
              </span>
            </span>
            <span class="rating-count">({{ product.rating.count }})</span>
          </div>
          <div class="price">{{ formatBRL.format(product.price) }}</div>
          <p class="description">{{ product.description }}</p>
        </div>
      </div>
      <button class="back-arrow" aria-label="Voltar" @click="router.back()">
        <svg viewBox="0 0 24 24" class="arrow-icon" aria-hidden="true">
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
    </div>
  </section>
</template>

<style scoped>
.details {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
.spinner {
  width: 64px;
  height: 64px;
  border: 6px solid var(--color-border);
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  opacity: 0.9;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.back-btn {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
}
.back-btn:hover {
  background: #000;
  border-color: #000;
}
.back-btn:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.panel {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
}
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}
@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
}
.image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.image {
  width: 380px;
  height: 380px;
  object-fit: contain;
}
.info {
  display: grid;
  gap: 8px;
  padding: 12px;
  grid-auto-rows: max-content;
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
.title {
  font-size: var(--font-detail-title-size);
  line-height: var(--line-tight);
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
.price {
  font-size: var(--font-detail-price-size);
  font-weight: 700;
  color: #111;
  margin-top: 4px;
}
.description {
  font-size: 15px;
  line-height: 1.6;
}
.back-arrow {
  position: absolute;
  left: 12px;
  top: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.back-arrow:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}
.arrow-icon {
  width: 20px;
  height: 20px;
  color: #111;
}

@media (max-width: 480px) {
  .details {
    padding: 12px 8px;
    align-items: flex-start;
    justify-content: center;
  }
  .panel {
    padding: 12px;
  }
  .content {
    gap: 16px;
    grid-template-columns: 1fr;
  }
  .image-wrap {
    padding: 8px;
  }
  .image {
    width: 300px;
    height: 300px;
  }
  .loading {
    min-height: 80vh;
  }
  .back-arrow {
    left: 8px;
    top: 8px;
    width: 40px;
    height: 40px;
  }
  .arrow-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
