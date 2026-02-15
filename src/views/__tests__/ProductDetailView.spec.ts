import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductDetailView from '@/views/ProductDetailView.vue'

const hoisted = vi.hoisted(() => ({
  getMock: vi.fn(),
  backMock: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ back: hoisted.backMock }),
}))

describe('ProductDetailView', () => {
  beforeEach(() => {
    hoisted.backMock.mockReset()
    hoisted.getMock.mockReset()
  })

  it('renderiza dados do produto após carregamento', async () => {
    const product = {
      id: 42,
      title: 'Produto Teste',
      price: 123.45,
      description: 'Descricao',
      category: 'categoria',
      image: 'http://example.com/img.png',
      rating: { rate: 4.2, count: 7 },
    }

    hoisted.getMock.mockResolvedValueOnce(product)
    vi.mock('@/services/api', () => ({ getProductById: hoisted.getMock }))

    const wrapper = mount(ProductDetailView, {
      props: { id: '42' },
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(hoisted.getMock).toHaveBeenCalledWith('42')
    expect(wrapper.find('.panel').exists()).toBe(true)
    expect(wrapper.find('img.image').attributes('src')).toBe(product.image)
    expect(wrapper.find('.title').text()).toBe(product.title)
    expect(wrapper.find('.category').text()).toBe(product.category)
    const starsText = wrapper.find('.stars').text()
    expect(starsText.includes('★')).toBe(true)
    expect(wrapper.find('.rating-count').text()).toBe(`(${product.rating.count})`)
    expect(wrapper.find('.price').text()).toBe('R$ 123,45')
    expect(wrapper.find('.description').text()).toBe(product.description)
  })

  it('exibe erro e botão voltar quando requisição falha', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    hoisted.getMock.mockRejectedValueOnce(new Error('falha'))
    vi.mock('@/services/api', () => ({ getProductById: hoisted.getMock }))

    const wrapper = mount(ProductDetailView, {
      props: { id: '99' },
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(wrapper.find('.alert.alert-danger').exists()).toBe(true)
    const btn = wrapper.get('.back-btn')
    await btn.trigger('click')
    expect(hoisted.backMock).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
