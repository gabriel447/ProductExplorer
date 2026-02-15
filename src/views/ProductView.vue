<script setup lang="ts">
// View de detalhes de produto
// Responsabilidades: carregar produto, exibir detalhes, ações e carrinho
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getProductById } from '@/services/api'
import type { Product } from '@/types/Product'
import { useCartStore } from '@/stores/cartStore'
import CartModal from '@/components/CartModal.vue'
import ProductDetails from '@/components/ProductDetails.vue'
import CartButton from '@/components/CartButton.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()

const product = ref<Product | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isCartOpen = ref(false)
const isAdding = ref(false)

const cartStore = useCartStore()

const loadProduct = async (id: string) => {
  isLoading.value = true
  error.value = null
  try {
    product.value = await getProductById(id)
  } catch (e) {
    error.value = 'Não foi possível carregar o produto. Tente novamente.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const addToCart = async () => {
  if (!product.value || isAdding.value) return
  isAdding.value = true
  try {
    cartStore.addProduct(product.value)
    await new Promise((resolve) => setTimeout(resolve, 400))
  } finally {
    isAdding.value = false
  }
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const goHome = () => {
  router.push({ name: 'home' })
}

onMounted(() => {
  loadProduct(props.id)
})

watch(
  () => props.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      loadProduct(newId)
    }
  },
)
</script>

<template>
  <section class="details">
    <div v-if="isLoading" class="loading">
      <div class="spinner" aria-label="Carregando"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button @click="goHome" class="back-btn">Voltar</button>
    </div>

    <div v-else-if="product">
      <ProductDetails
        :product="product"
        :is-adding="isAdding"
        @add-to-cart="addToCart"
        @back="goHome"
        @toggle-cart="toggleCart"
      />
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
    <button type="button" class="floating-back" @click="goHome" aria-label="Voltar">
      <svg viewBox="0 0 24 24" class="floating-back-icon" aria-hidden="true">
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
  </section>
</template>

<style scoped>
.details {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 52px 16px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
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
.back-arrow {
  position: absolute;
  left: 20px;
  top: calc(env(safe-area-inset-top, 0px) + 15px);
  width: 40px;
  height: 40px;
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
  width: 22px;
  height: 22px;
  color: #111;
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
.detail-actions {
  margin-top: 18px;
}
.detail-add-btn {
  border-radius: 10px;
  border: 1px solid #bfdbfe;
  background: #e5f0ff;
  color: #2563eb;
  font-size: 14px;
  padding: 10px 18px;
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

@media (max-width: 480px) {
  .details {
    padding: 52px 8px 20px;
    align-items: flex-start;
    justify-content: center;
  }
  .panel {
    padding: 12px;
    margin-top: 40px;
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
    min-height: 70vh;
  }
  .back-arrow {
    left: 20px;
    top: calc(env(safe-area-inset-top, 0px) + 15px);
    width: 40px;
    height: 40px;
  }
  .arrow-icon {
    width: 22px;
    height: 22px;
  }
}
.home-floating-cart {
  display: none;
}
@media (max-width: 640px) {
  .home-floating-cart {
    display: inline-flex;
  }
}
@media (max-width: 640px) {
  .details {
    padding: 16px 8px calc(env(safe-area-inset-bottom, 0px) + 90px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 140px);
  }
}
</style>
