import { useEffect, useId, useState } from 'react'
import { contentApi, type FaqItem } from '../services/contentApi'
import '../styles/faq.css'

export function FaqPage() {
  const baseId = useId()
  const [open, setOpen] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    contentApi
      .faqs()
      .then(setFaqs)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Error cargando FAQs'))
  }, [])

  return (
    <div className="faq-page">
      <div className="container">
        <header className="faq-page__head">
          <h1>Preguntas frecuentes</h1>
          <p>Todo lo que necesitas saber sobre T3SO.</p>
        </header>

        {error ? <p className="state state--error">{error}</p> : null}

        <div className="faq-list" role="list">
          {faqs.map((item, i) => {
            const id = `${baseId}-panel-${i}`
            const triggerId = `${baseId}-trigger-${i}`
            const isOpen = open === i
            return (
              <div key={item.id} className="faq-item" role="listitem">
                <button
                  id={triggerId}
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className="faq-item__chevron" data-open={isOpen} aria-hidden="true">
                    ▼
                  </span>
                </button>
                {isOpen ? (
                  <div id={id} className="faq-item__panel" role="region" aria-labelledby={triggerId}>
                    {item.answer}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
