import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useApparitionAccueil } from '@/hooks/useAnimations'

export function BandeauVendeur() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)

  useApparitionAccueil(sectionRef, {
    selecteur: '[data-apparition]',
    decalageMs: 120,
    style: 'fadeUp',
  })

  return (
    <section
      ref={sectionRef}
      className="page-gradient relative overflow-hidden px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-60 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div data-apparition className="glass-panel w-full p-8 sm:p-10 lg:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Vous êtes vendeur ?
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Rejoignez la marketplace la plus avancée du Togo. Vendez vos produits à des
              milliers d&apos;acheteurs.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-glow-blue transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => navigate('/inscription')}
            >
              Devenir vendeur
              <ArrowRight className="size-4" />
            </button>
          </div>

          <p className="mt-8 border-t border-slate-200/80 pt-6 text-center text-sm font-medium text-slate-700 sm:text-base">
            Parrainez un ami sur ASSIGAME et profitez de{' '}
            <span className="font-bold text-secondary">-20%</span> sur votre prochain achat
          </p>
        </div>
      </div>
    </section>
  )
}
