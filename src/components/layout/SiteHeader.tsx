import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { SiteBrand } from './SiteBrand'

const NAV = [
  { to: '/hombre', label: 'Hombre' },
  { to: '/mujer', label: 'Mujer' },
  { to: '/ordenes-especiales', label: 'Órdenes especiales' },
  { to: '/personaliza', label: 'Personaliza' },
] as const

const MOBILE_NAV_ID = 'site-nav-mobile'

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconCloseMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const { totalQuantity } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const cartLabel =
    totalQuantity > 0
      ? `Carrito de compras, ${totalQuantity} ${totalQuantity === 1 ? 'artículo' : 'artículos'}`
      : 'Carrito de compras'
  const badgeText = totalQuantity > 99 ? '99+' : String(totalQuantity)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <SiteBrand />

        <nav className="nav nav--desktop" aria-label="Principal">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__right">
          <button
            type="button"
            className="header-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={MOBILE_NAV_ID}
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <IconCloseMenu /> : <IconMenu />}
          </button>

          <div className="header-actions">
            <button type="button" className="header-icon" aria-label="Buscar (próximamente)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path d="M16.2 16.2 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <span className="header-cart-wrap">
              <Link to="/carrito" className="header-icon" aria-label={cartLabel}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 7h15l-1.5 9h-12L6 7Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Link>
              {totalQuantity > 0 ? (
                <span className="header-cart-badge" aria-hidden="true">
                  {badgeText}
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`site-nav-backdrop ${menuOpen ? 'is-visible' : ''}`}
        aria-label="Cerrar menú"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />

      <div
        id={MOBILE_NAV_ID}
        className={`site-nav-mobile ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        aria-hidden={!menuOpen}
      >
        <nav className="site-nav-mobile__inner" aria-label="Principal">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'site-nav-mobile__link is-active' : 'site-nav-mobile__link'
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
