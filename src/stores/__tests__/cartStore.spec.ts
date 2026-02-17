import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cartStore'
import type { Product } from '@/types/Product'

const product: Product = {
  id: 1,
  title: 'Produto Teste',
  price: 100,
  description: 'Descrição',
  category: 'categoria',
  image: 'http://example.com/img.png',
  rating: { rate: 4.5, count: 10 },
}

describe('cartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('adiciona produtos e acumula quantidades e totais', () => {
    const store = useCartStore()

    store.addProduct(product)
    store.addProduct(product)

    expect(store.items.length).toBe(1)
    expect(store.items[0]?.quantity).toBe(2)
    expect(store.totalItems).toBe(2)
    expect(store.totalPrice).toBe(200)
  })

  it('remove produto do carrinho', () => {
    const store = useCartStore()

    store.addProduct(product)
    expect(store.items.length).toBe(1)

    store.removeProduct(product.id)
    expect(store.items.length).toBe(0)
    expect(store.totalItems).toBe(0)
  })

  it('altera quantidade de um item', () => {
    const store = useCartStore()

    store.addProduct(product)
    store.updateQuantity(product.id, 3)

    expect(store.items[0]?.quantity).toBe(3)
    expect(store.totalItems).toBe(3)
    expect(store.totalPrice).toBe(300)
  })

  it('carrega estado inicial do localStorage', () => {
    const stored = [
      {
        product,
        quantity: 2,
      },
    ]
    window.localStorage.setItem('productexplorer:cart', JSON.stringify(stored))

    const store = useCartStore()

    expect(store.items.length).toBe(1)
    expect(store.items[0]?.quantity).toBe(2)
  })
})
