<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/ProductCard.vue'

const productStore = useProductStore()

onMounted(() => {
  productStore.setLimit(12)
  productStore.fetchProducts()
})

const pages = computed(() => {
  const total = productStore.totalPages
  const current = productStore.page + 1
  const items: Array<number | string> = []
  if (total <= 5) {
    for (let i = 1; i <= total; i++) items.push(i)
    return items
  }
  items.push(1)
  if (current > 3) items.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) items.push(i)
  if (current < total - 2) items.push('...')
  items.push(total)
  return items
})
const goToPage = (n: number) => productStore.setPage(n - 1)
</script>

<template>
  <section class="catalog">
    <div v-if="productStore.isLoading" class="loading">
      <div class="spinner" aria-label="Carregando"></div>
    </div>

    <div v-else-if="productStore.error" class="error-only" role="status" aria-live="polite">
      <h1 class="error-title">Não foi possível carregar os produtos.</h1>
    </div>

    <div v-else>
      <div class="products-grid">
        <ProductCard
          v-for="product in productStore.displayedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <nav class="pagination" aria-label="Paginação">
        <button
          class="chevron"
          :disabled="productStore.page === 0"
          @click="productStore.prevPage()"
          aria-label="Página anterior"
        >
          <svg viewBox="0 0 24 24" class="chev-icon" aria-hidden="true">
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
        <ul class="pages">
          <li v-for="item in pages" :key="String(item)">
            <button
              v-if="item !== '...'"
              class="page-item"
              :class="{ current: item === productStore.page + 1 }"
              @click="goToPage(item as number)"
              :aria-current="item === productStore.page + 1 ? 'page' : undefined"
            >
              {{ item }}
            </button>
            <span v-else class="ellipsis" aria-hidden="true">...</span>
          </li>
        </ul>
        <button
          class="chevron"
          :disabled="productStore.page + 1 >= productStore.totalPages"
          @click="productStore.nextPage()"
          aria-label="Próxima página"
        >
          <svg viewBox="0 0 24 24" class="chev-icon" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.catalog {
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 20px;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
@media (max-width: 480px) {
  .loading {
    min-height: 80vh;
  }
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
.products-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  align-items: stretch;
}
.error-only {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20vh;
}
.error-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;
  margin-bottom: 48px;
}
.pages {
  display: flex;
  align-items: center;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.page-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.page-item.current {
  background: #111;
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.page-item:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.ellipsis {
  color: #6b7280;
}
.chevron {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: #111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.chevron:disabled {
  opacity: 0.4;
  cursor: default;
}
.chev-icon {
  width: 18px;
  height: 18px;
}
</style>
