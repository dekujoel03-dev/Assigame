import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className={isHome ? 'flex-1 overflow-x-hidden lg:overflow-hidden' : 'flex-1'}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  )
}
