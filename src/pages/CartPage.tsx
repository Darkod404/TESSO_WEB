import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { DeliveryMap, geocodeAddress, type LatLng } from '../components/cart/DeliveryMap'
import { AddressBuilder } from '../components/cart/AddressBuilder'
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_ZONES,
  getCities,
  resolveShippingCost,
} from '../data/shippingZones'
import '../styles/cart.css'

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

function fallbackImg() {
  return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=70'
}

const BOGOTA: LatLng = { lat: 4.711, lng: -74.0721 }

const STEPS = [
  { id: 'carro', label: 'Carro' },
  { id: 'entrega', label: 'Entrega' },
  { id: 'pago', label: 'Pago' },
] as const

export function CartPage() {
  const { resolvedItems, setQuantity, removeItem, subtotal, currency } = useCart()

  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [complement, setComplement] = useState('')
  const [mapPos, setMapPos] = useState<LatLng>(BOGOTA)
  const [mapZoom, setMapZoom] = useState(12)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [geoNote, setGeoNote] = useState<string | null>(null)
  const requestRef = useRef(0)

  const cities = useMemo(() => getCities(department), [department])
  const shippingInfo = useMemo(
    () => resolveShippingCost(department || null, city || null, subtotal),
    [department, city, subtotal],
  )
  const total = subtotal + shippingInfo.cost
  const cur = currency || 'COP'

  // Búsqueda automática en el mapa al cambiar departamento, ciudad o dirección (con debounce).
  useEffect(() => {
    if (!department || !city) return
    const handle = setTimeout(async () => {
      const id = ++requestRef.current
      setLocating(true)
      setGeoError(null)
      const result = await geocodeAddress({ street: address.trim(), city, state: department })
      if (id !== requestRef.current) return // descarta resultados obsoletos
      setLocating(false)
      if (!result) {
        setGeoNote(null)
        setGeoError('No encontramos la dirección. Ajusta la ubicación moviendo el pin rojo.')
        return
      }
      setMapPos(result.position)
      if (result.precision === 'address') {
        setMapZoom(17)
        setGeoNote(null)
      } else if (result.precision === 'street') {
        setMapZoom(16)
        setGeoNote('Ubicamos la calle. Arrastra el pin para marcar el número exacto.')
      } else {
        setMapZoom(14)
        setGeoNote(
          address.trim()
            ? 'No encontramos el número exacto; centramos en la ciudad. Arrastra el pin a tu ubicación.'
            : 'Centramos en la ciudad. Escribe tu dirección o arrastra el pin.',
        )
      }
    }, 800)
    return () => clearTimeout(handle)
  }, [department, city, address])

  if (resolvedItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-page__inner">
          <h1 className="cart-page__title">Carrito</h1>
          <p className="cart-page__empty">Tu carrito está vacío.</p>
          <Link to="/personaliza" className="btn btn-outline">
            Diseña tu camiseta
          </Link>
        </div>
      </div>
    )
  }

  const canContinue = Boolean(department && city)

  return (
    <div className="cart-page">
      <div className="container">
        <nav className="cart-steps" aria-label="Pasos de compra">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`cart-step${i === 0 ? ' is-active' : ''}`}>
              <span className="cart-step__dot">{i + 1}</span>
              <span className="cart-step__label">{s.label}</span>
            </div>
          ))}
        </nav>

        <div className="cart-page__grid">
          <div className="cart-main">
            <section className="cart-panel" aria-labelledby="cart-list-heading">
              <h1 id="cart-list-heading" className="cart-panel__title">
                Carro de compras <span className="cart-panel__count">{resolvedItems.length}</span>
              </h1>
              <ul className="cart-lines">
                {resolvedItems.map(({ product, quantity }) => (
                  <li key={product.id} className="cart-line">
                    <div className="cart-line__media">
                      <img src={product.imageUrl ?? fallbackImg()} alt="" width={88} height={110} loading="lazy" />
                    </div>
                    <div className="cart-line__info">
                      <h3 className="cart-line__name">{product.name}</h3>
                      <p className="cart-line__unit">{formatMoney(product.price, product.currency)} c/u</p>
                      <div className="cart-line__actions">
                        <div className="cart-qty">
                          <button
                            type="button"
                            className="cart-qty__btn"
                            aria-label="Disminuir"
                            onClick={() => setQuantity(product.id, quantity - 1)}
                          >
                            −
                          </button>
                          <input
                            className="cart-qty__input"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={quantity}
                            onChange={(e) => {
                              const v = Number(e.target.value)
                              if (!Number.isNaN(v)) setQuantity(product.id, v)
                            }}
                          />
                          <button
                            type="button"
                            className="cart-qty__btn"
                            aria-label="Aumentar"
                            onClick={() => setQuantity(product.id, quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button type="button" className="cart-line__remove" onClick={() => removeItem(product.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <p className="cart-line__subtotal">
                      {formatMoney(product.price * quantity, product.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cart-delivery" aria-labelledby="cart-delivery-heading">
              <h2 id="cart-delivery-heading" className="cart-delivery__title">
                Zona de envío
              </h2>
              <p className="cart-delivery__lead">
                Los precios y la disponibilidad pueden variar según tu ubicación.
              </p>
              <div className="cart-delivery__grid">
                <label className="cart-field">
                  <span className="cart-field__label">Departamento</span>
                  <select
                    className="cart-field__control"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value)
                      setCity('')
                    }}
                  >
                    <option value="">Selecciona…</option>
                    {SHIPPING_ZONES.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="cart-field">
                  <span className="cart-field__label">Ciudad</span>
                  <select
                    className="cart-field__control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!department}
                  >
                    <option value="">{department ? 'Selecciona…' : 'Elige departamento'}</option>
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="cart-field cart-field--wide">
                  <span className="cart-field__label">Dirección</span>
                  <AddressBuilder onChange={setAddress} />
                </div>
                <label className="cart-field cart-field--wide">
                  <span className="cart-field__label">Complemento (opcional)</span>
                  <input
                    className="cart-field__control"
                    type="text"
                    placeholder="Casa 1 piso, apto, referencia…"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </label>
              </div>
              {locating && (
                <p className="cart-delivery__status" role="status">
                  <span className="cart-delivery__spinner" aria-hidden="true" />
                  Buscando ubicación en el mapa…
                </p>
              )}
              {!locating && geoError && <p className="cart-delivery__warn">{geoError}</p>}
              {!locating && !geoError && geoNote && <p className="cart-delivery__note">{geoNote}</p>}
              <DeliveryMap
                position={mapPos}
                zoom={mapZoom}
                onChange={(pos) => {
                  setMapPos(pos)
                  setGeoError(null)
                  setGeoNote(null)
                }}
              />
            </section>
          </div>

          <aside className="cart-invoice" aria-labelledby="cart-invoice-heading">
            <h2 id="cart-invoice-heading" className="cart-invoice__title">
              Resumen de tu compra
            </h2>
            <div className="cart-invoice__paper">
              <dl className="cart-invoice__rows">
                <div className="cart-invoice__row">
                  <dt>Subtotal</dt>
                  <dd>{formatMoney(subtotal, cur)}</dd>
                </div>
                <div className="cart-invoice__row">
                  <dt>Envío</dt>
                  <dd>
                    {!canContinue ? (
                      <span className="cart-invoice__muted">Selecciona tu zona</span>
                    ) : shippingInfo.isFree ? (
                      <span className="cart-invoice__free">Gratis</span>
                    ) : (
                      formatMoney(shippingInfo.cost, cur)
                    )}
                  </dd>
                </div>
                {canContinue && (
                  <div className="cart-invoice__row cart-invoice__row--eta">
                    <dt>Entrega estimada</dt>
                    <dd>{shippingInfo.etaDays} días hábiles</dd>
                  </div>
                )}
              </dl>
              <div className="cart-invoice__divider" />
              <div className="cart-invoice__total-row">
                <span className="cart-invoice__total-label">Total a pagar</span>
                <span className="cart-invoice__total-value">{formatMoney(total, cur)}</span>
              </div>
              {!shippingInfo.isFree && (
                <p className="cart-invoice__hint">
                  Envío gratis en compras desde {formatMoney(FREE_SHIPPING_THRESHOLD, cur)}.
                </p>
              )}
            </div>
            <div className="cart-invoice__cta">
              <Link
                to="/checkout"
                className={`btn btn-primary cart-checkout-btn${canContinue ? '' : ' is-disabled'}`}
                aria-disabled={!canContinue}
                onClick={(e) => {
                  if (!canContinue) e.preventDefault()
                }}
              >
                Continuar
              </Link>
              {!canContinue && (
                <p className="cart-invoice__hint">Selecciona departamento y ciudad para continuar.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
