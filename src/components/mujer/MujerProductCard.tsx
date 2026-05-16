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
  isNuevo?: boolean
}

export function MujerProductCard({ product, tagLine, isNuevo }: Props) {
  const image =
    product.imageUrl ??
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85'

  return (
    <article className="mujer-card">
      <div className="mujer-card__media">
        <img src={image} alt={product.name} loading="lazy" decoding="async" />
        {isNuevo ? (
          <span className="mujer-card__badge" aria-label="Nuevo">
            Nuevo
          </span>
        ) : null}
      </div>
      <div className="mujer-card__body">
        <h3 className="mujer-card__title">{product.name}</h3>
        <p className="mujer-card__tags">{tagLine}</p>
        <p className="mujer-card__price">{formatPrice(product.price, product.currency)}</p>
        <AddToCartButton product={product} className="btn btn-primary mujer-card__cta">
          Añadir al carrito
        </AddToCartButton>
      </div>
    </article>
  )
}
