import '../styles/mujer.css'
import { useMemo, useState } from 'react'
import { MujerProductCard } from '../components/mujer/MujerProductCard'
import { FilterDropdown } from '../components/filters/FilterDropdown'
import { useMujerCatalog } from '../hooks/useMujerCatalog'

const STYLES = ['Oversize', 'Boxy fit', 'Regular fit', 'Crop'] as const
const THEMES = ['Anime', 'POP', 'Streetwear', 'Minimalista'] as const
const SIZES = ['S', 'M', 'L', 'XL'] as const

type StyleOpt = (typeof STYLES)[number]
type ThemeOpt = (typeof THEMES)[number]
type SizeOpt = (typeof SIZES)[number]

type ProductTags = {
  style: StyleOpt
  theme: ThemeOpt
  sizes: readonly SizeOpt[]
}

function hashCode(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function tagsFromId(id: string): ProductTags {
  const h = hashCode(id)
  const style = STYLES[h % STYLES.length]
  const theme = THEMES[(h >> 3) % THEMES.length]
  const sizeMask = (h >> 5) & 0b1111
  const sizes = SIZES.filter((_, idx) => sizeMask & (1 << idx))
  return { style, theme, sizes: sizes.length ? sizes : (SIZES as readonly SizeOpt[]) }
}

function tagLine(id: string) {
  const t = tagsFromId(id)
  return `${t.style} · ${t.theme}`
}

type SortKey = 'novedades' | 'precio-asc' | 'precio-desc' | 'nombre'

function toggle<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

const HERO_IMG =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf5b?auto=format&fit=crop&w=1200&q=85'

export function MujerPage() {
  const state = useMujerCatalog()
  const [stylesSel, setStylesSel] = useState<ReadonlySet<StyleOpt>>(new Set())
  const [themesSel, setThemesSel] = useState<ReadonlySet<ThemeOpt>>(new Set())
  const [sizesSel, setSizesSel] = useState<ReadonlySet<SizeOpt>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey>('novedades')

  const activeCount = stylesSel.size + themesSel.size + sizesSel.size

  const clearAll = () => {
    setStylesSel(new Set())
    setThemesSel(new Set())
    setSizesSel(new Set())
  }

  const rows = useMemo(() => {
    if (state.status !== 'ok') return []
    const filtered = state.products.filter((p) => {
      const t = tagsFromId(p.id)
      if (stylesSel.size > 0 && !stylesSel.has(t.style)) return false
      if (themesSel.size > 0 && !themesSel.has(t.theme)) return false
      if (sizesSel.size > 0 && !t.sizes.some((s) => sizesSel.has(s))) return false
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
        <div className="mujer-filters-bar">
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

        <div className="mujer-toolbar__actions">
          {activeCount > 0 ? (
            <button type="button" className="mujer-clear" onClick={clearAll}>
              Limpiar filtros
              <span className="mujer-clear__count" aria-hidden="true">
                {activeCount}
              </span>
              <span className="sr-only">{activeCount} filtros activos</span>
            </button>
          ) : null}

          <label className="mujer-sort">
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
              No hay piezas que coincidan con los filtros seleccionados.{' '}
              <button type="button" className="mujer-empty__reset" onClick={clearAll}>
                Limpiar filtros
              </button>
            </p>
          ) : (
            <div className="mujer-grid">
              {rows.map((p) => (
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

    </>
  )
}
