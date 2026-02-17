<script setup lang="ts">
// View de catálogo (Home)
// Responsabilidades: orquestrar busca, filtros, ordenação, paginação e exibir cards
import { onMounted, onBeforeUnmount, computed, ref, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/ProductCard.vue'
import CartButton from '@/components/CartButton.vue'
import CartModal from '@/components/CartModal.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const productStore = useProductStore()
const cartStore = useCartStore()

const searchInput = ref('')

const category = computed({
  get: () => productStore.selectedCategory,
  set: (value: string) => productStore.setCategory(value),
})

const sortKey = computed({
  get: () => productStore.sortKey,
  set: (value: 'price-asc' | 'price-desc' | 'best-rated') => productStore.setSortKey(value),
})

const isCategoryOpen = ref(false)
const isSortOpen = ref(false)
const isCartOpen = ref(false)
const showAddSuccess = ref(false)
let addSuccessTimeout: ReturnType<typeof setTimeout> | undefined

const categoryShell = ref<HTMLElement | null>(null)
const sortShell = ref<HTMLElement | null>(null)

const formatCategory = (value: string | undefined) =>
  (value ?? '')
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ')

const categoryLabel = computed(() =>
  category.value === 'all' ? 'Todas as categorias' : formatCategory(category.value),
)

const sortLabel = computed(() => {
  if (sortKey.value === 'price-asc') return 'Preço menor para maior'
  if (sortKey.value === 'price-desc') return 'Preço maior para menor'
  return 'Melhores avaliações'
})

const toggleCategory = () => {
  const willOpen = !isCategoryOpen.value
  isCategoryOpen.value = willOpen
  if (willOpen) {
    isSortOpen.value = false
  }
}

const toggleSort = () => {
  const willOpen = !isSortOpen.value
  isSortOpen.value = willOpen
  if (willOpen) {
    isCategoryOpen.value = false
  }
}

const selectCategory = (value: string) => {
  category.value = value
  isCategoryOpen.value = false
}

const selectSort = (value: 'price-asc' | 'price-desc' | 'best-rated') => {
  sortKey.value = value
  isSortOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null
  if (!target) return
  const insideCategory = categoryShell.value?.contains(target)
  const insideSort = sortShell.value?.contains(target)
  if (!insideCategory) {
    isCategoryOpen.value = false
  }
  if (!insideSort) {
    isSortOpen.value = false
  }
}

onMounted(() => {
  productStore.setLimit(12)
  productStore.fetchProducts()
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
  if (addSuccessTimeout) {
    clearTimeout(addSuccessTimeout)
  }
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

const goToPage = (n: number) => {
  productStore.setPage(n - 1)
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const handleProductAdded = () => {
  if (addSuccessTimeout) {
    clearTimeout(addSuccessTimeout)
  }
  showAddSuccess.value = true
  addSuccessTimeout = setTimeout(() => {
    showAddSuccess.value = false
  }, 2200)
}
</script>

<template>
  <section class="catalog">
    <transition name="toast-fade">
      <div v-if="showAddSuccess" class="toast toast-success" role="status" aria-live="polite">
        Produto adicionado com sucesso!
      </div>
    </transition>
    <div v-if="productStore.isLoading" class="loading">
      <div class="spinner" aria-label="Carregando"></div>
    </div>

    <NotFoundView
      v-else-if="productStore.error"
      title="Não foi possível carregar os produtos."
      description="Tente recarregar a página ou voltar mais tarde."
    />

    <div v-else>
      <div class="toolbar" aria-label="Filtros de catálogo">
        <div class="toolbar-left">
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
            <div
              ref="categoryShell"
              class="select-shell"
              :class="{ 'is-open': isCategoryOpen }"
              @click.self="toggleCategory"
            >
              <button
                id="category-select"
                type="button"
                class="select-input select-trigger"
                :aria-expanded="isCategoryOpen ? 'true' : 'false'"
                aria-haspopup="listbox"
                @click="toggleCategory"
              >
                <span class="select-text">{{ categoryLabel }}</span>
              </button>
              <ul
                v-if="isCategoryOpen"
                class="select-menu"
                role="listbox"
                aria-labelledby="category-select"
              >
                <li>
                  <button
                    type="button"
                    class="select-option"
                    :class="{ selected: category === 'all' }"
                    @click="selectCategory('all')"
                  >
                    Todas as categorias
                  </button>
                </li>
                <li v-for="cat in productStore.categories" :key="cat">
                  <button
                    type="button"
                    class="select-option"
                    :class="{ selected: category === cat }"
                    @click="selectCategory(cat)"
                  >
                    {{ formatCategory(cat) }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="filter-block">
            <div
              ref="sortShell"
              class="select-shell sort-shell"
              :class="{ 'is-open': isSortOpen }"
              @click.self="toggleSort"
            >
              <button
                id="sort-select"
                type="button"
                class="select-input select-trigger"
                :aria-expanded="isSortOpen ? 'true' : 'false'"
                aria-haspopup="listbox"
                @click="toggleSort"
              >
                <span class="select-text">{{ sortLabel }}</span>
              </button>
              <ul
                v-if="isSortOpen"
                class="select-menu"
                role="listbox"
                aria-labelledby="sort-select"
              >
                <li>
                  <button
                    type="button"
                    class="select-option"
                    :class="{ selected: sortKey === 'best-rated' }"
                    @click="selectSort('best-rated')"
                  >
                    Melhores avaliações
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="select-option"
                    :class="{ selected: sortKey === 'price-asc' }"
                    @click="selectSort('price-asc')"
                  >
                    Preço menor para maior
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="select-option"
                    :class="{ selected: sortKey === 'price-desc' }"
                    @click="selectSort('price-desc')"
                  >
                    Preço maior para menor
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="cart-trigger"
          :class="{ 'has-items': cartStore.totalItems }"
          @click="toggleCart"
          aria-label="Abrir carrinho de compras"
        >
          <svg viewBox="0 0 24 24" class="cart-icon" aria-hidden="true">
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
          <span v-if="cartStore.totalItems" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>
      <CartModal
        v-if="isCartOpen"
        :items="cartStore.items"
        :total-items="cartStore.totalItems"
        :total-price="cartStore.totalPrice"
        @close="isCartOpen = false"
      />
      <CartButton
        v-if="!isCartOpen"
        :total-items="cartStore.totalItems"
        extra-class="home-floating-cart"
        @click="toggleCart"
      />
      <div class="products-grid">
        <ProductCard
          v-for="product in productStore.displayedProducts"
          :key="product.id"
          :product="product"
          @added="handleProductAdded"
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
  padding: 8px 24px 20px;
}
.toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 8px 0 20px;
  margin-bottom: 8px;
}
.toolbar-left {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex: 1 1 auto;
}
.search-block {
  flex: 0 0 260px;
}
.filter-block {
  flex: 0 0 260px;
}
.cart-trigger {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  color: #111;
}
.cart-trigger.has-items {
  border-color: #ef4444;
}
.cart-icon {
  width: 22px;
  height: 22px;
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.home-floating-cart {
  display: none;
}
.search-shell {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.select-shell::after {
  content: '';
  position: absolute;
  right: 18px;
  top: 50%;
  width: 8px;
  height: 5px;
  margin-top: -2.5px;
  pointer-events: none;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #111;
}
.select-shell.is-open::after {
  transform: rotate(180deg);
}
.select-shell.is-open {
  background: #f3f4f6;
  border-color: #111;
}
.sort-shell {
  position: relative;
}
.sort-shell .select-input {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.select-shell:focus-within {
  border-color: #111;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.3);
  background: #fff;
}
.select-trigger {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.select-text {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #111;
}
.select-input {
  padding-left: 0;
  padding-right: 26px;
}
.select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: -1px;
  right: -1px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.18);
  padding: 0;
  margin: 0;
  z-index: 20;
}
.select-menu li {
  list-style: none;
}
.select-option {
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: #111;
}
.select-menu li:first-child .select-option {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.select-menu li:last-child .select-option {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}
.select-option:hover,
.select-option.selected {
  background: #f3f4f6;
  color: #111;
}
.loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
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
  gap: 12px;
  margin-top: 40px;
  margin-bottom: 48px;
}
.pages {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.page-item {
  border: none;
  background: transparent;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  min-width: 32px;
  height: 32px;
  padding: 0 4px;
  transition:
    color 0.15s ease,
    transform 0.15s ease;
}
.page-item.current {
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
}
.page-item:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.page-item:hover:not(.current) {
  color: #111;
  text-decoration: none;
}
.ellipsis {
  color: #6b7280;
}
.chevron {
  min-width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}
.chevron:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #111;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
}
.chevron:disabled {
  background: #f3f4f6;
  color: #cbd5e1;
  border-color: #e5e7eb;
  cursor: default;
  box-shadow: none;
  transform: none;
}
.chev-icon {
  width: 18px;
  height: 18px;
}
@media (max-width: 1024px) and (min-width: 641px) {
  .toolbar {
    padding: 6px 0 18px;
    gap: 8px;
  }
  .toolbar-left {
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    flex: 1 1 auto;
  }
  .search-block {
    flex: 1 1 0;
    max-width: 46%;
  }
  .filter-block {
    flex: 0 0 180px;
  }
  .search-shell {
    padding: 10px 12px;
  }
  .select-shell {
    padding: 11px 13px;
  }
  .search-input,
  .select-input {
    font-size: 13px;
  }
}
@media (max-width: 640px) {
  .catalog {
    padding: 0 16px 16px;
  }
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 8px;
    padding: 4px 0 12px;
  }
  .toolbar-left {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .search-block,
  .filter-block {
    flex: 0 0 auto;
    max-width: 100%;
  }
  .filter-block {
    flex: 0 0 auto;
  }
  .cart-trigger {
    display: none;
  }
  .home-floating-cart {
    display: inline-flex;
  }
}
</style>
