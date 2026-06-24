import { Link } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import { NAV_LINKS, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from '@/lib/constants'
import { Logo } from '@/components/shared/Logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size="xl" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              La marketplace togolaise qui connecte acheteurs et vendeurs vérifiés partout au Togo.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Vendeurs</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/inscription" className="transition-colors hover:text-primary">
                  Devenir vendeur
                </Link>
              </li>
              <li>
                <Link to="/connexion" className="transition-colors hover:text-primary">
                  Espace vendeur
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="transition-colors hover:text-primary">
                  Comment ça marche
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                Lomé, Togo
              </li>
              <li>
                <a href="mailto:contact@assigame.tg" className="transition-colors hover:text-primary">
                  contact@assigame.tg
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
                  <Phone className="size-3.5 shrink-0" />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 ASSIGAME. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Confidentialité</a>
            <a href="#" className="hover:text-primary">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
