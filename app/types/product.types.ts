interface Seo {
  meta_title: string | null
  slug: string | null
  meta_description: string | null
  meta_keywords: string | null
  canonical_url: string | null
}

export interface Category {
  id: number
  name: string
  banner?: string
  slug: string
  icon?: string
  children?: Category[]
}

export interface Brand {
  id: number
  name: string
  en_name?: string
  banner?: string
  slug?: string
}

export interface ProductImage {
  src: string
  alt?: string | null
}


export interface ProductAttributes {
  [key: string]: {
    [key: string]: string
  }[]
}

export interface Product {
  id: number
  name: string
  full_name: string
  summary: string
  price: string
  discount_percentage: number
  final_price: string
  options?: string[]
  qty: number
  category: Category
  brand: Brand
  image?: ProductImage
  length?: string
  width?: string
  height?: string
  weight?: string
  attributes: ProductAttributes
  colors: string[]
  seo: Seo
}