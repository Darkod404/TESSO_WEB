import type { ProductDto } from './catalog'

export type CartProductSnapshot = Pick<
  ProductDto,
  'id' | 'name' | 'slug' | 'price' | 'currency' | 'imageUrl'
>

export type CartLineItem = {
  product: CartProductSnapshot
  quantity: number
}
