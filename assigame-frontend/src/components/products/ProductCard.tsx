import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { formatStockLabel, getStockBadgeVariant } from '@/lib/stock'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CarteSurvol } from '@/components/motion/CarteSurvol'
import { ProductImage } from '@/components/products/ProductImage'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn('text-xs', i < Math.round(rating) ? 'text-secondary' : 'text-slate-200')}>
          ★
        </span>
      ))}
    </div>
  )
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [favorited, setFavorited] = useState(false)

  return (
    <CarteSurvol className={cn('group h-full', className)}>
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-500 group-hover:shadow-volumetric">
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        </div>

        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#eef1f4]">
          <Link to={`/produits/${product.id}`} className="absolute inset-0 block">
            <motion.div
              className="size-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                thumb
                priority={priority}
              />
            </motion.div>
          </Link>

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <button
            type="button"
            onClick={() => setFavorited(!favorited)}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full glass-2-light transition-transform hover:scale-110"
            aria-label="Favoris"
          >
            <Heart className={cn('size-4', favorited ? 'fill-secondary text-secondary' : 'text-slate-500')} />
          </button>

          <Badge
            variant={getStockBadgeVariant(product.stock, product.status)}
            className="absolute left-3 top-3 shadow-soft"
          >
            {product.stock > 0 ? product.stock : '0'}
          </Badge>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-x-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Link
              to={`/produits/${product.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/90 py-2.5 text-sm font-semibold text-primary backdrop-blur-sm"
            >
              Voir le produit
              <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>
        </div>

        <div className="relative flex min-h-[8.75rem] flex-1 flex-col p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {product.categoryName}
          </p>
          <Link
            to={`/produits/${product.id}`}
            className="mt-1 line-clamp-2 font-semibold leading-snug text-slate-900 transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-2 text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatStockLabel(product.stock)}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-xs text-slate-500">{product.ville}</span>
            <StarRating rating={product.rating} />
          </div>
        </div>
      </article>
    </CarteSurvol>
  )
}
