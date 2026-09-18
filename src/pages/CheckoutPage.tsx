import { FormEvent, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { orderApi } from '../services/orderApi'
import { paymentApi } from '../services/paymentApi'
import '../styles/cart.css'

type CheckoutNavState = {
  department?: string
  city?: string
  address?: string
  complement?: string
  mapPos?: { lat: number; lng: number }
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${value.toFixed(0)} ${currency}`
  }
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const nav = (location.state as CheckoutNavState | null) ?? {}
  const { resolvedItems, clear, currency } = useCart()
  const { user, isAuthenticated, login, register } = useAuth()

  const [mode, setMode] = useState<'guest' | 'account'>(isAuthenticated ? 'account' : 'guest')
  const [contactName, setContactName] = useState(user?.fullName ?? '')
  const [contactEmail, setContactEmail] = useState(user?.email ?? '')
  const [contactPhone, setContactPhone] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ orderNumber: string; paymentRef: string } | null>(null)

  const shipDepartment = nav.department ?? ''
  const shipCity = nav.city ?? ''
  const shipStreet = nav.address ?? ''
  const shipComplement = nav.complement ?? ''

  const subtotal = useMemo(
    () => resolvedItems.reduce((s, l) => s + l.product.price * l.quantity, 0),
    [resolvedItems],
  )
  const cur = currency || 'COP'

  if (resolvedItems.length === 0 && !result) {
    return (
      <div className="cart-page">
        <div className="container cart-page__inner">
          <h1 className="cart-page__title">Pago</h1>
          <p className="cart-page__empty">No hay productos en el carrito.</p>
          <Link to="/carrito" className="btn btn-outline">
            Volver al carrito
          </Link>
        </div>
      </div>
    )
  }

  if (!shipDepartment || !shipCity) {
    return (
      <div className="cart-page">
        <div className="container cart-page__inner">
          <h1 className="cart-page__title">Pago</h1>
          <p className="cart-page__empty">Falta la zona de envío. Completa el carrito primero.</p>
          <Link to="/carrito" className="btn btn-outline">
            Volver al carrito
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'account' && !isAuthenticated) {
        if (password.length >= 8) {
          try {
            await login(contactEmail, password)
          } catch {
            await register({
              email: contactEmail,
              password,
              fullName: contactName,
              phone: contactPhone,
            })
          }
        } else {
          throw new Error('La contraseña debe tener al menos 8 caracteres')
        }
      }

      const order = await orderApi.create({
        contactName,
        contactEmail,
        contactPhone,
        shipDepartment,
        shipCity,
        shipStreet: shipStreet || 'Por confirmar',
        shipComplement: shipComplement || undefined,
        shipLat: nav.mapPos?.lat,
        shipLng: nav.mapPos?.lng,
        items: resolvedItems.map((l) => ({
          productId: l.product.id,
          variantId: l.product.variantId ?? undefined,
          quantity: l.quantity,
        })),
      })

      const intent = await paymentApi.createIntent(order.id)
      setResult({ orderNumber: order.orderNumber, paymentRef: intent.reference })
      clear()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el pedido')
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return (
      <div className="cart-page">
        <div className="container cart-page__inner">
          <h1 className="cart-page__title">Pedido creado</h1>
          <p className="cart-page__empty">
            Número <strong>{result.orderNumber}</strong>. Referencia de pago:{' '}
            <strong>{result.paymentRef}</strong>.
          </p>
          <p className="cart-page__empty">
            Wompi Widget (sandbox) se conectará con las llaves del `.env`. Mientras tanto el pedido queda en{' '}
            <code>PENDING_PAYMENT</code>.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container cart-page__inner">
        <h1 className="cart-page__title">Checkout</h1>
        <p className="cart-page__empty">
          Envío a {shipCity}, {shipDepartment}. Subtotal {formatMoney(subtotal, cur)}.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={`btn ${mode === 'guest' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('guest')}
          >
            Comprar como invitado
          </button>
          <button
            type="button"
            className={`btn ${mode === 'account' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('account')}
          >
            {isAuthenticated ? 'Cuenta' : 'Cuenta / registro'}
          </button>
        </div>

        <form onSubmit={onSubmit} className="cart-panel" style={{ maxWidth: 520 }}>
          <label>
            Nombre
            <input
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Teléfono
            <input
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              autoComplete="tel"
            />
          </label>
          {mode === 'account' && !isAuthenticated && (
            <label>
              Contraseña (login o registro)
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </label>
          )}

          {error && <p className="cart-page__empty">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Procesando…' : 'Crear pedido y preparar pago'}
          </button>
          <Link to="/carrito" className="btn btn-outline">
            Volver al carrito
          </Link>
        </form>
      </div>
    </div>
  )
}
