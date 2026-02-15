import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '../productStore'

let errorSpy: ReturnType<typeof vi.spyOn>

vi.mock('@/services/api', () => {
  return {
    getProducts: async () => {
      throw new Error('Network error')
    },
  }
})

describe('productStore error handling', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('define erro ao falhar e desativa loading', async () => {
    const store = useProductStore()

    const p = store.fetchProducts()
    expect(store.isLoading).toBe(true)

    await p

    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('Não foi possível carregar os produtos. Tente novamente.')
    expect(store.products.length).toBe(0)
  })
})
