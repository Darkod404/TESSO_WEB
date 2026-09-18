import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreSettings } from '../../context/StoreSettingsContext'
import '../../styles/floating-help.css'

const FAQ_STATIC = [
  {
    q: '¿Hay pedido mínimo para personalizados?',
    a: 'No. Puedes pedir desde una sola camiseta con la misma calidad.',
  },
  {
    q: '¿Hacen envíos a todo el país?',
    a: 'Sí, enviamos a todo el territorio nacional. El costo se calcula en el carrito.',
  },
  {
    q: '¿Cómo personalizo mi camiseta?',
    a: 'Entra a "Personaliza", sube tu diseño y ubícalo en la zona que prefieras en el modelo 3D.',
  },
] as const

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.35c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function buildWhatsAppHref(baseUrl: string, phone: string, message: string): string {
  if (baseUrl.includes('wa.me') || baseUrl.includes('api.whatsapp.com')) {
    try {
      const url = new URL(baseUrl)
      if (message) url.searchParams.set('text', message)
      return url.toString()
    } catch {
      /* fall through */
    }
  }
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function FloatingHelp() {
  const settings = useStoreSettings()
  const [open, setOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppHref(
        settings.whatsappUrl,
        settings.contactPhone,
        settings.whatsappDefaultMessage,
      ),
    [settings.whatsappUrl, settings.contactPhone, settings.whatsappDefaultMessage],
  )

  const faqs = useMemo(
    () => [
      {
        q: '¿Cuál es el tiempo de entrega?',
        a: settings.productionLeadTimeText,
      },
      ...FAQ_STATIC,
    ],
    [settings.productionLeadTimeText],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={`fab-help${open ? ' is-open' : ''}`}>
      {open && (
        <div className="fab-help__panel" role="dialog" aria-label="Centro de ayuda">
          <header className="fab-help__head">
            <div>
              <p className="fab-help__title">¿Necesitas ayuda?</p>
              <p className="fab-help__subtitle">
                {settings.storeHoursText || 'Estamos para resolver tus dudas'}
              </p>
            </div>
            <button type="button" className="fab-help__close" aria-label="Cerrar" onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </header>

          <div className="fab-help__body">
            <a
              className="fab-help__whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp />
              <span>
                <strong>Escríbenos por WhatsApp</strong>
                <small>{settings.contactPhoneDisplay}</small>
              </span>
            </a>

            <p className="fab-help__section-title">Preguntas frecuentes</p>
            <div className="fab-help__faqs">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i
                return (
                  <div key={item.q} className="fab-help__faq">
                    <button
                      type="button"
                      className="fab-help__faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span>{item.q}</span>
                      <span className="fab-help__faq-chevron" data-open={isOpen} aria-hidden="true">
                        ▼
                      </span>
                    </button>
                    {isOpen && <p className="fab-help__faq-a">{item.a}</p>}
                  </div>
                )
              })}
            </div>

            <div className="fab-help__links">
              <Link to="/preguntas-frecuentes" className="fab-help__link" onClick={() => setOpen(false)}>
                Ver todas las preguntas
              </Link>
              <Link to="/personaliza" className="fab-help__link" onClick={() => setOpen(false)}>
                Personalizar una camiseta
              </Link>
              <Link to="/politicas" className="fab-help__link" onClick={() => setOpen(false)}>
                Envíos y políticas
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="fab-help__bubble"
        aria-label={open ? 'Cerrar ayuda' : 'Abrir ayuda'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <IconClose /> : <IconChat />}
      </button>
    </div>
  )
}
