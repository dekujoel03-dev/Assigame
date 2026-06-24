import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  FolderTree,
  LayoutDashboard,
  Menu,
  Package,
  Users,
  X,
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const adminLinks = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { label: 'Vendeurs', href: '/admin/vendeurs', icon: Users },
  { label: 'Produits', href: '/admin/produits', icon: Package },
  { label: 'Catégories', href: '/admin/categories', icon: FolderTree },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-white text-foreground transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2.5">
            <Logo variant="icon" size="sm" className="pointer-events-none" />
            <span className="font-bold text-foreground">Admin</span>
          </div>
          <button type="button" className="text-muted-foreground lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminLinks.map((link) => {
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
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="shrink-0 border-t border-border p-4">
          <p className="mb-2 truncate text-sm text-muted-foreground">{user?.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
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
