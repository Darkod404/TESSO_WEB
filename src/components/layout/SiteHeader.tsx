import { Link, NavLink } from 'react-router-dom'

const NAV = [
  { to: '/hombre', label: 'Hombre' },
  { to: '/mujer', label: 'Mujer' },
  { to: '/ordenes-especiales', label: 'Órdenes especiales' },
  { to: '/personaliza', label: 'Personaliza' },
  { to: '/contacto', label: 'Contacto' },
] as const

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="Inicio T3SO">
          T3SO
        </Link>

        <nav className="nav" aria-label="Principal">
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
            <button type="button" className="header-icon" aria-label="Bolsa (próximamente)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 7h15l-1.5 9h-12L6 7Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <Link to="/personaliza" className="btn btn-primary header-cta">
            Diseña la tuya
          </Link>
        </div>
      </div>
    </header>
  )
}
