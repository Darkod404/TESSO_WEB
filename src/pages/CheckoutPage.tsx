import { Link } from 'react-router-dom'
import '../styles/cart.css'

export function CheckoutPage() {
  return (
    <div className="cart-page">
      <div className="container cart-page__inner">
        <h1 className="cart-page__title">Pago</h1>
        <p className="cart-page__empty">La pasarela de pago se integrará próximamente.</p>
        <Link to="/carrito" className="btn btn-outline">
          Volver al carrito
        </Link>
      </div>
    </div>
  )
}
