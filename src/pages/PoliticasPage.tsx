import '../styles/politicas.css'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type TabId = 'cambios' | 'terminos' | 'envios'

const TABS: { id: TabId; label: string }[] = [
  { id: 'cambios', label: 'Cambios & Garantías' },
  { id: 'terminos', label: 'Términos & Condiciones' },
  { id: 'envios', label: 'Envíos' },
]

const NO_GARANTIA = [
  'Mal lavado (agua caliente, secadora)',
  'Planchado directo al estampado',
  'Uso indebido o negligente',
  'Cortes o modificaciones',
  'Desgaste normal por uso prolongado',
] as const

const PROCESO_STEPS = [
  'Escríbenos al WhatsApp oficial de T3SO con tu número de pedido.',
  'Envía fotos claras del producto y del empaque recibido.',
  'Nuestro equipo te responderá en máximo 24 horas hábiles.',
  'Si aplica el cambio o garantía, te guiamos con el proceso de envío.',
] as const

function IconChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3h8l10 10-8 8L3 11V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 4 6v6c0 5 3.5 8.7 8 9 4.5-.3 8-4 8-9V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const HASH_TO_TAB: Record<string, TabId> = {
  '#cambios': 'cambios',
  '#terminos': 'terminos',
  '#envios': 'envios',
}

const PATH_TO_TAB: Record<string, TabId> = {
  '/cambios-devoluciones': 'cambios',
  '/terminos': 'terminos',
  '/politica-envios': 'envios',
}

function tabFromLocation(pathname: string, hash: string): TabId {
  return HASH_TO_TAB[hash] ?? PATH_TO_TAB[pathname] ?? 'cambios'
}

export function PoliticasPage() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    tabFromLocation(location.pathname, location.hash),
  )

  useEffect(() => {
    setActiveTab(tabFromLocation(location.pathname, location.hash))
  }, [location.pathname, location.hash])

  return (
    <main className="docs">
      <header className="docs__hero">
        <div className="container docs__hero-inner">
          <span className="docs__kicker">
            <span className="docs__kicker-dot" aria-hidden="true" />
            T3SO Studio
          </span>
          <h1 className="docs__title">Documentos Legales & Políticas</h1>
          <p className="docs__subtitle">Transparencia total. Ropa real. Reglas claras.</p>
          <span className="docs__watermark" aria-hidden="true">
            T3SO
          </span>

          <nav className="docs__tabs" role="tablist" aria-label="Documentos">
            {TABS.map((t) => {
              const isActive = activeTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`docs__tab${isActive ? ' is-active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <section className="docs__panel" role="tabpanel">
        <div className="container">
          {activeTab === 'cambios' ? (
            <CambiosPanel />
          ) : activeTab === 'terminos' ? (
            <SoonPanel
              kicker="Términos y condiciones"
              text="Estamos afinando el documento de términos y condiciones para que sea claro y directo. Muy pronto disponible."
            />
          ) : activeTab === 'envios' ? (
            <SoonPanel
              kicker="Política de envíos"
              text="Estamos consolidando los tiempos, zonas y costos de envío. Mientras tanto, escríbenos por WhatsApp para confirmar la cobertura."
            />
          ) : null}
        </div>
      </section>
    </main>
  )
}

function CambiosPanel() {
  return (
    <>
      <div className="docs__sectiontitle">
        <span className="docs__sectiontitle-dot" aria-hidden="true" />
        <span>Política de cambios, devoluciones y garantías</span>
      </div>

      <div className="docs__cards">
        <DocCard icon={<IconTag />} title="Cambios por talla">
          <p>
            ¿Te llegó en la talla equivocada o simplemente necesitas otra? Sin drama. Aceptamos
            cambios de talla con estas condiciones:
          </p>
          <ul className="docs__list">
            <li>
              La prenda debe estar <strong>sin usar, sin lavar y con etiqueta original</strong>.
            </li>
            <li>
              Tienes hasta <strong>5 días calendario</strong> después de recibir tu pedido para
              solicitarlo.
            </li>
            <li>El cambio aplica por una talla disponible del mismo diseño.</li>
            <li>
              El costo del envío de devolución corre por cuenta del cliente. T3SO asume el envío
              del cambio.
            </li>
          </ul>

          <div className="docs__factsgrid">
            <div className="docs__fact">
              <span className="docs__fact-label">Plazo máximo</span>
              <span className="docs__fact-value">5 días</span>
         
            </div>
            <div className="docs__fact">
              <span className="docs__fact-label">Estado de la prenda</span>
              <span className="docs__fact-value">Sin usar</span>
            </div>
          </div>
        </DocCard>

        <DocCard icon={<IconShield />} title="Garantía del producto">
          <p>
            Creemos en lo que hacemos. Por eso garantizamos nuestros estampados y costuras contra
            defectos de fabricación.
          </p>

          <p className="docs__subhead">Aplica garantía si:</p>
          <ul className="docs__list">
            <li>
              El estampado se cuartea, descascarilla o desvanece antes de los{' '}
              <strong>30 días</strong> con uso y lavado correcto.
            </li>
            <li>Las costuras presentan fallas evidentes al momento de la entrega.</li>
            <li>El producto recibido no corresponde al diseño del pedido.</li>
          </ul>

          <p className="docs__subhead">No aplica garantía si:</p>
          <ul className="docs__tags">
            {NO_GARANTIA.map((t) => (
              <li key={t} className="docs__tag">
                {t}
              </li>
            ))}
          </ul>
        </DocCard>

        <DocCard icon={<IconChat />} title="Proceso de contacto y tiempos de respuesta">
          <p>
            Todo se gestiona vía <strong>WhatsApp</strong>. Así de directo.
          </p>

          <ol className="docs__steps">
            {PROCESO_STEPS.map((step, i) => (
              <li key={step} className="docs__step">
                <span className="docs__step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="docs__step-text">{step}</span>
              </li>
            ))}
          </ol>

          <div className="docs__banner">
            <p>
              Atención disponible <strong>lunes a viernes de 9am a 6pm</strong> (hora Colombia).
              Solicitudes enviadas en fin de semana serán atendidas el siguiente lunes hábil.
            </p>
            <a
              href="https://wa.me/573169677206"
              target="_blank"
              rel="noopener noreferrer"
              className="docs__banner-cta"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </DocCard>
      </div>
    </>
  )
}

type CardProps = {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function DocCard({ icon, title, children, defaultOpen = true }: CardProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <article className={`docs__card${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="docs__card-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="docs__card-icon" aria-hidden="true">
          {icon}
        </span>
        <h2 className="docs__card-title">{title}</h2>
        <span className="docs__card-chevron" aria-hidden="true">
          <IconChevron />
        </span>
      </button>
      {open ? <div className="docs__card-body">{children}</div> : null}
    </article>
  )
}

function SoonPanel({ kicker, text }: { kicker: string; text: string }) {
  return (
    <div className="docs__soon">
      <span className="docs__soon-kicker">{kicker}</span>
      <p>{text}</p>
      <a
        href="https://wa.me/573169677206"
        target="_blank"
        rel="noopener noreferrer"
        className="docs__soon-cta"
      >
        Escríbenos por WhatsApp
      </a>
    </div>
  )
}
