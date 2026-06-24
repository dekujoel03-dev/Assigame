import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Category, Product, ProductFilters as Filters } from '@/types'
import { categoryService, productService } from '@/services/productService'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'
import { EnTetePage, SectionPage } from '@/components/layout/MiseEnPage'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const filters: Filters = {
    category: searchParams.get('category') ?? undefined,
    city: searchParams.get('city') ?? undefined,
    search: searchParams.get('q') ?? undefined,
    sort: (searchParams.get('sort') as Filters['sort']) ?? 'recent',
    available: searchParams.get('available') === 'true' ? true : undefined,
  }

  useEffect(() => {
    categoryService.getAll().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    productService.getAll(filters, page, 12).then((res) => {
      setProducts(res.data)
      setTotal(res.total)
      setLoading(false)
    })
  }, [searchParams, page])

  const handleFiltersChange = (next: Filters) => {
    const params = new URLSearchParams()
    if (next.category) params.set('category', next.category)
    if (next.city) params.set('city', next.city)
    if (next.search) params.set('q', next.search)
    if (next.sort) params.set('sort', next.sort)
    if (next.available) params.set('available', 'true')
    setSearchParams(params)
    setPage(1)
  }

  const totalPages = Math.ceil(total / 12)

  return (
    <>
      <EnTetePage
        badge="Boutique"
        title="Produits"
        description="produits disponibles sur Assigamé"
      >
        <div className="flex flex-wrap items-center justify-start gap-3">
          <Select
            value={filters.sort ?? 'recent'}
            onValueChange={(sort) => handleFiltersChange({ ...filters, sort: sort as Filters['sort'] })}
          >
            <SelectTrigger className="glass w-48 border-white/60 max-sm:w-full">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="popular">Plus populaires</SelectItem>
            </SelectContent>
          </Select>

          <ProductFilters
            filters={filters}
            categories={categories}
            onChange={handleFiltersChange}
            className="max-sm:w-full sm:w-auto"
          />
        </div>
      </EnTetePage>

      <SectionPage>
        <div data-products-grid data-apparition className="opacity-0">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel py-16 text-center">
              <p className="text-lg font-medium">Aucun produit trouvé</p>
              <p className="mt-2 text-muted-foreground">Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Précédent
              </Button>
              <span className="glass flex items-center rounded-xl px-4 text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Suivant
              </Button>
            </div>
          )}
        </div>
      </SectionPage>
    </>
  )
}
