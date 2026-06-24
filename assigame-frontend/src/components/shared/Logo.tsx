import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** Affiche le logo complet avec le mot « Assigamé » */
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const heights = {
  sm: 'h-[2.75rem]',
  md: 'h-[3.85rem]',
  lg: 'h-[4.4rem]',
  xl: 'h-[5.5rem]',
}

/** Logo officiel Assigamé */
export function Logo({ className, variant: _variant = 'full', size = 'md' }: LogoProps) {
  const src = '/logo-full.png'
  const alt = 'Assigamé — Marketplace togolaise'

  return (
    <Link to="/" className={cn('inline-flex shrink-0 items-center', className)}>
      <img
        src={src}
        alt={alt}
        className={cn('w-auto object-contain', heights[size])}
        draggable={false}
      />
    </Link>
  )
}
