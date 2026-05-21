import { useState } from 'react'
import { Link } from 'react-router-dom'
import heroHomeImg from '../assets/HomePage1.png'
import pillarImgDisenos from '../assets/HomePage2.png'
import pillarImgPersonalizacion from '../assets/HomePage3.png'
import pillarImgOrdenesEspeciales from '../assets/HomePage4.png'
import pillarImgProduccionRapida from '../assets/HomePage5.png'
import { useCatalogHome } from '../hooks/useCatalogHome'
import { ProductCard } from '../components/product/ProductCard'

const PILLARS = [
  {
    title: 'Diseños exclusivos de hombre y mujer',
    body: 'Piezas auténticas para quienes buscan destacar.',
    img: pillarImgDisenos,
  },
  {
    title: 'Personalización total',
    body: 'Sube tu diseño o usa nuestras herramientas para crear algo único.',
    img: pillarImgPersonalizacion,
  },
  {
    title: 'Órdenes especiales',
    body: 'Soluciones para empresas, eventos y lanzamientos de marcas.',
    img: pillarImgOrdenesEspeciales,
  },
  {
    title: 'Producción rápida',
    body: 'Entregas ágiles sin comprometer un milímetro de calidad.',
    img: pillarImgProduccionRapida,
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

const FAQS = [
  {
    q: '¿Cuál es el tiempo de entrega?',
    a: 'Para diseños de colección, entregamos en 2-3 días hábiles en la ciudad de Bogotá. Para pedidos personalizados, el tiempo oscila entre 7 y 10 días dependiendo de la complejidad, ciudad y volumen.',
  },
  {
    q: '¿Tienen pedido mínimo para personalizados?',
    a: 'No. Creemos en la identidad individual. Puedes pedir desde una sola camiseta personalizada con la misma calidad que un pedido masivo.',
  },
  {
    q: '¿Qué tipo de telas utilizan?',
    a: 'Utilizamos tela peruana premium, algodón perchado 100% premium de 250 gr para nuestras líneas de colección. Para pedidos masivos usamos algodón perchado entre 150 y 180 gr (depende de cada personalización), garantizando durabilidad y confort superior.',
  },
  {
    q: '¿Hacen envíos internacionales?',
    a: 'Actualmente realizamos envíos a todo el territorio nacional. Estamos trabajando para habilitar envíos internacionales próximamente.',
  },
] as const

export function HomePage() {
  const state = useCatalogHome()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
            <img src={heroHomeImg} alt="Modelo con camiseta negra y estampado" />
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
                Creamos piezas que conectan con tu identidad, tu equipo o tu marca. Cada camiseta está pensada para durar.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-item">
                <IconQuality />
                <div>
                  <h4>Calidad real</h4>
                  <p>Tela peruana premium, algodón perchado de alto gramaje para una caída perfecta.</p>
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
                  <p>Patrones y estampados creados internamente con identidad única.</p>
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

      <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="container faq">
          <header className="faq__header">
            <h2 id="faq-heading" className="section-title">
              Preguntas frecuentes
            </h2>
            <p className="section-sub">Todo lo que necesitas saber sobre T3SO.</p>
          </header>

          <ul className="faq__list">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index
              const panelId = `faq-panel-${index}`
              const buttonId = `faq-button-${index}`
              return (
                <li key={item.q} className={`faq__item${isOpen ? ' is-open' : ''}`}>
                  <h3 className="faq__heading">
                    <button
                      type="button"
                      id={buttonId}
                      className="faq__summary"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq((current) => (current === index ? null : index))}
                    >
                      <span className="faq__question">{item.q}</span>
                      <span className="faq__icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="faq__answer"
                    hidden={!isOpen}
                  >
                    <p>{item.a}</p>
                  </div>
                </li>
              )
            })}
          </ul>
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
