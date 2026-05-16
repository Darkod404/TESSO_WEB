import { Outlet } from 'react-router-dom'
import '../../styles/home.css'
import { ScrollToTop } from './ScrollToTop'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
