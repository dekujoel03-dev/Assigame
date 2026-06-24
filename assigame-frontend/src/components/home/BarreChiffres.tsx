import { useRef } from 'react'
import { CHIFFRES_CLES } from '@/lib/constants'
import { useApparitionAccueil } from '@/hooks/useAnimations'

export function BarreChiffres() {
  const sectionRef = useRef<HTMLElement>(null)

  useApparitionAccueil(sectionRef, { decalageMs: 100, style: 'fadeUp' })

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-slate-100/80 px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-secondary/[0.03]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {CHIFFRES_CLES.map((chiffre) => (
          <div
            key={chiffre.label}
            data-apparition
            className="glass-card rounded-2xl p-5 text-center transition-transform duration-500 hover:-translate-y-0.5 sm:p-6"
          >
            <p className="text-2xl font-bold text-primary sm:text-3xl">{chiffre.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{chiffre.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
