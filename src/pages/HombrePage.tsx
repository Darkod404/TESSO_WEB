import '../styles/hombre.css'
import { useMemo, useState } from 'react'
import { HombreProductCard } from '../components/hombre/HombreProductCard'
import { useHombreCatalog } from '../hooks/useHombreCatalog'

const FILTERS = ['OVERSIZED', 'BÁSICA', 'NEGRA', 'BLANCA', 'GRAPHIC', 'MINIMAL'] as const

function tagPairFromId(id: string): readonly [(typeof FILTERS)[number], (typeof FILTERS)[number]] {
  let h = 0
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i)
  return [FILTERS[h % FILTERS.length], FILTERS[(h + 2) % FILTERS.length]]
}

function tagLine(id: string) {
  const [a, b] = tagPairFromId(id)
  return `${a} / ${b}`
}

function matchesFilter(id: string, filter: (typeof FILTERS)[number]) {
  const [a, b] = tagPairFromId(id)
  return a === filter || b === filter
}

type SortKey = 'novedades' | 'precio-asc' | 'precio-desc' | 'nombre'

const HERO_IMG =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1800&q=85'

export function HombrePage() {
  const state = useHombreCatalog()
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('OVERSIZED')
  const [sortKey, setSortKey] = useState<SortKey>('novedades')

  const rows = useMemo(() => {
    if (state.status !== 'ok') return []
    const list = state.products.map((p) => ({ p }))
    const filtered = list.filter(({ p }) => matchesFilter(p.id, activeFilter))
    const sorted = [...filtered]
    if (sortKey === 'precio-asc') sorted.sort((a, b) => a.p.price - b.p.price)
    else if (sortKey === 'precio-desc') sorted.sort((a, b) => b.p.price - a.p.price)
    else if (sortKey === 'nombre') sorted.sort((a, b) => a.p.name.localeCompare(b.p.name, 'es'))
    return sorted
  }, [state, activeFilter, sortKey])

  return (
    <>
      <section className="hombre-hero" aria-labelledby="hombre-hero-title">
        <div className="hombre-hero__bg" aria-hidden="true">
          <img src={HERO_IMG} alt="" />
        </div>
        <div className="hombre-hero__shade" aria-hidden="true" />
        <div className="hombre-hero__inner">
          <h1 id="hombre-hero-title">Diseños con actitud</h1>
          <p className="hombre-hero__lead">Camisetas pensadas para destacar sin esfuerzo.</p>
        </div>
      </section>

      <div className="container hombre-toolbar">
        <div className="hombre-filters" role="group" aria-label="Filtros de categoría">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`hombre-filter${activeFilter === f ? ' is-active' : ''}`}
                aria-pressed={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="hombre-sort">
            <span>Ordenar por:</span>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
              <option value="novedades">Novedades</option>
              <option value="precio-asc">Precio · menor a mayor</option>
              <option value="precio-desc">Precio · mayor a menor</option>
              <option value="nombre">Nombre A–Z</option>
            </select>
          </label>
      </div>

      <section className="hombre-products" aria-label="Catálogo hombre">
        <div className="container">
          {state.status === 'loading' ? (
            <p className="hombre-state">Cargando piezas…</p>
          ) : state.status === 'error' ? (
            <p className="hombre-state hombre-state--error">
              No se pudo cargar el catálogo: {state.message}
            </p>
          ) : state.products.length === 0 ? (
            <p className="hombre-state">
              Aún no hay productos en la categoría Hombre. Añade datos en el API o revisa el slug{' '}
              <code>hombre</code>.
            </p>
          ) : rows.length === 0 ? (
            <p className="hombre-empty">
              No hay piezas con la etiqueta <strong>{activeFilter}</strong>. Prueba otro filtro.
            </p>
          ) : (
            <div className="hombre-grid">
              {rows.map(({ p }) => (
                <HombreProductCard key={p.id} product={p} tagLine={tagLine(p.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="hombre-newsletter" aria-labelledby="hombre-news-title">
        <div className="container hombre-newsletter__inner">
          <h2 id="hombre-news-title">Únete a la legión</h2>
          <p>Recibe acceso anticipado a nuestras colecciones cápsula y diseños exclusivos.</p>
          <form
            className="hombre-newsletter__form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <label className="sr-only" htmlFor="hombre-news-email">
              Tu email
            </label>
            <input
              id="hombre-news-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Tu email"
            />
            <button type="submit" className="btn btn-primary">
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
