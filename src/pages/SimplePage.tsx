import { Link } from 'react-router-dom'

export function SimplePage({ title }: { title: string }) {
  return (
    <div className="container section">
      <p className="kicker" style={{ marginBottom: '0.75rem' }}>
        T3SO
      </p>
      <h1 className="section-title">{title}</h1>
      <p className="lead">Esta sección estará disponible próximamente.</p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link className="btn btn-outline" to="/">
          Volver al inicio
        </Link>
      </p>
    </div>
  )
}
