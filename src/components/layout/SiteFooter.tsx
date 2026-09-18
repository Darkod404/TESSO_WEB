import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { contentApi, type FooterLink } from '../../services/contentApi'
import { MEDIA } from '../../data/mediaUrls'
import { useStoreSettings } from '../../context/StoreSettingsContext'

function SocialIcon({ name }: { name: string | null }) {
  const key = (name ?? '').toLowerCase()
  if (key === 'whatsapp') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.7 11.7 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.3-1.6a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.5ZM12 21.8c-1.7 0-3.4-.5-4.9-1.3l-.3-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 18.1-5.4c0 5.4-4.4 9.9-10 9.9Zm5.4-7.4c-.3-.1-1.7-.9-2-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    )
  }
  if (key === 'facebook') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.77l-.44 2.91h-2.33V22c4.78-.75 8.43-4.91 8.43-9.93Z" />
      </svg>
    )
  }
  if (key === 'instagram') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
      </svg>
    )
  }
  if (key === 'tiktok') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 8.5a7.7 7.7 0 0 1-4.5-1.4v8.4a6.5 6.5 0 1 1-5.6-6.4v3a3.5 3.5 0 1 0 2.6 3.4V2h2.9a4.8 4.8 0 0 0 4.6 3.6V8.5Z" />
      </svg>
    )
  }
  return null
}

function ItemLink({ link }: { link: FooterLink }) {
  if (link.href.startsWith('http')) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    )
  }
  return <Link to={link.href}>{link.label}</Link>
}

export function SiteFooter() {
  const settings = useStoreSettings()
  const [links, setLinks] = useState<FooterLink[]>([])

  useEffect(() => {
    contentApi
      .footer()
      .then((res) => setLinks(res.links))
      .catch(() => setLinks([]))
  }, [])

  const brand = useMemo(() => links.filter((l) => l.group === 'brand'), [links])
  const help = useMemo(() => links.filter((l) => l.group === 'help'), [links])
  const social = useMemo(() => links.filter((l) => l.group === 'social'), [links])

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo" aria-label="Inicio T3SO">
            <img src={MEDIA.logo} alt="T3SO" />
          </Link>

          <ul className="site-footer__social" aria-label="Redes sociales">
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                >
                  <SocialIcon name={s.iconKey} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__cols">
          <section className="site-footer__col" aria-labelledby="footer-brand-title">
            <h3 id="footer-brand-title" className="site-footer__col-title">
              Sobre la marca
            </h3>
            <ul>
              {brand.map((l) => (
                <li key={l.id}>
                  <ItemLink link={l} />
                </li>
              ))}
            </ul>
          </section>

          <section className="site-footer__col" aria-labelledby="footer-help-title">
            <h3 id="footer-help-title" className="site-footer__col-title">
              Ayuda
            </h3>
            <ul>
              {help.map((l) => (
                <li key={l.id}>
                  <ItemLink link={l} />
                </li>
              ))}
            </ul>
          </section>

          <section className="site-footer__col" aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title" className="site-footer__col-title">
              Contacto
            </h3>
            <ul className="site-footer__contact">
              <li>T3SO</li>
              <li>
                WhatsApp:{' '}
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {settings.contactPhoneDisplay}
                </a>
              </li>
              <li>{settings.contactLocation}</li>
              <li>
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </li>
              {settings.storeHoursText ? <li>{settings.storeHoursText}</li> : null}
            </ul>
          </section>
        </div>

        <div className="site-footer__bottom">
          <ul className="site-footer__legal">
            <li>
              <Link to="/politica-de-privacidad">Política de privacidad</Link>
            </li>
            <li>
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">
                Superintendencia
              </a>
            </li>
          </ul>

          <button type="button" className="site-footer__chat" aria-label="Abrir chat de soporte">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 5h16v11H8l-4 4V5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
