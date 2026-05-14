export type CategoryDto = {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  productCount: number
}

export type ProductDto = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  imageUrl: string | null
  isFeatured: boolean
  stock: number
  categoryId: string
  categoryName: string
  categorySlug: string
}

export type PagedResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
