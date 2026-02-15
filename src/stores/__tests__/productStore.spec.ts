import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '../productStore'

const mockProducts = [
  {
    id: 1,
    title: 'Camisa',
    price: 99.9,
    description: 'Camisa confortável',
    category: 'clothing',
    image: 'http://example.com/img.png',
    rating: { rate: 4.5, count: 10 },
  },
  {
    id: 2,
    title: 'Notebook',
    price: 4999.9,
    description: 'Notebook rápido',
    category: 'electronics',
    image: 'http://example.com/img2.png',
    rating: { rate: 4.7, count: 25 },
  },
]

const hoisted = vi.hoisted(() => ({
  getMock: vi.fn(),
}))
vi.mock('@/services/api', () => ({
  getProducts: hoisted.getMock,
}))

describe('productStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetchProducts popula produtos e alterna flags de loading/erro', async () => {
    hoisted.getMock.mockResolvedValueOnce(mockProducts)
    const store = useProductStore()

    expect(store.isLoading).toBe(false)
    const p = store.fetchProducts()
    expect(store.isLoading).toBe(true)

    await p

    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.products.length).toBe(mockProducts.length)
    expect(store.displayedProducts.length).toBeLessThanOrEqual(store.limit)
  })

  it('define erro ao falhar e desativa loading', async () => {
    hoisted.getMock.mockRejectedValueOnce(new Error('Network error'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useProductStore()

    const p = store.fetchProducts()
    expect(store.isLoading).toBe(true)

    await p

    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('Não foi possível carregar os produtos. Tente novamente.')
    expect(store.products.length).toBe(0)
    errorSpy.mockRestore()
  })
})
