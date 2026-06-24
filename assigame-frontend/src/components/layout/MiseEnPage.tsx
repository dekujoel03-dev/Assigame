import { useRef, type ReactNode } from 'react'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { cn } from '@/lib/utils'

interface EnTetePageProps {
  badge?: string
  title: string
  description?: string
  children?: ReactNode
  centered?: boolean
}

export function EnTetePage({ badge, title, description, children, centered = false }: EnTetePageProps) {
  const ref = useRef<HTMLElement>(null)
  useApparitionAuDefilement(ref, { style: 'fadeUp', decalageMs: 80 })

  return (
    <section ref={ref} className="page-gradient relative z-20 overflow-visible border-b border-slate-100/80 px-4 pb-14 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-28">
      <div className={cn('mx-auto max-w-7xl', centered ? 'text-center' : 'text-left')}>
        {badge && (
          <p
            data-apparition
            className="inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-secondary opacity-0 backdrop-blur-sm"
          >
            {badge}
          </p>
        )}
        <h1
          data-apparition
          className="mt-4 text-3xl font-bold tracking-tight opacity-0 sm:text-4xl lg:text-[2.75rem]"
        >
          {title}
        </h1>
        {description && (
          <p
            data-apparition
            className={cn(
              'mt-4 text-lg text-muted-foreground opacity-0',
              centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left',
            )}
          >
            {description}
          </p>
        )}
        {children && (
          <div data-apparition className={cn('mt-6 opacity-0', centered && 'flex justify-center')}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

interface SectionPageProps {
  children: ReactNode
  className?: string
  style?: 'fadeUp' | 'scaleIn' | 'fadeLeft' | 'fadeRight'
}

export function SectionPage({ children, className = '', style = 'fadeUp' }: SectionPageProps) {
  const ref = useRef<HTMLElement>(null)
  useApparitionAuDefilement(ref, { style, decalageMs: 90 })

  return (
    <section ref={ref} className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 ${className}`}>
      {children}
    </section>
  )
}

interface CarteProps {
  children: ReactNode
  className?: string
  survol?: boolean
}

export function Carte({ children, className = '', survol = true }: CarteProps) {
  return (
    <div
      data-apparition
      className={`glass-card p-6 opacity-0 transition-all duration-500 ${
        survol ? 'hover:-translate-y-0.5 hover:shadow-volumetric hover:border-primary/20' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
