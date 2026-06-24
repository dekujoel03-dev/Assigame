import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, Phone, Star } from 'lucide-react'
import type { Product } from '@/types'
import { productService } from '@/services/productService'
import { formatPrice, formatWhatsAppLink } from '@/lib/utils'
import { formatStockLabel, isLowStock } from '@/lib/stock'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { ProductGallery } from '@/components/products/ProductGallery'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const relatedRef = useRef<HTMLElement>(null)

  useApparitionAuDefilement(sectionRef, { style: 'fadeUp', decalageMs: 100 })
  useApparitionAuDefilement(relatedRef, { style: 'scaleIn', decalageMs: 80 })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    productService.getByIdOrSlug(slug).then(async (p) => {
      setProduct(p)
      if (p) {
        const res = await productService.getAll({ category: p.categoryName }, 1, 4)
        setRelated(res.data.filter((r) => r.id !== p.id).slice(0, 3))
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="page-gradient mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 text-center">
        <h1 className="text-2xl font-bold">Produit introuvable</h1>
        <Link to="/produits" className="mt-4 inline-block text-primary hover:underline">
          Retour aux produits
        </Link>
      </div>
    )
  }

  const whatsappUrl = formatWhatsAppLink(
    product.sellerPhone,
    `Bonjour, je suis intéressé par "${product.name}" sur Assigamé.`
  )

  return (
    <div className="page-gradient">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pb-14 lg:pt-28">
        <Link
          to="/produits"
          data-apparition
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground opacity-0 hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Retour aux produits
        </Link>

        <section ref={sectionRef} className="grid gap-10 lg:grid-cols-2">
          <div data-apparition className="opacity-0">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div data-apparition className="glass-panel p-5 opacity-0 sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{product.categoryName}</Badge>
              {product.trending && <Badge className="bg-secondary">Tendance</Badge>}
              {!product.available && (
                <Badge variant="outline">
                  {product.stock <= 0 ? 'Rupture de stock' : 'Indisponible'}
                </Badge>
              )}
              {product.available && isLowStock(product.stock) && (
                <Badge variant="outline">Stock limité</Badge>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">{product.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-secondary">
                <Star className="size-4 fill-current" />
                <span className="font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount} avis)</span>
            </div>

            <p className="mt-6 text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {product.ville}
              </span>
              <span>Vendeur : {product.sellerName}</span>
              <span className="font-medium text-foreground">{formatStockLabel(product.stock)}</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="w-full bg-[#25D366] hover:bg-[#20bd5a] sm:w-auto" size="lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="glass w-full sm:w-auto">
                <a href={`tel:${product.sellerPhone}`}>
                  <Phone className="size-5" />
                  Appeler
                </a>
              </Button>
              <Button variant="outline" size="lg" className="glass w-full sm:w-auto">
                <Heart className="size-5" />
                Favoris
              </Button>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section ref={relatedRef} className="mt-20">
            <h2 data-apparition className="text-2xl font-bold opacity-0">
              Produits similaires
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <div key={p.id} data-apparition className="opacity-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
