import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ImageIcon, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import type { Product } from '@/types'
import { sellerService } from '@/services/sellerService'
import { formatPrice } from '@/lib/utils'
import { formatStockLabel, getStockBadgeVariant } from '@/lib/stock'
import { getApiErrorMessage } from '@/lib/apiErrors'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductImage } from '@/components/products/ProductImage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState('')
  const [imageSubmitting, setImageSubmitting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useApparitionAuDefilement(ref, { style: 'fadeUp' })

  const load = () => {
    setLoading(true)
    sellerService.getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [location.key])

  const handleToggle = async (id: number) => {
    await sellerService.toggleStatus(id)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    await sellerService.deleteProduct(id)
    load()
  }

  const openImageDialog = (product: Product) => {
    setSelectedProduct(product)
    setImageUrl('')
    setImageFile(null)
    setImageError('')
    setImageDialogOpen(true)
  }

  const handleImageUpdate = async () => {
    if (!selectedProduct || (!imageFile && !imageUrl.trim())) {
      setImageError('Choisissez un fichier ou saisissez une URL.')
      return
    }

    setImageSubmitting(true)
    setImageError('')
    try {
      await sellerService.uploadProductImage(selectedProduct.id, {
        file: imageFile ?? undefined,
        imageUrl: imageUrl.trim() || undefined,
      })
      setImageDialogOpen(false)
      load()
    } catch (err) {
      setImageError(getApiErrorMessage(err, 'Impossible d\'enregistrer cette image.'))
    } finally {
      setImageSubmitting(false)
    }
  }

  return (
    <div ref={ref} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes produits</h1>
          <p className="text-muted-foreground">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <Button asChild className="bg-secondary hover:bg-secondary/90">
          <Link to="/vendeur/produits/nouveau">
            <PlusCircle className="size-4" />
            Ajouter
          </Link>
        </Button>
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
                      {formatPrice(product.price)} · {formatStockLabel(product.stock)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant={product.status === 'online' ? 'default' : 'secondary'}>
                        {product.status === 'online' ? 'En ligne' : product.status === 'pending' ? 'En attente' : 'Hors ligne'}
                      </Badge>
                      <Badge variant={getStockBadgeVariant(product.stock, product.status)}>
                        {product.stock}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="glass flex-1 sm:flex-none" onClick={() => handleToggle(product.id)}>
                    {product.status === 'online' ? 'Désactiver' : 'Activer'}
                  </Button>
                  <Button variant="outline" size="icon" className="glass" onClick={() => openImageDialog(product)}>
                    <ImageIcon className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" asChild className="glass">
                    <Link to={`/vendeur/produits/${product.id}/modifier`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
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
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
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
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(product.stock, product.status)}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'online' ? 'default' : 'secondary'}>
                      {product.status === 'online' ? 'En ligne' : 'Hors ligne'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="glass" onClick={() => handleToggle(product.id)}>
                        {product.status === 'online' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button variant="outline" size="icon" className="glass" onClick={() => openImageDialog(product)}>
                        <ImageIcon className="size-4" />
                      </Button>
                      <Button variant="outline" size="icon" asChild className="glass">
                        <Link to={`/vendeur/produits/${product.id}/modifier`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" className="glass" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      )}

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer l&apos;image</DialogTitle>
            <DialogDescription>
              {selectedProduct ? `Produit : ${selectedProduct.name}` : 'Collez une URL d\'image publique.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-image-file">Fichier image</Label>
              <Input
                id="product-image-file"
                type="file"
                accept="image/*"
                className="glass"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setImageFile(file)
                  if (file) setImageUrl('')
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image-url">Ou URL de l&apos;image</Label>
              <Input
                id="product-image-url"
                className="glass"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  if (e.target.value.trim()) setImageFile(null)
                }}
              />
            </div>
            {imageError && <p className="text-sm text-red-500">{imageError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" className="glass" onClick={() => setImageDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90"
              disabled={imageSubmitting}
              onClick={handleImageUpdate}
            >
              {imageSubmitting ? 'Mise à jour...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
