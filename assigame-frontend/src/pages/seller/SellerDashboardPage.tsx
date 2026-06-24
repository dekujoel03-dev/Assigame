import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Boxes, Eye, Heart, Package, PlusCircle } from 'lucide-react'
import type { DashboardStats, Product } from '@/types'
import { sellerService } from '@/services/sellerService'
import { formatPrice } from '@/lib/utils'
import { formatStockLabel, getStockBadgeVariant } from '@/lib/stock'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductImage } from '@/components/products/ProductImage'

const statIcons = [Package, Boxes, Eye, Heart]

export default function SellerDashboardPage() {
  const [CHIFFRES_CLES, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useApparitionAuDefilement(ref, { style: 'scaleIn', decalageMs: 100 })

  useEffect(() => {
    setLoading(true)
    Promise.all([sellerService.getStats(), sellerService.getProducts()]).then(([s, p]) => {
      setStats(s)
      setProducts(p.slice(0, 5))
      setLoading(false)
    })
  }, [location.key])

  const statItems = CHIFFRES_CLES
    ? [
        { label: 'Produits', value: CHIFFRES_CLES.totalProducts, icon: statIcons[0] },
        { label: 'Stock total', value: CHIFFRES_CLES.totalStock.toLocaleString('fr-FR'), icon: statIcons[1] },
        { label: 'Vues', value: CHIFFRES_CLES.totalViews.toLocaleString('fr-FR'), icon: statIcons[2] },
        { label: 'Favoris', value: CHIFFRES_CLES.totalFavorites, icon: statIcons[3] },
      ]
    : []

  return (
    <div ref={ref} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue dans votre espace vendeur</p>
        </div>
        <Button asChild className="bg-secondary hover:bg-secondary/90">
          <Link to="/vendeur/produits/nouveau">
            <PlusCircle className="size-4" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : statItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                data-apparition
                className="glass-card flex items-center gap-4 p-6 opacity-0 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </div>
            ))}
      </div>

      <div data-apparition className="glass-panel p-6 opacity-0 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Produits récents</h2>
          <Button variant="outline" size="sm" asChild className="glass">
            <Link to="/vendeur/produits">Voir tout</Link>
          </Button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">Aucun produit pour le moment.</p>
        ) : (
          <div className="divide-y divide-border/60">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 py-4">
                <div className="size-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/80">
                  <ProductImage src={product.images[0]} alt={product.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-sm text-primary">{formatPrice(product.price)}</p>
                  <p className="text-xs text-muted-foreground">{formatStockLabel(product.stock)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant={product.status === 'online' ? 'default' : 'secondary'}>
                    {product.status === 'online' ? 'En ligne' : product.status === 'pending' ? 'En attente' : 'Hors ligne'}
                  </Badge>
                  <Badge variant={getStockBadgeVariant(product.stock, product.status)}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
