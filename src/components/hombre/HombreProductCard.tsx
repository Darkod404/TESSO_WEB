import type { ProductDto } from '../../types/catalog'
import { AddToCartButton } from '../cart/AddToCartButton'

function formatPrice(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(value)
  } catch {
    return `${value} ${currency}`
  }
}

type Props = {
  product: ProductDto
  tagLine: string
}

export function HombreProductCard({ product, tagLine }: Props) {
  const image =
    product.imageUrl ??
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'

  return (
    <article className="hombre-card">
      <div className="hombre-card__media">
        <img src={image} alt={product.name} loading="lazy" decoding="async" />
      </div>
      <div className="hombre-card__body">
        <div className="hombre-card__row">
          <h3 className="hombre-card__title">{product.name}</h3>
          <p className="hombre-card__price">{formatPrice(product.price, product.currency)}</p>
        </div>
        <p className="hombre-card__tags">{tagLine}</p>
        <AddToCartButton product={product} className="btn btn-primary hombre-card__add">
          Añadir al carrito
        </AddToCartButton>
      </div>
    </article>
  )
}
