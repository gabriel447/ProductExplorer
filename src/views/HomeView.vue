<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/ProductCard.vue'

const productStore = useProductStore()

const searchInput = ref('')

const category = computed({
  get: () => productStore.selectedCategory,
  set: (value: string) => productStore.setCategory(value),
})

const sortKey = computed({
  get: () => productStore.sortKey,
  set: (value: 'price-asc' | 'price-desc' | 'best-rated') => productStore.setSortKey(value),
})

onMounted(() => {
  productStore.setLimit(12)
  productStore.fetchProducts()
})

let searchTimeout: ReturnType<typeof setTimeout> | undefined

watch(searchInput, (value) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    productStore.setSearchTerm(value)
  }, 300)
})

const clearSearch = () => {
  searchInput.value = ''
  productStore.setSearchTerm('')
}

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
      <div class="toolbar" aria-label="Filtros de catálogo">
        <div class="search-block">
          <div class="search-shell">
            <span class="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </span>
            <input
              id="search-input"
              v-model="searchInput"
              type="search"
              class="search-input"
              placeholder="Estou buscando por..."
            />
            <button
              v-if="searchInput"
              type="button"
              class="clear-btn"
              @click="clearSearch"
              aria-label="Limpar busca"
            >
              <svg viewBox="0 0 24 24" class="clear-icon" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="filter-block">
          <div class="select-shell">
            <select id="category-select" v-model="category" class="select-input">
              <option value="all">Todas as categorias</option>
              <option v-for="cat in productStore.categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
        </div>
        <div class="filter-block">
          <div class="select-shell sort-shell">
            <select id="sort-select" v-model="sortKey" class="select-input">
              <option value="best-rated">Melhor avaliados</option>
              <option value="price-asc">Preço: menor para maior</option>
              <option value="price-desc">Preço: maior para menor</option>
            </select>
          </div>
        </div>
      </div>
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
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 8px 0 20px;
  margin-bottom: 8px;
}
.search-block {
  flex: 1 1 240px;
  max-width: 420px;
}
.filter-block {
  flex: 0 0 180px;
}
.search-shell {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.35);
}
.search-shell:focus-within {
  border-color: #111;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.3);
  background: #fff;
}
.search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
.search-icon svg {
  width: 20px;
  height: 20px;
  display: block;
}
.clear-btn {
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px 0 0;
  cursor: pointer;
  color: #111;
}
.clear-btn:focus-visible {
  outline: none;
}
.clear-icon {
  width: 16px;
  height: 16px;
}
.search-input,
.select-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 999px;
  border: none;
  background: transparent;
  font-size: 14px;
  box-sizing: border-box;
}
.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
.search-input::placeholder {
  color: #6b7280;
  font-weight: 400;
}
.search-input:focus-visible,
.select-input:focus-visible {
  outline: none;
}
.select-shell {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.sort-shell {
  position: relative;
}
.select-shell:focus-within {
  border-color: #111;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.3);
}
.select-input {
  padding-left: 0;
  padding-right: 0;
}
.select-shell:focus-within {
  border-color: #111;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.3);
  background: #fff;
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
  margin-top: 40px;
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
@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 8px;
    padding: 4px 0 12px;
  }
  .search-block,
  .filter-block {
    flex: 0 0 auto;
    max-width: 100%;
  }
  .filter-block {
    flex: 1 1 auto;
  }
}
</style>
