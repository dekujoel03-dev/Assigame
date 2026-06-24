import { useEffect, useRef, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import type { Product } from '@/types'
import { adminService } from '@/services/adminService'
import { formatPrice } from '@/lib/utils'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductImage } from '@/components/products/ProductImage'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  useApparitionAuDefilement(ref, { style: 'fadeUp' })

  const load = (q = search) => {
    setLoading(true)
    adminService.getProducts(1, 20, q).then((res) => {
      setProducts(res.data)
      setTotal(res.total)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    await adminService.deleteProduct(id)
    load()
  }

  return (
    <div ref={ref} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Produits</h1>
        <p className="text-muted-foreground">{total} produit{total > 1 ? 's' : ''} sur la plateforme</p>
      </div>

      <div data-apparition className="relative max-w-md opacity-0">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="glass pl-10"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(search)}
        />
      </div>

      {loading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <div data-apparition className="glass-panel overflow-hidden opacity-0">
          <div className="space-y-3 p-4 md:hidden">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border/60 bg-white/60 p-4">
                <div className="flex gap-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.categoryName} · {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">{product.sellerName}</p>
                    <Badge className="mt-2" variant={product.status === 'online' ? 'default' : 'secondary'}>
                      {product.status === 'online' ? 'En ligne' : 'Hors ligne'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="icon" className="glass" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Vendeur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage src={product.images[0]} alt={product.name} />
                      </div>
                      <span className="max-w-[180px] truncate font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.sellerName}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'online' ? 'default' : 'secondary'}>
                      {product.status === 'online' ? 'En ligne' : 'Hors ligne'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" className="glass" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      )}
    </div>
  )
}
