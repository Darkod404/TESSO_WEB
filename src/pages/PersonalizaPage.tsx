import '../styles/personaliza.css'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrintZonePicker } from '../components/personaliza/PrintZonePicker'
import { ShirtViewer3D } from '../components/personaliza/ShirtViewer3D'
import { DEFAULT_PRINT_ZONE, type PrintZoneId } from '../components/personaliza/printZones'
import type { ZoneDesigns, ZoneRotations } from '../components/personaliza/ShirtModel'
import { DEFAULT_GARMENT, GARMENTS, GARMENT_LIST, type GarmentId } from '../components/personaliza/garments'
import { useCart } from '../context/CartContext'
import { useStoreSettings } from '../context/StoreSettingsContext'
import type { ProductDto } from '../types/catalog'

type Estilo = 'boxy' | 'regular' | 'oversize' | 'crop'
type ColorKey = 'black' | 'white' | 'beige' | 'grey'
type Talla = 'S' | 'M' | 'L' | 'XL'

const SHIRT_HEX: Record<ColorKey, string> = {
  black: '#1a1a1a',
  white: '#f5f5f5',
  beige: '#d4c4b0',
  grey: '#9a9a9a',
}

const COLOR_LABEL: Record<ColorKey, string> = {
  black: 'Negro',
  white: 'Blanco',
  beige: 'Beige',
  grey: 'Gris',
}

const PRICE_COP = 79900

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

const ESTILOS = [
  { id: 'boxy' as const, name: 'Boxy Fit', gr: '250GR' },
  { id: 'regular' as const, name: 'Regular fit', gr: '230-250GR' },
  { id: 'oversize' as const, name: 'Oversize', gr: '250GR' },
  { id: 'crop' as const, name: 'Crop top', gr: '200GR' },
]

const STEPS = [
  { n: 1, code: '01', title: 'Inicio', desc: 'Configuración base', anchor: 'pz-s1' },
  { n: 2, code: '02', title: 'Diseño', desc: 'Ajuste', anchor: 'pz-s2' },
  { n: 3, code: '03', title: 'Gráficos', desc: 'Sube tu diseño', anchor: 'pz-s3' },
  { n: 4, code: '04', title: 'Final', desc: 'Entrega', anchor: 'pz-s4' },
] as const

const BENEFITS_BASE = [
  {
    key: 'sost',
    title: 'Sostenibilidad',
    body: 'Tela peruana premium y algodón perchado. Producción bajo demanda para reducir residuos.',
    highlight: false,
    icon: 'plant' as const,
  },
  {
    key: 'dtf',
    title: 'Impresión DTF',
    body: 'Tecnología de impresión directa a prenda para colores vibrantes y duraderos.',
    highlight: true,
    icon: 'brush' as const,
  },
]

function IconPlant() {
  return (
    <svg className="pz-benefit__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22V12M12 12c-2-4-6-5-8-2 2 1 5 2 8 2 3-4 6-5 8-2-2-3-5-3-8 0-3 1-6 3-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBrush() {
  return (
    <svg className="pz-benefit__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 11 21 3l-4 10-8 8-6 2 2-6 4-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg className="pz-benefit__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 7h12v10H1V7Zm12 4h4l3 3v3h-7M5 21h2m6 0h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-1.5 9h-12L6 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PersonalizaPage() {
  const fileId = useId()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const settings = useStoreSettings()
  const [activeStep, setActiveStep] = useState(1)
  const [garment, setGarment] = useState<GarmentId>(DEFAULT_GARMENT)
  const [estilo, setEstilo] = useState<Estilo>('boxy')
  const supportsFit = GARMENTS[garment].supportsFit
  const [color, setColor] = useState<ColorKey>('black')
  const [talla, setTalla] = useState<Talla>('M')
  const [activeZone, setActiveZone] = useState<PrintZoneId>(DEFAULT_PRINT_ZONE)
  const [zoneDesigns, setZoneDesigns] = useState<ZoneDesigns>({})
  const [zoneRotations, setZoneRotations] = useState<ZoneRotations>({})
  const [zoneFileNames, setZoneFileNames] = useState<Partial<Record<PrintZoneId, string>>>({})
  const zoneDesignsRef = useRef(zoneDesigns)
  zoneDesignsRef.current = zoneDesigns

  const benefits = useMemo(
    () => [
      ...BENEFITS_BASE,
      {
        key: 'env',
        title: 'Producción y envío',
        body: settings.productionLeadTimeText,
        highlight: false,
        icon: 'truck' as const,
      },
    ],
    [settings.productionLeadTimeText],
  )

  const zonesWithDesign = useMemo(
    () => new Set(Object.keys(zoneDesigns) as PrintZoneId[]),
    [zoneDesigns],
  )
  const activeFileName = zoneFileNames[activeZone] ?? null
  const activeHasDesign = Boolean(zoneDesigns[activeZone])
  const activeRotationDeg = Math.round((((zoneRotations[activeZone] ?? 0) * 180) / Math.PI) % 360)

  useEffect(() => {
    return () => {
      Object.values(zoneDesignsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [])

  function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setZoneDesigns((prev) => {
      const previous = prev[activeZone]
      if (previous) URL.revokeObjectURL(previous)
      return { ...prev, [activeZone]: url }
    })
    setZoneFileNames((prev) => ({ ...prev, [activeZone]: file.name }))
    e.target.value = ''
  }

  function removeActiveDesign() {
    setZoneDesigns((prev) => {
      const previous = prev[activeZone]
      if (previous) URL.revokeObjectURL(previous)
      const next = { ...prev }
      delete next[activeZone]
      return next
    })
    setZoneFileNames((prev) => {
      const next = { ...prev }
      delete next[activeZone]
      return next
    })
    setZoneRotations((prev) => {
      const next = { ...prev }
      delete next[activeZone]
      return next
    })
  }

  function rotateActiveDesign(deltaDeg: number) {
    setZoneRotations((prev) => {
      const current = prev[activeZone] ?? 0
      return { ...prev, [activeZone]: current + (deltaDeg * Math.PI) / 180 }
    })
  }

  function setActiveRotationDeg(deg: number) {
    setZoneRotations((prev) => ({ ...prev, [activeZone]: (deg * Math.PI) / 180 }))
  }

  function goToStep(anchor: string, stepNum: number) {
    setActiveStep(stepNum)
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleBuyNow() {
    const garmentLabel = GARMENTS[garment].label
    const zonesCount = Object.keys(zoneDesigns).length
    const detail = [COLOR_LABEL[color], talla, supportsFit ? estilo : null]
      .filter(Boolean)
      .join(' · ')
    const product: ProductDto = {
      id: `custom-${Date.now()}`,
      name: `${garmentLabel} personalizada · ${detail}`,
      slug: 'camiseta-personalizada',
      description: zonesCount > 0 ? `${zonesCount} zona(s) con diseño` : 'Sin diseño',
      price: PRICE_COP,
      currency: settings.currency || 'COP',
      imageUrl: null,
      isFeatured: false,
      stock: 99,
      categoryId: 'custom',
      categoryName: 'Personalizado',
      categorySlug: 'personalizado',
      theme: null,
      styleTag: supportsFit ? estilo : null,
      variants: [],
    }
    addItem(product, 1)
    navigate('/carrito')
  }

  return (
    <>
      <section className="pz-hero" aria-labelledby="pz-hero-title">
        <div className="container">
          <h1 id="pz-hero-title">Diseña tu camiseta</h1>
          <p className="pz-hero__lead">Sube tu diseño y crea algo único en minutos.</p>
          <nav className="pz-steps" aria-label="Pasos del configurador">
            {STEPS.map((s) => (
              <div key={s.n}>
                <button
                  type="button"
                  className={`pz-step${activeStep === s.n ? ' is-active' : ''}`}
                  onClick={() => goToStep(s.anchor, s.n)}
                >
                  <span className="pz-step__num">
                    <span>{s.code}</span> / {s.title}
                  </span>
                  <span className="pz-step__desc">{s.desc}</span>
                </button>
              </div>
            ))}
          </nav>
        </div>
        <div className="pz-divider" />
      </section>

      <div className="pz-main">
        <div className="container pz-main__grid">
          <div className="pz-preview">
            <div className="pz-preview__frame">
              <ShirtViewer3D
                garmentId={garment}
                color={SHIRT_HEX[color]}
                fit={estilo}
                zoneDesigns={zoneDesigns}
                zoneRotations={zoneRotations}
                activeZone={activeZone}
                showZoneGuides
              />
            </div>
          </div>

          <div className="pz-panel">
            <section id="pz-s1" className="pz-block">
              <h2 className="pz-block__title">
                <span>01.</span> Configuración base
              </h2>
              {GARMENT_LIST.length > 1 && (
                <>
                  <p className="pz-sub">Tipo de prenda</p>
                  <div className="pz-corte" style={{ marginBottom: '1rem' }}>
                    {GARMENT_LIST.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        className={garment === g.id ? 'is-active' : undefined}
                        onClick={() => setGarment(g.id as GarmentId)}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {supportsFit && (
                <>
                  <p className="pz-sub">Estilo</p>
                  <div className="pz-estilos">
                    {ESTILOS.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        className={`pz-estilo${estilo === e.id ? ' is-active' : ''}`}
                        onClick={() => setEstilo(e.id)}
                      >
                        <span className="pz-estilo__name">{e.name}</span>
                        <span className="pz-estilo__gr">{e.gr}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section id="pz-s2" className="pz-block">
              <h2 className="pz-block__title">
                <span>02.</span> Ajuste
              </h2>
              <p className="pz-sub">Color</p>
              <div className="pz-colors" role="list">
                {(
                  [
                    ['black', 'Negro'],
                    ['white', 'Blanco'],
                    ['beige', 'Beige'],
                    ['grey', 'Gris'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`pz-swatch pz-swatch--${key}${color === key ? ' is-active' : ''}`}
                    aria-label={label}
                    aria-pressed={color === key}
                    onClick={() => setColor(key)}
                  />
                ))}
              </div>
              <p className="pz-sub" style={{ marginTop: '1.1rem' }}>
                Tallas
              </p>
              <div className="pz-sizes">
                {(['S', 'M', 'L', 'XL'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`pz-size${talla === t ? ' is-active' : ''}`}
                    onClick={() => setTalla(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section id="pz-s3" className="pz-block">
              <h2 className="pz-block__title">
                <span>03.</span> Sube tu diseño
              </h2>
              <PrintZonePicker
                activeZone={activeZone}
                zonesWithDesign={zonesWithDesign}
                onSelect={setActiveZone}
              />
              <input
                id={fileId}
                type="file"
                className="sr-only"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleDesignUpload}
              />
              <label className={`pz-drop${activeHasDesign ? ' has-design' : ''}`} htmlFor={fileId}>
                <svg width="40" height="32" viewBox="0 0 24 20" fill="none" aria-hidden="true">
                  <path
                    d="M8 17 12 13l4 4M12 13V3M4 15H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="pz-drop__title">
                  {activeHasDesign ? activeFileName ?? 'Diseño cargado' : 'Cargar arte gráfico'}
                </p>
                <p className="pz-drop__hint">
                  {activeHasDesign
                    ? 'Haz clic para reemplazar el diseño de esta zona.'
                    : 'PNG o JPG alta calidad (máx. 10MB). Se aplicará a la zona seleccionada.'}
                </p>
              </label>
              {activeHasDesign && (
                <>
                  <div className="pz-rotate">
                    <div className="pz-rotate__head">
                      <span className="pz-sub" style={{ margin: 0 }}>
                        Rotar imagen
                      </span>
                      <span className="pz-rotate__value">{((activeRotationDeg % 360) + 360) % 360}°</span>
                    </div>
                    <div className="pz-rotate__controls">
                      <button type="button" className="pz-rotate__btn" onClick={() => rotateActiveDesign(-15)} aria-label="Girar a la izquierda">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5 4 10l5 5M4 10h9a7 7 0 0 1 7 7v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={359}
                        value={((activeRotationDeg % 360) + 360) % 360}
                        onChange={(e) => setActiveRotationDeg(Number(e.target.value))}
                        className="pz-rotate__slider"
                        aria-label="Ángulo de rotación"
                      />
                      <button type="button" className="pz-rotate__btn" onClick={() => rotateActiveDesign(15)} aria-label="Girar a la derecha">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="m15 5 5 5-5 5M20 10h-9a7 7 0 0 0-7 7v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="pz-design-actions">
                    <label className="pz-design-action" htmlFor={fileId}>
                      Cambiar diseño
                    </label>
                    <button type="button" className="pz-design-action pz-design-action--remove" onClick={removeActiveDesign}>
                      Quitar diseño
                    </button>
                  </div>
                </>
              )}
              <div className="pz-tip">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 10v5M12 7h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span>
                  Usa imágenes con fondo transparente y alta resolución para mejores resultados al imprimir.
                </span>
              </div>
            </section>

            <div id="pz-s4" className="pz-block pz-checkout">
              <div className="pz-price-row">
                <p className="pz-price">
                  <span>Precio final</span>
                  {formatMoney(PRICE_COP, settings.currency || 'COP')}
                </p>
                <span className="pz-shipping">Envío gratis</span>
              </div>
              <button type="button" className="btn btn-primary pz-buy" onClick={handleBuyNow}>
                Comprar ahora <IconBag />
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="pz-benefits" aria-labelledby="pz-benefits-title">
        <div className="container">
          <h2 id="pz-benefits-title" className="sr-only">
            Ventajas T3SO
          </h2>
          <div className="pz-benefits__grid">
            {benefits.map((b) => (
              <article
                key={b.key}
                className={`pz-benefit${b.highlight ? ' pz-benefit--highlight' : ''}`}
              >
                {b.icon === 'plant' ? <IconPlant /> : null}
                {b.icon === 'brush' ? <IconBrush /> : null}
                {b.icon === 'truck' ? <IconTruck /> : null}
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
