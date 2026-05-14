import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Link to="/" className="brand">
          T3SO
        </Link>

        <ul className="footer-links">
          <li>
            <a href="#privacidad">Privacidad</a>
          </li>
          <li>
            <a href="#envios">Envíos</a>
          </li>
          <li>
            <a href="#terminos">Términos</a>
          </li>
          <li>
            <a href="#sostenibilidad">Sostenibilidad</a>
          </li>
          <li>
            <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
          </li>
        </ul>

        <hr className="footer-rule" />

        <p className="footer-meta">© {new Date().getFullYear()} T3SO. Viste diferente.</p>

        <div className="footer-icons" aria-label="Utilidades">
          <button type="button" aria-label="Accesibilidad (próximamente)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 4a2 2 0 1 0 0.01 0M8 21h8M12 8v13M6 12H4l2-4h12l2 4h-2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" aria-label="Idioma (próximamente)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
          </button>
          <button type="button" aria-label="Soporte (próximamente)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 10a5 5 0 0 1 10 0v2H7v-2Zm3 8h4M12 3v1"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
