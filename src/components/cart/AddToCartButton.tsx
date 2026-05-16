import type { ReactNode } from 'react'
import type { ProductDto } from '../../types/catalog'
import { useCart } from '../../context/CartContext'

type Props = {
  product: ProductDto
  className?: string
  children?: ReactNode
}

export function AddToCartButton({ product, className, children }: Props) {
  const { addItem } = useCart()
  return (
    <button type="button" className={className} onClick={() => addItem(product, 1)}>
      {children ?? 'Añadir al carrito'}
    </button>
  )
}
