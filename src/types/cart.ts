import type { ProductDto, ProductVariantDto } from './catalog'

export type CartProductSnapshot = Pick<
  ProductDto,
  'id' | 'name' | 'slug' | 'price' | 'currency' | 'imageUrl'
> & {
  variantId?: string | null
  sku?: string | null
  sizeCode?: string | null
  colorCode?: string | null
}

export type CartLineItem = {
  product: CartProductSnapshot
  quantity: number
}

export function pickDefaultVariant(product: ProductDto): ProductVariantDto | null {
  const variants = product.variants ?? []
  if (variants.length === 0) return null
  const withStock = variants.filter((v) => v.stock > 0)
  const pool = withStock.length ? withStock : variants
  return pool.find((v) => v.sizeCode === 'M') ?? pool[0] ?? null
}

export function lineKey(productId: string, variantId?: string | null): string {
  return `${productId}::${variantId ?? 'base'}`
}
