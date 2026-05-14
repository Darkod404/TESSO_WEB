import { useId, useState } from 'react'
import '../styles/faq.css'

const FAQS = [
  {
    q: '¿Cuál es el tiempo de entrega?',
    a: 'Para diseños de colección, entregamos en 3-5 días hábiles. Para pedidos personalizados, el tiempo oscila entre 7 y 10 días dependiendo de la complejidad y volumen.',
  },
  {
    q: '¿Tienen pedido mínimo para personalizados?',
    a: 'No. Creemos en la identidad individual. Puedes pedir desde una sola camiseta personalizada con la misma calidad que un pedido masivo.',
  },
  {
    q: '¿Qué tipo de telas utilizan?',
    a: 'Utilizamos algodón 100% premium de 240gsm (Heavyweight) para nuestras líneas de streetwear, garantizando durabilidad y confort superior.',
  },
  {
    q: '¿Hacen envíos internacionales?',
    a: 'Actualmente realizamos envíos a todo el territorio nacional. Estamos trabajando para habilitar envíos internacionales próximamente.',
  },
] as const

export function FaqPage() {
  const baseId = useId()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq-page">
      <div className="container">
        <header className="faq-page__head">
          <h1>Preguntas frecuentes</h1>
          <p>Todo lo que necesitas saber sobre T3SO.</p>
        </header>

        <div className="faq-list" role="list">
          {FAQS.map((item, i) => {
            const id = `${baseId}-panel-${i}`
            const triggerId = `${baseId}-trigger-${i}`
            const isOpen = open === i
            return (
              <div key={item.q} className="faq-item" role="listitem">
                <button
                  id={triggerId}
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-item__chevron" data-open={isOpen} aria-hidden="true">
                    ▼
                  </span>
                </button>
                {isOpen ? (
                  <div id={id} className="faq-item__panel" role="region" aria-labelledby={triggerId}>
                    {item.a}
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
