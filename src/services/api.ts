import axios from 'axios'
import type { Product } from '@/types/Product'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Função para buscar todos os produtos
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/products')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

// Função para buscar um produto único
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`)
  return response.data
}
