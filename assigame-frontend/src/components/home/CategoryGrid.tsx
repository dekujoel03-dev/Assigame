import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { isApiImageUrl, withThumbParam } from '@/lib/apiConfig'
import { getCategoryImageMeta } from '@/lib/images'
import { Skeleton } from '@/components/ui/skeleton'
import { CarteSurvol } from '@/components/motion/CarteSurvol'
import { ListeApparition, ItemApparition } from '@/components/motion/ApparitionProgressive'

interface CategoryGridProps {
  categories: Category[]
  loading?: boolean
}

export function CategoryGrid({ categories, loading }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 items-stretch gap-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <ListeApparition className="grid grid-cols-2 items-stretch gap-5 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const image = getCategoryImageMeta(category.slug, category.image)
        const imageSrc = isApiImageUrl(image.src) ? withThumbParam(image.src) : image.src

        return (
          <ItemApparition key={category.id} className="h-full">
            <CarteSurvol className="h-full">
              <Link
                to={`/produits?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:border-primary/30 hover:shadow-glow-blue"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#eef1f4]">
                  <img
                    src={imageSrc}
                    alt={category.name}
                    className="image-contour size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: image.position }}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="line-clamp-2 text-sm font-semibold leading-tight text-white sm:text-base">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-white/80">{category.productCount} produits</p>
                  </div>
                </div>

                <div className="flex h-[4.75rem] shrink-0 items-start border-t border-slate-100 px-4 py-3">
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {category.description}
                  </p>
                </div>
              </Link>
            </CarteSurvol>
          </ItemApparition>
        )
      })}
    </ListeApparition>
  )
}
