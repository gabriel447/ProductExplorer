import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProducts, getProductById } from '../api'

const hoisted = vi.hoisted(() => ({ getMock: vi.fn() }))

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({ get: hoisted.getMock })),
    },
  }
})

describe('api service', () => {
  beforeEach(() => {
    hoisted.getMock.mockReset()
    ;(import.meta as { env: { VITE_API_URL?: string } }).env.VITE_API_URL = 'https://example.com'
  })

  it('getProducts chama /products e retorna dados', async () => {
    const mockProducts = [{ id: 1 }, { id: 2 }]
    hoisted.getMock.mockResolvedValueOnce({ data: mockProducts })

    const data = await getProducts()

    expect(hoisted.getMock).toHaveBeenCalledWith('/products')
    expect(data).toEqual(mockProducts)
  })

  it('getProducts propaga erro quando requisição falha', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    hoisted.getMock.mockRejectedValueOnce(new Error('falha'))

    await expect(getProducts()).rejects.toThrow('falha')
    consoleErrorSpy.mockRestore()
  })

  it('getProductById chama /products/:id e retorna o item', async () => {
    const mockProduct = { id: 42, title: 'Produto' }
    hoisted.getMock.mockResolvedValueOnce({ data: mockProduct })

    const data = await getProductById('42')

    expect(hoisted.getMock).toHaveBeenCalledWith('/products/42')
    expect(data).toEqual(mockProduct)
  })
})
