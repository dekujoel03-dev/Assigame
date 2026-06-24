import { useEffect, useState } from 'react'
import { DEFAULT_PRODUCT_IMAGE, withThumbParam } from '@/lib/apiConfig'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  thumb?: boolean
  priority?: boolean
}

/** Affiche une image produit entière dans son cadre, sans recadrage. */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  thumb = false,
  priority = false,
}: ProductImageProps) {
  const resolvedSrc = thumb ? withThumbParam(src) : src
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc)

  useEffect(() => {
    setCurrentSrc(resolvedSrc)
  }, [resolvedSrc])

  return (
    <div className={cn('relative size-full bg-white p-3', className)}>
      <div className="relative size-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)]">
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            'size-full object-contain object-center p-2',
            imgClassName,
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => {
            if (currentSrc !== DEFAULT_PRODUCT_IMAGE) {
              setCurrentSrc(DEFAULT_PRODUCT_IMAGE)
            }
          }}
        />
      </div>
    </div>
  )
}
