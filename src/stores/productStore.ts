import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/Product'
import { getProducts } from '@/services/api'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const limit = ref(12) // page size
  const page = ref(0)
  const searchTerm = ref('')
  const selectedCategory = ref('all')
  const sortKey = ref<'price-asc' | 'price-desc' | 'best-rated'>('best-rated')

  const categories = computed(() => {
    const set = new Set<string>()
    for (const product of products.value) {
      set.add(product.category)
    }
    return Array.from(set).sort()
  })

  const filteredProducts = computed(() => {
    let list = products.value

    if (searchTerm.value.trim()) {
      const query = searchTerm.value.trim().toLowerCase()
      list = list.filter((product) => product.title.toLowerCase().includes(query))
    }

    if (selectedCategory.value !== 'all') {
      list = list.filter((product) => product.category === selectedCategory.value)
    }

    const sorted = [...list]

    if (sortKey.value === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortKey.value === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortKey.value === 'best-rated') {
      sorted.sort((a, b) => {
        const starsA = Math.round(a.rating.rate)
        const starsB = Math.round(b.rating.rate)
        if (starsB === starsA) {
          return b.rating.count - a.rating.count
        }
        return starsB - starsA
      })
    }

    return sorted
  })

  const totalPages = computed(() =>
    limit.value > 0 ? Math.ceil(filteredProducts.value.length / limit.value) : 0,
  )
  const displayedProducts = computed(() => {
    const start = page.value * limit.value
    const end = start + limit.value
    return filteredProducts.value.slice(start, end)
  })

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
  const setSearchTerm = (value: string) => {
    searchTerm.value = value
    page.value = 0
  }
  const setCategory = (value: string) => {
    selectedCategory.value = value
    page.value = 0
  }
  const setSortKey = (value: 'price-asc' | 'price-desc' | 'best-rated') => {
    sortKey.value = value
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
    searchTerm,
    selectedCategory,
    sortKey,
    categories,
    filteredProducts,
    totalPages,
    displayedProducts,
    fetchProducts,
    setLimit,
    setSearchTerm,
    setCategory,
    setSortKey,
    setPage,
    nextPage,
    prevPage,
  }
})
