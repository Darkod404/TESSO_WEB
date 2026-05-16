import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * En una SPA el scroll no se reinicia solo al cambiar de ruta; sin esto a veces
 * la nueva vista aparece con el scroll donde quedó la página anterior.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
