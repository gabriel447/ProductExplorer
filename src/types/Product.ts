// Tipos de domínio
// Responsabilidades: definir interfaces de Product e Rating conforme API
export interface Rating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
}
