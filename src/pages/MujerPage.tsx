import '../styles/mujer.css'
import { useMemo, useState } from 'react'
import { MujerProductCard } from '../components/mujer/MujerProductCard'
import { useMujerCatalog } from '../hooks/useMujerCatalog'

const FILTER_OPTIONS = [
  { key: 'OVERSIZED', label: 'Oversized' },
  { key: 'CROP', label: 'Crop' },
  { key: 'BASICA', label: 'Básica' },
  { key: 'MINIMAL', label: 'Minimal' },
  { key: 'URBAN', label: 'Urban' },
  { key: 'VINTAGE', label: 'Vintage' },
] as const

const TAG_POOL = ['OVERSIZED', 'CROP', 'BASICA', 'MINIMAL', 'URBAN', 'VINTAGE'] as const

function hashId(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i)
  return h
}

function tagPairFromId(id: string): readonly [(typeof TAG_POOL)[number], (typeof TAG_POOL)[number]] {
  const h = hashId(id)
  return [TAG_POOL[h % TAG_POOL.length], TAG_POOL[(h + 2) % TAG_POOL.length]]
}

function tagLine(id: string) {
  const [a, b] = tagPairFromId(id)
  return `${a} / ${b}`
}

function matchesFilter(id: string, filterKey: (typeof FILTER_OPTIONS)[number]['key']) {
  const [a, b] = tagPairFromId(id)
  return a === filterKey || b === filterKey
}

const HERO_IMG =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf5b?auto=format&fit=crop&w=1200&q=85'

const FABRIC_IMG =
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=85'

export function MujerPage() {
  const state = useMujerCatalog()
  const [activeKey, setActiveKey] = useState<(typeof FILTER_OPTIONS)[number]['key']>('OVERSIZED')

  const rows = useMemo(() => {
    if (state.status !== 'ok') return []
    const list = state.products.map((p) => ({ p }))
    return list.filter(({ p }) => matchesFilter(p.id, activeKey))
  }, [state, activeKey])

  return (
    <>
      <section className="mujer-hero" aria-labelledby="mujer-hero-title">
        <div className="container mujer-hero__grid">
          <div className="mujer-hero__copy">
            <h1 id="mujer-hero-title">Tu estilo, tu identidad</h1>
            <p>
              Diseños exclusivos para expresar quién eres. Cada prenda es un lienzo para tu propia
              narrativa urbana.
            </p>
          </div>
          <div className="mujer-hero__visual">
            <img src={HERO_IMG} alt="" />
          </div>
        </div>
      </section>

      <div className="container mujer-toolbar">
        <span className="mujer-toolbar__label">Filtrar por:</span>
        <div className="mujer-filters" role="group" aria-label="Filtros">
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`mujer-filter${activeKey === key ? ' is-active' : ''}`}
              aria-pressed={activeKey === key}
              onClick={() => setActiveKey(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="mujer-products" aria-label="Catálogo mujer">
        <div className="container">
          {state.status === 'loading' ? (
            <p className="mujer-state">Cargando piezas…</p>
          ) : state.status === 'error' ? (
            <p className="mujer-state mujer-state--error">
              No se pudo cargar el catálogo: {state.message}
            </p>
          ) : state.products.length === 0 ? (
            <p className="mujer-state">
              Aún no hay productos en la categoría Mujer. Revisa el slug <code>mujer</code> en el API.
            </p>
          ) : rows.length === 0 ? (
            <p className="mujer-empty">
              No hay piezas para <strong>{FILTER_OPTIONS.find((f) => f.key === activeKey)?.label}</strong>.
              Prueba otro filtro.
            </p>
          ) : (
            <div className="mujer-grid">
              {rows.map(({ p }) => (
                <MujerProductCard
                  key={p.id}
                  product={p}
                  tagLine={tagLine(p.id)}
                  isNuevo={p.isFeatured}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container mujer-triple-cta">
        <a className="btn btn-primary mujer-cta-bar" href="#identidad">
          Comprar ahora
        </a>
        <a className="btn btn-primary mujer-cta-bar" href="#identidad">
          Comprar ahora
        </a>
        <a className="btn btn-primary mujer-cta-bar" href="#identidad">
          Comprar ahora
        </a>
      </div>

      <section className="mujer-soon" id="identidad" aria-labelledby="mujer-soon-title">
        <div className="container">
          <div className="mujer-soon__card">
            <div className="mujer-soon__copy">
              <p className="mujer-soon__kicker">Próximamente</p>
              <h2 id="mujer-soon-title">Personaliza tu visión.</h2>
              <p>
                Crea una pieza única que hable por ti. Nuestra herramienta de personalización estará
                disponible pronto para la colección Mujer.
              </p>
              <button type="button" className="mujer-soon__notify">
                Notificarme
              </button>
            </div>
            <div className="mujer-soon__visual">
              <img src={FABRIC_IMG} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
