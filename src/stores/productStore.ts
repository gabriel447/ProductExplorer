import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/Product'
import { getProducts } from '@/services/api'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const limit = ref(12) // page size
  const page = ref(0)

  const totalPages = computed(() =>
    limit.value > 0 ? Math.ceil(products.value.length / limit.value) : 0,
  )
  const displayedProducts = computed(() => {
    const start = page.value * limit.value
    const end = start + limit.value
    return products.value.slice(start, end)
  })

  // Actions
  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await getProducts()
      products.value = data
      page.value = 0
    } catch (err) {
      error.value = 'Não foi possível carregar os produtos. Tente novamente.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const setLimit = (value: number) => {
    limit.value = value
    page.value = 0
  }
  const setPage = (value: number) => {
    if (value < 0 || value >= totalPages.value) return
    page.value = value
  }
  const nextPage = () => {
    if (page.value + 1 < totalPages.value) page.value += 1
  }
  const prevPage = () => {
    if (page.value > 0) page.value -= 1
  }

  return {
    products,
    isLoading,
    error,
    limit,
    page,
    totalPages,
    displayedProducts,
    fetchProducts,
    setLimit,
    setPage,
    nextPage,
    prevPage,
  }
})
