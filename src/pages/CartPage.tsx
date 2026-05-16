import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/cart.css'

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

function fallbackImg() {
  return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=70'
}

export function CartPage() {
  const { resolvedItems, setQuantity, removeItem, subtotal, shipping, total, currency } = useCart()

  const checkoutBtn = (
    <Link to="/checkout" className="btn btn-primary cart-checkout-btn">
      Continuar con el pago
    </Link>
  )

  if (resolvedItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-page__inner">
          <h1 className="cart-page__title">Carrito</h1>
          <p className="cart-page__empty">Tu carrito está vacío.</p>
          <Link to="/hombre" className="btn btn-outline">
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container cart-page__grid">
        <section className="cart-panel" aria-labelledby="cart-list-heading">
          <h1 id="cart-list-heading" className="cart-panel__title">
            Tu carrito
          </h1>
          <ul className="cart-lines">
            {resolvedItems.map(({ product, quantity }) => (
              <li key={product.id} className="cart-line">
                <div className="cart-line__media">
                  <img
                    src={product.imageUrl ?? fallbackImg()}
                    alt=""
                    width={88}
                    height={110}
                    loading="lazy"
                  />
                </div>
                <div className="cart-line__info">
                  <h3 className="cart-line__name">{product.name}</h3>
                  <p className="cart-line__unit">
                    {formatMoney(product.price, product.currency)} c/u
                  </p>
                  <div className="cart-line__actions">
                    <label className="cart-line__qty-label">
                      <span className="sr-only">Cantidad</span>
                      <input
                        className="cart-line__qty-input"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          if (!Number.isNaN(v)) setQuantity(product.id, v)
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="cart-line__remove"
                      onClick={() => removeItem(product.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <p className="cart-line__subtotal">
                  {formatMoney(product.price * quantity, product.currency)}
                </p>
              </li>
            ))}
          </ul>
          <div className="cart-panel__footer">{checkoutBtn}</div>
        </section>

        <aside className="cart-invoice" aria-labelledby="cart-invoice-heading">
          <h2 id="cart-invoice-heading" className="cart-invoice__title">
            Resumen
          </h2>
          <div className="cart-invoice__paper">
            <dl className="cart-invoice__rows">
              <div className="cart-invoice__row">
                <dt>Subtotal</dt>
                <dd>{formatMoney(subtotal, currency)}</dd>
              </div>
              <div className="cart-invoice__row">
                <dt>Envío</dt>
                <dd>
                  {shipping === 0 ? (
                    <span className="cart-invoice__free">Sin costo</span>
                  ) : (
                    formatMoney(shipping, currency)
                  )}
                </dd>
              </div>
            </dl>
            <div className="cart-invoice__divider" />
            <div className="cart-invoice__total-row">
              <span className="cart-invoice__total-label">Total</span>
              <span className="cart-invoice__total-value">{formatMoney(total, currency)}</span>
            </div>
            {shipping > 0 && subtotal < 1500 ? (
              <p className="cart-invoice__hint">
                Envío gratis en compras desde {formatMoney(1500, currency)}.
              </p>
            ) : null}
          </div>
          <div className="cart-invoice__cta">{checkoutBtn}</div>
        </aside>
      </div>
    </div>
  )
}
