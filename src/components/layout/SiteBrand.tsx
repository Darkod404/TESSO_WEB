import { Link } from 'react-router-dom'
import { MEDIA } from '../../data/mediaUrls'

export function SiteBrand() {
  return (
    <Link to="/" className="brand" aria-label="Inicio T3SO">
      <img src={MEDIA.logo} alt="" className="brand__mark" width={140} height={48} decoding="async" />
    </Link>
  )
}
