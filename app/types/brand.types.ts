import type { Product } from "./product.types"

export interface ProductByBrand {
  id: number
  name: string
  slug: string
  banner?: string
  products?: Product[]
}