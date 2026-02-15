import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/types/Product'

const product: Product = {
  id: 1,
  title: 'Camisa Azul',
  price: 99.9,
  description: 'Camisa confortável',
  category: 'clothing',
  image: 'http://example.com/img.png',
  rating: { rate: 4.5, count: 10 },
}

describe('ProductCard', () => {
  it('renderiza imagem com src e alt corretos', () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const img = wrapper.get('img.image')
    expect(img.attributes('src')).toBe(product.image)
    expect(img.attributes('alt')).toBe(product.title)
  })

  it('exibe categoria, título (com atributo title), rating e preço formatado', () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.get('.category').text()).toBe(product.category)

    const titleEl = wrapper.get('h3.title')
    expect(titleEl.text()).toBe(product.title)
    expect(titleEl.attributes('title')).toBe(product.title)

    expect(wrapper.get('.price').text()).toBe(`R$ ${product.price.toFixed(2)}`)
  })

  it('usa a estrutura de classes esperada', () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.info').exists()).toBe(true)
    expect(wrapper.find('.image-wrap').exists()).toBe(true)
  })

  it('root é RouterLink com to para rota de detalhes', () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe(`/produto/${product.id}`)
  })
})
