import type { ProductDto } from '../../types/catalog'

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(value)
  } catch {
    return `${value} ${currency}`
  }
}

export function ProductCard({ product }: { product: ProductDto }) {
  const image =
    product.imageUrl ??
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=70'

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={image} alt={product.name} loading="lazy" decoding="async" />
        {product.isFeatured ? <span className="tag">Destacado</span> : null}
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <div className="product-card__meta">
          <div className="price">{formatMoney(product.price, product.currency)}</div>
          <div className="muted">{product.categoryName}</div>
        </div>
      </div>
    </article>
  )
}
