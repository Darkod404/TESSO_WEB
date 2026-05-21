import '../styles/personaliza.css'
import { useId, useState } from 'react'

type Corte = 'hombre' | 'mujer'
type Estilo = 'boxy' | 'regular' | 'oversize' | 'crop'
type ColorKey = 'black' | 'white' | 'beige' | 'grey'
type Talla = 'S' | 'M' | 'L' | 'XL'
type Vista = 'front' | 'back'

const SHIRT_BY_COLOR: Record<ColorKey, string> = {
  black:
    'https://images.unsplash.com/photo-1618354691375-d21c733c6143?auto=format&fit=crop&w=900&q=85',
  white:
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85',
  beige:
    'https://images.unsplash.com/photo-1620799140408-ed534d1cb507?auto=format&fit=crop&w=900&q=85',
  grey:
    'https://images.unsplash.com/photo-1622445275573-665b03034e9e?auto=format&fit=crop&w=900&q=85',
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

const BENEFITS = [
  {
    key: 'sost',
    title: 'Sostenibilidad',
    body: 'Tela peruana premium y algodón perchado. Producción bajo demanda para reducir residuos.',
    highlight: false,
    icon: 'plant',
  },
  {
    key: 'dtf',
    title: 'Impresión DTF',
    body: 'Tecnología de impresión directa a prenda para colores vibrantes y duraderos.',
    highlight: true,
    icon: 'brush',
  },
  {
    key: 'env',
    title: 'Envío express',
    body: 'Recibe tu creación personalizada en 2-3 para unidades y para pedidos masivos de 7- 10 días hábiles en tu domicilio.',
    highlight: false,
    icon: 'truck',
  },
] as const

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
  const [activeStep, setActiveStep] = useState(1)
  const [corte, setCorte] = useState<Corte>('hombre')
  const [estilo, setEstilo] = useState<Estilo>('boxy')
  const [color, setColor] = useState<ColorKey>('black')
  const [talla, setTalla] = useState<Talla>('M')
  const [vista, setVista] = useState<Vista>('front')
  const [fileName, setFileName] = useState<string | null>(null)

  const lightShirt = color === 'white' || color === 'beige'

  function goToStep(anchor: string, stepNum: number) {
    setActiveStep(stepNum)
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
              <img
                src={SHIRT_BY_COLOR[color]}
                alt="Vista previa de camiseta"
                className={vista === 'back' ? 'is-back' : undefined}
              />
              <div className={`pz-design-area${lightShirt ? ' is-light' : ''}`}>Área de diseño</div>
            </div>
            <div className="pz-view-toggle">
              <button
                type="button"
                className={vista === 'front' ? 'is-active' : undefined}
                onClick={() => setVista('front')}
              >
                Adelante
              </button>
              <button
                type="button"
                className={vista === 'back' ? 'is-active' : undefined}
                onClick={() => setVista('back')}
              >
                Atrás
              </button>
            </div>
          </div>

          <div className="pz-panel">
            <section id="pz-s1" className="pz-block">
              <h2 className="pz-block__title">
                <span>01.</span> Configuración base
              </h2>
              <p className="pz-sub">Corte</p>
              <div className="pz-corte">
                <button type="button" className={corte === 'hombre' ? 'is-active' : undefined} onClick={() => setCorte('hombre')}>
                  Hombre
                </button>
                <button type="button" className={corte === 'mujer' ? 'is-active' : undefined} onClick={() => setCorte('mujer')}>
                  Mujer
                </button>
              </div>
              <p className="pz-sub" style={{ marginTop: '1rem' }}>
                Estilo
              </p>
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
              <label className="pz-drop" htmlFor={fileId}>
                <input
                  id={fileId}
                  type="file"
                  className="sr-only"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
                <svg width="40" height="32" viewBox="0 0 24 20" fill="none" aria-hidden="true">
                  <path
                    d="M8 17 12 13l4 4M12 13V3M4 15H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="pz-drop__title">{fileName ?? 'Cargar arte gráfico'}</p>
                <p className="pz-drop__hint">PNG o JPG alta calidad (máx. 10MB)</p>
              </label>
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
                  35,00&nbsp;US$
                </p>
                <span className="pz-shipping">Envío gratis</span>
              </div>
              <button type="button" className="btn btn-primary pz-buy">
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
            {BENEFITS.map((b) => (
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
