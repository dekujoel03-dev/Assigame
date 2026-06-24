import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Menu, Package, PlusCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const sellerLinks = [
  { label: 'Tableau de bord', href: '/vendeur', icon: LayoutDashboard },
  { label: 'Mes produits', href: '/vendeur/produits', icon: Package },
  { label: 'Ajouter un produit', href: '/vendeur/produits/nouveau', icon: PlusCircle },
]

export function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-[#EFF6FF] transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-6">
          <Logo variant="icon" size="sm" className="pointer-events-none" />
          <span className="font-bold text-primary">Assigamé</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {sellerLinks.map((link) => {
            const Icon = link.icon
            const active = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                )}
              >
                <Icon className="size-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="shrink-0 border-t border-border p-4">
          <p className="mb-2 truncate text-sm font-medium">
            {user?.prenom} {user?.nom}
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            Déconnexion
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      <div className="flex h-dvh flex-col lg:ml-64">
        <header className="flex h-16 shrink-0 items-center border-b border-border bg-white px-4 lg:hidden">
          <button
            type="button"
            className="rounded-lg p-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
          >
            <Menu className="size-6" />
          </button>
        </header>
        <main className="page-gradient flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
