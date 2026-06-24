import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils'
import { useNavbarScroll } from '@/hooks/useNavbarScroll'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const scrolled = useNavbarScroll()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      navigate(`/produits?q=${encodeURIComponent(q)}`)
    } else {
      navigate('/produits')
    }
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b glass-nav transition-all duration-500 ease-out',
        scrolled && 'glass-nav-scrolled shadow-soft'
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo size="xl" className="hidden shrink-0 sm:inline-flex" />
        <Logo variant="icon" size="lg" className="shrink-0 sm:hidden" />

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors',
                location.pathname === link.href
                  ? 'text-foreground'
                  : 'text-slate-500 hover:text-foreground'
              )}
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="size-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className={cn(
                'h-10 w-44 rounded-full border pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:w-52 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 lg:w-52 lg:focus:w-60',
                'glass border-white/70 bg-white/50'
              )}
            />
          </form>

          <Link
            to="/connexion"
            className="hidden rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 sm:inline-flex lg:px-5 lg:text-sm"
          >
            Connexion / Devenir vendeur
          </Link>

          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass-nav border-t border-white/50 px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </form>

          <Link
            to="/connexion"
            onClick={() => setMobileOpen(false)}
            className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            Connexion / Devenir vendeur
          </Link>

          <nav>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-semibold uppercase tracking-wide text-slate-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
