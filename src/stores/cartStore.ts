// Store de carrinho: gerencia itens, totais e persiste no localStorage
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/Product'

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'productexplorer:cart'

const loadInitialState = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      product: item.product,
      quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
    }))
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadInitialState())

  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.product.price * item.quantity, 0),
  )

  const saveToStorage = (value: CartItem[]) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
    }
  }

  watch(
    items,
    (value) => {
      saveToStorage(value)
    },
    { deep: true },
  )

  const addProduct = (product: Product) => {
    const existing = items.value.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity += 1
      return
    }
    items.value.push({ product, quantity: 1 })
  }

  const removeProduct = (productId: number) => {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const normalized = quantity < 1 ? 1 : Math.floor(quantity)
    const item = items.value.find((entry) => entry.product.id === productId)
    if (!item) return
    item.quantity = normalized
  }

  const increaseQuantity = (productId: number) => {
    const item = items.value.find((entry) => entry.product.id === productId)
    if (!item) return
    item.quantity += 1
  }

  const decreaseQuantity = (productId: number) => {
    const item = items.value.find((entry) => entry.product.id === productId)
    if (!item) return
    if (item.quantity <= 1) {
      removeProduct(productId)
      return
    }
    item.quantity -= 1
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addProduct,
    removeProduct,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }
})
