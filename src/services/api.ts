// Serviço de API (Axios)
// Responsabilidades: consumir Fake Store API e expor funções de produtos
import axios from 'axios'
import type { Product } from '@/types/Product'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
})

const ensureConfigured = () => {
  if (import.meta.env.MODE === 'test') return
  const baseURL = (api as { defaults?: { baseURL?: string } }).defaults?.baseURL
  if (!baseURL) {
    const error = new Error('API não está configurada (VITE_API_URL ausente).')
    console.error(error)
    throw error
  }
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    ensureConfigured()
    const response = await api.get<Product[]>('/products')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

export const getProductById = async (id: string): Promise<Product> => {
  ensureConfigured()
  const response = await api.get<Product>(`/products/${id}`)
  return response.data
}
