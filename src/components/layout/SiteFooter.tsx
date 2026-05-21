import { Link } from 'react-router-dom'
import logoUrl from '../../assets/LogoPrincipal.png'

const BRAND_LINKS = [
  { to: '/sobre-t3so', label: 'Sobre T3SO (SIN VISTA)' },
  { to: '/nuestra-esencia', label: 'Nuestra esencia (SIN VISTA)' },
  { to: '/disenos-y-estampados', label: 'Diseños & estampados (SIN VISTA)' },
  { to: '/cultura-t3so', label: 'Cultura T3SO (SIN VISTA)' },
  { to: '/unete-a-t3so', label: 'Únete a T3SO (SIN VISTA)' },
] as const

const HELP_LINKS = [
  { to: '/cambios-devoluciones', label: 'Cambios, devoluciones y garantías' },
  { to: '/terminos', label: 'Términos y condiciones' },
  { to: '/politica-envios', label: 'Política de envíos' },
  { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes' }
] as const

const SOCIAL = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/573169677206',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.7 11.7 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.3-1.6a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.5ZM12 21.8c-1.7 0-3.4-.5-4.9-1.3l-.3-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 18.1-5.4c0 5.4-4.4 9.9-10 9.9Zm5.4-7.4c-.3-.1-1.7-.9-2-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/t3so',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.77l-.44 2.91h-2.33V22c4.78-.75 8.43-4.91 8.43-9.93Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/t3so',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@t3so',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 8.5a7.7 7.7 0 0 1-4.5-1.4v8.4a6.5 6.5 0 1 1-5.6-6.4v3a3.5 3.5 0 1 0 2.6 3.4V2h2.9a4.8 4.8 0 0 0 4.6 3.6V8.5Z" />
      </svg>
    ),
  },
] as const

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo" aria-label="Inicio T3SO">
            <img src={logoUrl} alt="T3SO" />
          </Link>

          <ul className="site-footer__social" aria-label="Redes sociales">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                >
                  {s.icon}
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
              {BRAND_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="site-footer__col" aria-labelledby="footer-help-title">
            <h3 id="footer-help-title" className="site-footer__col-title">
              Ayuda
            </h3>
            <ul>
              {HELP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
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
                <a href="https://wa.me/573169677206" target="_blank" rel="noopener noreferrer">
                  +57 316 967 7206
                </a>
              </li>
              <li>Tienda online · Bogotá, Colombia</li>
              <li>
                <a href="mailto:t3so250314@gmail.com">t3so250314@gmail.com</a>
              </li>
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
