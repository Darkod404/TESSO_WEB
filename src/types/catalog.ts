export type CategoryDto = {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  productCount: number
}

export type ProductVariantDto = {
  id: string
  sku: string
  sizeCode: string | null
  colorCode: string | null
  styleCode: string | null
  price: number
  stock: number
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
  theme: string | null
  styleTag: string | null
  variants: ProductVariantDto[]
}

export type PagedResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
