import '../styles/hombre.css'
import { useEffect, useMemo, useState } from 'react'
import { HombreProductCard } from '../components/hombre/HombreProductCard'
import { FilterDropdown } from '../components/filters/FilterDropdown'
import { useHombreCatalog } from '../hooks/useHombreCatalog'
import { contentApi } from '../services/contentApi'
import type { ProductDto } from '../types/catalog'

const STYLES = ['Oversize', 'Boxy fit', 'Regular fit'] as const
const THEMES = ['Anime', 'POP', 'Streetwear', 'Minimalista', 'Básico'] as const
const SIZES = ['S', 'M', 'L', 'XL'] as const

type StyleOpt = (typeof STYLES)[number]
type ThemeOpt = (typeof THEMES)[number]
type SizeOpt = (typeof SIZES)[number]

function productSizes(p: ProductDto): SizeOpt[] {
  const fromVariants = (p.variants ?? [])
    .map((v) => v.sizeCode)
    .filter((s): s is SizeOpt => !!s && (SIZES as readonly string[]).includes(s))
  return fromVariants.length ? [...new Set(fromVariants)] : [...SIZES]
}

function tagLine(p: ProductDto) {
  return [p.styleTag, p.theme].filter(Boolean).join(' · ') || 'Colección'
}

type SortKey = 'novedades' | 'precio-asc' | 'precio-desc' | 'nombre'

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1800&q=85'

function toggle<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export function HombrePage() {
  const state = useHombreCatalog()
  const [heroImg, setHeroImg] = useState(HERO_FALLBACK)
  const [stylesSel, setStylesSel] = useState<ReadonlySet<StyleOpt>>(new Set())
  const [themesSel, setThemesSel] = useState<ReadonlySet<ThemeOpt>>(new Set())
  const [sizesSel, setSizesSel] = useState<ReadonlySet<SizeOpt>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey>('novedades')

  useEffect(() => {
    contentApi
      .media()
      .then((slots) => {
        const url = slots['hombre.hero']?.url
        if (url) setHeroImg(url)
      })
      .catch(() => {
        /* keep fallback */
      })
  }, [])

  const activeCount = stylesSel.size + themesSel.size + sizesSel.size

  const clearAll = () => {
    setStylesSel(new Set())
    setThemesSel(new Set())
    setSizesSel(new Set())
  }

  const rows = useMemo(() => {
    if (state.status !== 'ok') return []
    const filtered = state.products.filter((p) => {
      if (stylesSel.size > 0 && (!p.styleTag || !stylesSel.has(p.styleTag as StyleOpt))) return false
      if (themesSel.size > 0 && (!p.theme || !themesSel.has(p.theme as ThemeOpt))) return false
      if (sizesSel.size > 0 && !productSizes(p).some((s) => sizesSel.has(s))) return false
      return true
    })
    const sorted = [...filtered]
    if (sortKey === 'precio-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sortKey === 'precio-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sortKey === 'nombre') sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    return sorted
  }, [state, stylesSel, themesSel, sizesSel, sortKey])

  return (
    <>
      <section className="hombre-hero" aria-labelledby="hombre-hero-title">
        <div className="hombre-hero__bg" aria-hidden="true">
          <img src={heroImg} alt="" />
        </div>
        <div className="hombre-hero__shade" aria-hidden="true" />
        <div className="hombre-hero__inner">
          <h1 id="hombre-hero-title">Diseños con actitud</h1>
          <p className="hombre-hero__lead">Camisetas pensadas para destacar sin esfuerzo.</p>
        </div>
      </section>

      <div className="container hombre-toolbar">
        <div className="hombre-filters-bar">
          <FilterDropdown
            label="Estilo"
            options={STYLES}
            selected={stylesSel}
            onToggle={(v) => setStylesSel((prev) => toggle(prev, v))}
            onClear={() => setStylesSel(new Set())}
          />
          <FilterDropdown
            label="Tema"
            options={THEMES}
            selected={themesSel}
            onToggle={(v) => setThemesSel((prev) => toggle(prev, v))}
            onClear={() => setThemesSel(new Set())}
          />
          <FilterDropdown
            label="Talla"
            options={SIZES}
            selected={sizesSel}
            onToggle={(v) => setSizesSel((prev) => toggle(prev, v))}
            onClear={() => setSizesSel(new Set())}
            variant="compact"
          />
        </div>

        <div className="hombre-toolbar__actions">
          {activeCount > 0 ? (
            <button type="button" className="hombre-clear" onClick={clearAll}>
              Limpiar filtros
              <span className="hombre-clear__count" aria-hidden="true">
                {activeCount}
              </span>
              <span className="sr-only">{activeCount} filtros activos</span>
            </button>
          ) : null}

          <label className="hombre-sort">
            <span>Ordenar por</span>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
              <option value="novedades">Novedades</option>
              <option value="precio-asc">Precio · menor a mayor</option>
              <option value="precio-desc">Precio · mayor a menor</option>
              <option value="nombre">Nombre A–Z</option>
            </select>
          </label>
        </div>
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
              No hay piezas que coincidan con los filtros seleccionados.{' '}
              <button type="button" className="hombre-empty__reset" onClick={clearAll}>
                Limpiar filtros
              </button>
            </p>
          ) : (
            <div className="hombre-grid">
              {rows.map((p) => (
                <HombreProductCard key={p.id} product={p} tagLine={tagLine(p)} />
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
