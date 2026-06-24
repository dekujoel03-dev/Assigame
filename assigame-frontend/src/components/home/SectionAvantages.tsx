import { useRef } from 'react'
import { AVANTAGES } from '@/lib/constants'
import { CarteAvantage } from '@/components/home/CarteAvantage'
import { useApparitionAccueil } from '@/hooks/useAnimations'

export function SectionAvantages() {
  const sectionRef = useRef<HTMLElement>(null)

  useApparitionAccueil(sectionRef, { decalageMs: 90, style: 'scaleIn' })

  return (
    <section ref={sectionRef} className="mx-auto flex flex-1 flex-col justify-center max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div data-apparition className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pourquoi ASSIGAME ?</h2>
        <p className="mt-2 text-muted-foreground">
          Une expérience marketplace pensée pour le Togo
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {AVANTAGES.map((avantage) => (
          <CarteAvantage key={avantage.title} avantage={avantage} animer />
        ))}
      </div>
    </section>
  )
}
