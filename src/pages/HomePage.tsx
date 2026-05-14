import { Link } from 'react-router-dom'
import { useCatalogHome } from '../hooks/useCatalogHome'
import { ProductCard } from '../components/product/ProductCard'

const PILLARS = [
  {
    title: 'Diseños exclusivos de hombre y mujer',
    body: 'Colecciones limitadas creadas por artistas urbanos independientes.',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Personalización total',
    body: 'Sube tu diseño o usa nuestras herramientas para crear algo único.',
    img: 'https://images.unsplash.com/photo-1585386959984-a41552231608?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Órdenes especiales',
    body: 'Soluciones para empresas, eventos y lanzamientos de marcas.',
    img: 'https://images.unsplash.com/photo-1615486511484-92e48cc08101?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Producción rápida',
    body: 'Entregas ágiles sin comprometer un milímetro de calidad.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
  },
] as const

function IconQuality() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 4 7v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconFast() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconExclusive() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 15.4 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconFlexible() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16v10H4V7Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10h16M8 7v10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function HomePage() {
  const state = useCatalogHome()

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="kicker">Viste con confianza</span>
            <h1 className="display-title">Camisetas que representan tu identidad</h1>
            <p className="hero__subtitle">Diseños exclusivos + estampados personalizados</p>
            <p className="lead">
              Creamos camisetas para personas, marcas y eventos que quieren destacar con estilo propio.
            </p>
            <div className="hero__actions">
              <a className="btn btn-primary" href="#destacados">
                Comprar colección
              </a>
              <Link className="btn btn-outline" to="/personaliza">
                Personalizar camiseta
              </Link>
            </div>
          </div>

          <div className="hero__divider" aria-hidden="true" />

          <div className="hero__visual">
            <img
              src="https://images.unsplash.com/photo-1529374255404-421a66b93c76?auto=format&fit=crop&w=1100&q=85"
              alt="Modelo con camiseta negra y estampado"
            />
          </div>
        </div>
      </section>

      <section className="pillars-intro" aria-labelledby="pillars-heading">
        <div className="container">
          <h2 id="pillars-heading">Diseños que hablan por ti</h2>
          <hr className="pillars-intro__rule" />
        </div>
      </section>

      <section className="pillars" aria-label="Servicios">
        <div className="container pillars__grid">
          {PILLARS.map((p) => (
            <article key={p.title} className="pillar-card">
              <div className="pillar-card__media">
                <img src={p.img} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="pillar-card__body">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="identity" id="identidad">
        <div className="container identity__grid">
          <div className="identity__visual">
            <img
              src="https://images.unsplash.com/photo-1441986300917-646646bd8d0c?auto=format&fit=crop&w=1200&q=80"
              alt="Interior de tienda de moda"
              loading="lazy"
              decoding="async"
            />
            <div className="identity__overlay">Conectamos con tu identidad.</div>
          </div>

          <div className="identity__content">
            <h2>No vendemos solo camisetas</h2>
            <div className="identity__intro">
              <div className="identity__accent-bar" aria-hidden="true" />
              <p>
                Creamos piezas que conectan con tu identidad, tu equipo o tu marca. Cada puntada está
                pensada para durar.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-item">
                <IconQuality />
                <div>
                  <h4>Calidad real</h4>
                  <p>Premium Peruvian cloth de alto gramaje para una caída perfecta.</p>
                </div>
              </div>
              <div className="feature-item">
                <IconFast />
                <div>
                  <h4>Fácil y rápido</h4>
                  <p>Plataforma intuitiva para diseñar en minutos.</p>
                </div>
              </div>
              <div className="feature-item">
                <IconExclusive />
                <div>
                  <h4>Diseños exclusivos</h4>
                  <p>Patrones y cortes desarrollados internamente.</p>
                </div>
              </div>
              <div className="feature-item">
                <IconFlexible />
                <div>
                  <h4>Producción flexible</h4>
                  <p>Desde una unidad hasta miles, con el mismo cuidado.</p>
                </div>
              </div>
            </div>

            <div className="identity__cta">
              <a className="btn btn-primary" href="#destacados">
                Comprar ahora <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-band section" id="colecciones">
        <div className="container">
          <h2 className="section-title">Colecciones</h2>
          <p className="section-sub">Datos desde tu API (.NET + SQL Server).</p>

          {state.status === 'error' ? (
            <div className="state state--error">
              No pudimos cargar las colecciones: {state.message}. Arranca el backend y reintenta.
            </div>
          ) : state.status === 'loading' ? (
            <div className="state">Cargando colecciones…</div>
          ) : (
            <div className="categories__grid">
              {state.categories.map((c) => (
                <article key={c.id} className="cat-card">
                  <img
                    src={
                      c.imageUrl ??
                      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=70'
                    }
                    alt={c.name}
                  />
                  <div className="cat-card__body">
                    <h3>{c.name}</h3>
                    <p>{c.description ?? 'Explora piezas seleccionadas para esta línea.'}</p>
                    <div className="cat-meta">
                      <span className="pill">{c.productCount} piezas</span>
                      <span className="muted">/{c.slug}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="destacados" style={{ background: 'var(--color-cream-alt)' }}>
        <div className="container">
          <h2 className="section-title">Destacados</h2>
          <p className="section-sub">Piezas destacadas del catálogo.</p>

          {state.status === 'error' ? (
            <div className="state state--error">
              No pudimos cargar productos: {state.message}. El resto del sitio sigue disponible.
            </div>
          ) : state.status === 'loading' ? (
            <div className="state">Cargando productos…</div>
          ) : (
            <div className="products__grid">
              {state.featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="newsletter">
        <div className="container">
          <div className="newsletter">
            <div>
              <h2 className="section-title" style={{ marginBottom: '0.35rem' }}>
                Lista de novedades
              </h2>
              <p className="lead" style={{ margin: 0 }}>
                Lanzamientos, reposiciones y drops. Sin ruido.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <label className="sr-only" htmlFor="email">
                Correo electrónico
              </label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" />
              <button className="btn btn-primary" type="submit">
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
