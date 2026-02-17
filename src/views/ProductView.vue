<script setup lang="ts">
// View de detalhes de produto
// Responsabilidades: carregar produto, exibir detalhes, ações e carrinho
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getProductById } from '@/services/api'
import type { Product } from '@/types/Product'
import { useCartStore } from '@/stores/cartStore'
import CartModal from '@/components/CartModal.vue'
import ProductDetails from '@/components/ProductDetails.vue'
import CartButton from '@/components/CartButton.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()

const product = ref<Product | null>(null)
const isLoading = ref(false)
const isNotFound = ref(false)
const isCartOpen = ref(false)
const isAdding = ref(false)
const showAddSuccess = ref(false)
let addSuccessTimeout: ReturnType<typeof setTimeout> | undefined

const cartStore = useCartStore()

const loadProduct = async (id: string) => {
  isLoading.value = true
  isNotFound.value = false
  try {
    const data = await getProductById(id)
    if (!data) {
      product.value = null
      isNotFound.value = true
      return
    }
    product.value = data
  } catch (e) {
    console.error(e)
    product.value = null
    isNotFound.value = true
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
    if (addSuccessTimeout) {
      clearTimeout(addSuccessTimeout)
    }
    showAddSuccess.value = true
    addSuccessTimeout = setTimeout(() => {
      showAddSuccess.value = false
    }, 2200)
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

onBeforeUnmount(() => {
  if (addSuccessTimeout) {
    clearTimeout(addSuccessTimeout)
  }
})
</script>

<template>
  <section class="details" :class="{ 'details-notfound': isNotFound }">
    <transition name="toast-fade">
      <div v-if="showAddSuccess" class="toast toast-success" role="status" aria-live="polite">
        Produto adicionado com sucesso!
      </div>
    </transition>
    <div v-if="isLoading" class="loading">
      <div class="spinner" aria-label="Carregando"></div>
    </div>

    <NotFoundView
      v-else-if="isNotFound"
      title="Produto não encontrado"
      description="Não encontramos este produto. Ele pode não existir mais."
    />

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
.details-notfound {
  padding-top: 8px;
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
@media (max-width: 480px) {
  .details {
    padding: 52px 8px 20px;
    align-items: flex-start;
    justify-content: center;
  }
  .details-notfound {
    padding-top: 52px;
  }
  .panel {
    padding: 12px;
    margin-top: 32px;
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
