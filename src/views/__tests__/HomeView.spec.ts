import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'

const hoisted = vi.hoisted(() => ({
  setLimitMock: vi.fn(),
  fetchMock: vi.fn(),
  state: {
    isLoading: false as boolean,
    error: null as string | null,
    page: 0 as number,
    totalPages: 1 as number,
    displayedProducts: [] as Array<{
      id: number
      title: string
      price: number
      image: string
      category: string
    }>,
  },
}))

vi.mock('@/stores/productStore', () => ({
  useProductStore: () => ({
    isLoading: hoisted.state.isLoading,
    error: hoisted.state.error,
    page: hoisted.state.page,
    totalPages: hoisted.state.totalPages,
    filteredProducts: hoisted.state.displayedProducts,
    displayedProducts: hoisted.state.displayedProducts,
    selectedCategory: 'all',
    sortKey: 'best-rated',
    categories: [],
    setLimit: hoisted.setLimitMock,
    fetchProducts: hoisted.fetchMock,
    setSearchTerm: vi.fn(),
    setCategory: vi.fn(),
    setSortKey: vi.fn(),
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
  }),
}))

describe('HomeView', () => {
  beforeEach(() => {
    hoisted.setLimitMock.mockReset()
    hoisted.fetchMock.mockReset()
    hoisted.state.isLoading = false
    hoisted.state.error = null
    hoisted.state.page = 0
    hoisted.state.totalPages = 1
    hoisted.state.displayedProducts = []
  })

  it('mostra spinner enquanto carrega', () => {
    hoisted.state.isLoading = true
    const wrapper = mount(HomeView, {
      global: { stubs: { ProductCard: { template: '<div class="stub-card"></div>' } } },
    })
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.find('.products-grid').exists()).toBe(false)
  })

  it('não exibe UI de erro quando há erro (sem alerta e sem botão)', async () => {
    hoisted.state.error = 'erro'
    const wrapper = mount(HomeView)
    expect(wrapper.find('.alert.alert-danger').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renderiza cards com displayedProducts quando carregado', () => {
    hoisted.state.displayedProducts = [
      { id: 1, title: 'A', price: 10, image: 'a.png', category: 'cat' },
      { id: 2, title: 'B', price: 20, image: 'b.png', category: 'cat' },
    ]
    const wrapper = mount(HomeView, {
      global: { stubs: { ProductCard: { template: '<div class="stub-card"></div>' } } },
    })
    expect(wrapper.find('.loading').exists()).toBe(false)
    expect(wrapper.find('.alert.alert-danger').exists()).toBe(false)
    expect(wrapper.findAll('.stub-card').length).toBe(2)
  })

  it('chama setLimit(12) e fetchProducts no mounted', () => {
    mount(HomeView)
    expect(hoisted.setLimitMock).toHaveBeenCalledWith(12)
    expect(hoisted.fetchMock).toHaveBeenCalled()
  })
})
