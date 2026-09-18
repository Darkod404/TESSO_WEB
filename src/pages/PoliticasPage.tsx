import '../styles/politicas.css'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { contentApi, type PolicyPage } from '../services/contentApi'

type TabId = 'cambios' | 'terminos' | 'envios'

const TABS: { id: TabId; label: string; slug: string }[] = [
  { id: 'cambios', label: 'Cambios & Garantías', slug: 'cambios' },
  { id: 'terminos', label: 'Términos & Condiciones', slug: 'terminos' },
  { id: 'envios', label: 'Envíos', slug: 'envios' },
]

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
  const [policy, setPolicy] = useState<PolicyPage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setActiveTab(tabFromLocation(location.pathname, location.hash))
  }, [location.pathname, location.hash])

  useEffect(() => {
    const tab = TABS.find((t) => t.id === activeTab)
    if (!tab) return
    setLoading(true)
    setError(null)
    contentApi
      .policy(tab.slug)
      .then(setPolicy)
      .catch((e: unknown) => {
        setPolicy(null)
        setError(e instanceof Error ? e.message : 'No se pudo cargar la política')
      })
      .finally(() => setLoading(false))
  }, [activeTab])

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
          {loading ? <p className="state">Cargando…</p> : null}
          {error ? <p className="state state--error">{error}</p> : null}
          {policy && !loading ? (
            <>
              <div className="docs__sectiontitle">
                <span className="docs__sectiontitle-dot" aria-hidden="true" />
                <span>{policy.title}</span>
              </div>
              <article
                className="docs__html"
                dangerouslySetInnerHTML={{ __html: policy.bodyHtml }}
              />
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}
