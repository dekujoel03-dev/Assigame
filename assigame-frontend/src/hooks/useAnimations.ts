import { useEffect, type RefObject } from 'react'
import { animate, createScope, onScroll, stagger, type ScrollObserverParams } from 'animejs'

type StyleApparition = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleIn'

const STYLES_APPARITION: Record<
  StyleApparition,
  { opacity: [number, number]; x?: [string, string]; y?: [string, string]; scale?: [number, number] }
> = {
  fadeUp: { opacity: [0, 1], y: ['2.5rem', '0rem'] },
  fadeLeft: { opacity: [0, 1], x: ['-2rem', '0rem'] },
  fadeRight: { opacity: [0, 1], x: ['2rem', '0rem'] },
  scaleIn: { opacity: [0, 1], scale: [0.92, 1] },
}

const SELECTEUR_APPARITION = '[data-apparition]'
const SELECTEUR_BANNIERE = '[data-banniere]'

interface OptionsApparition {
  style?: StyleApparition
  decalageMs?: number
  duree?: number
  scroll?: Partial<ScrollObserverParams>
  selecteur?: string
}

/** Fait apparaître les éléments quand on fait défiler la page. */
export function useApparitionAuDefilement(
  sectionRef: RefObject<HTMLElement | null>,
  {
    style = 'fadeUp',
    decalageMs = 100,
    duree = 900,
    scroll = {},
    selecteur = SELECTEUR_APPARITION,
  }: OptionsApparition = {},
) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scope = createScope({ root: section })

    scope.add(() => {
      const items = section.querySelectorAll<HTMLElement>(selecteur)
      const targets = items.length ? items : [section]
      const props = STYLES_APPARITION[style]

      animate(targets, {
        ...props,
        duration: duree,
        ease: 'outExpo',
        delay: items.length > 1 ? stagger(decalageMs) : 0,
        autoplay: onScroll({
          target: section,
          enter: 'bottom top-=12%',
          repeat: false,
          ...scroll,
        }),
      })
    })

    return () => scope.revert()
  }, [sectionRef, style, decalageMs, duree, selecteur, scroll])
}

/** Déplace un bloc en même temps que le scroll (effet parallaxe). */
export function useParallaxe(
  cibleRef: RefObject<HTMLElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  plageY: [string, string] = ['0rem', '-4rem'],
) {
  useEffect(() => {
    const cible = cibleRef.current
    const section = sectionRef.current
    if (!cible || !section) return

    const scope = createScope({ root: section })

    scope.add(() => {
      animate(cible, {
        y: plageY,
        ease: 'linear',
        duration: 1,
        autoplay: onScroll({
          target: section,
          sync: true,
        }),
      })
    })

    return () => scope.revert()
  }, [cibleRef, sectionRef, plageY])
}

/** Apparition des blocs de la page d'accueil (conteneur `.home-scroll`). */
export function useApparitionAccueil(
  sectionRef: RefObject<HTMLElement | null>,
  {
    style = 'fadeUp',
    decalageMs = 100,
    duree = 900,
    selecteur = SELECTEUR_APPARITION,
  }: Omit<OptionsApparition, 'scroll'> = {},
) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let joue = false
    let observer: IntersectionObserver | undefined
    let retryId: number | undefined
    let detachScroll: (() => void) | undefined
    const scope = createScope({ root: section })

    const reveler = () => {
      if (joue) return
      joue = true

      scope.add(() => {
        const items = section.querySelectorAll<HTMLElement>(selecteur)
        const targets = items.length ? items : [section]

        animate(targets, {
          ...STYLES_APPARITION[style],
          duration: duree,
          ease: 'outExpo',
          delay: items.length > 1 ? stagger(decalageMs) : 0,
          autoplay: true,
        })
      })
    }

    const visibleDansAccueil = (conteneur: HTMLElement) => {
      const cr = conteneur.getBoundingClientRect()
      const sr = section.getBoundingClientRect()
      return sr.top < cr.bottom - 24 && sr.bottom > cr.top + 24
    }

    const attacher = () => {
      const conteneur = document.querySelector<HTMLElement>('.home-scroll')
      if (!conteneur) return false

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveler()
        },
        { root: conteneur, threshold: 0.08 },
      )
      observer.observe(section)

      const onScroll = () => {
        if (visibleDansAccueil(conteneur)) reveler()
      }
      onScroll()
      conteneur.addEventListener('scroll', onScroll, { passive: true })
      detachScroll = () => conteneur.removeEventListener('scroll', onScroll)

      return true
    }

    if (!attacher()) {
      retryId = window.setInterval(() => {
        if (attacher()) {
          window.clearInterval(retryId)
          retryId = undefined
        }
      }, 50)
    }

    const secoursId = window.setTimeout(() => {
      section.querySelectorAll<HTMLElement>(selecteur).forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    }, 1200)

    return () => {
      if (retryId) window.clearInterval(retryId)
      window.clearTimeout(secoursId)
      observer?.disconnect()
      detachScroll?.()
      scope.revert()
    }
  }, [sectionRef, style, decalageMs, duree, selecteur])
}

/** Animation d'entrée de la bannière d'accueil. */
export function useApparitionBanniere(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scope = createScope({ root: section })

    scope.add(() => {
      animate(section.querySelectorAll(SELECTEUR_BANNIERE), {
        opacity: [0, 1],
        y: ['1.5rem', '0rem'],
        duration: 1100,
        ease: 'outExpo',
        delay: stagger(120, { start: 150 }),
        autoplay: true,
      })
    })

    return () => scope.revert()
  }, [sectionRef])
}
