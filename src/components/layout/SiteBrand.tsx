import { Link } from 'react-router-dom'
import logoUrl from '../../assets/LogoPrincipal.png'

export function SiteBrand() {
  return (
    <Link to="/" className="brand" aria-label="Inicio T3SO">
      <img src={logoUrl} alt="" className="brand__mark" width={140} height={48} decoding="async" />
    </Link>
  )
}
