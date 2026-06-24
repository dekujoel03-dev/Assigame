import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { useApparitionBanniere, useParallaxe } from '@/hooks/useAnimations'

const diapositives = [
  {
    badge: "Promo jusqu'à -30%",
    titre: 'Trouvez tout ce dont vous avez besoin au Togo',
    description:
      'Des milliers de produits premium, des vendeurs vérifiés et un contact direct via WhatsApp.',
    bouton: 'Explorer les produits',
    lien: '/produits',
  },
  {
    badge: 'Nouveautés chaque semaine',
    titre: 'Électronique, mode, maison & plus',
    description:
      'Parcourez les meilleures offres des vendeurs togolais, partout au Togo.',
    bouton: 'Voir les catégories',
    lien: '/categories',
  },
]

export function BanniereAccueil() {
  const [diapoActive, setDiapoActive] = useState(0)
  const diapo = diapositives[diapoActive]
  const sectionRef = useRef<HTMLElement>(null)
  const visuelRef = useRef<HTMLDivElement>(null)

  useApparitionBanniere(sectionRef)
  useParallaxe(visuelRef, sectionRef, ['0rem', '-2rem'])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-0 flex-1 flex-col bg-white pt-20 lg:h-full lg:min-h-0 lg:pt-20"
    >
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-center px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-6 lg:px-8 lg:py-3 xl:max-w-7xl xl:gap-8">
        <div className="flex w-full flex-col justify-center lg:py-6">
          <p
            data-banniere
            className="text-xs font-semibold uppercase tracking-widest text-secondary opacity-0 sm:text-sm"
          >
            {diapo.badge}
          </p>
          <h1
            data-banniere
            className="mt-3 text-3xl font-bold leading-[1.12] tracking-tight text-foreground opacity-0 sm:text-4xl lg:text-[2.75rem]"
          >
            {diapo.titre}
          </h1>
          <p
            data-banniere
            className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 opacity-0 sm:text-base"
          >
            {diapo.description}
          </p>
          <Link
            data-banniere
            to={diapo.lien}
            className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white opacity-0 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {diapo.bouton}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="relative mt-8 flex min-h-[280px] items-stretch sm:min-h-[340px] lg:-ml-4 lg:mt-0 lg:min-h-0 xl:-ml-6">
          <div
            ref={visuelRef}
            className="flex h-full w-full items-end justify-center"
          >
            <div className="animate-[float_6s_ease-in-out_infinite] h-[min(52vh,560px)] w-full sm:h-[min(58vh,640px)] lg:h-[min(calc(100dvh-10.5rem),720px)]">
              <img
                src="/hero-products.png"
                alt="Produits premium disponibles sur ASSIGAME"
                className="hero-image-blend size-full object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 justify-center gap-2 bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(255,255,255,0.9)]">
        {diapositives.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setDiapoActive(index)}
            aria-label={`Diapositive ${index + 1}`}
            aria-current={index === diapoActive}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === diapoActive
                ? 'w-8 bg-secondary'
                : 'w-2.5 bg-slate-200 hover:bg-slate-300'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
