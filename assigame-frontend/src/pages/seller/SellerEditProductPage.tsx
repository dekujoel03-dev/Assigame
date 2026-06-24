import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import type { Product } from '@/types'
import { sellerService } from '@/services/sellerService'
import { getApiErrorMessage } from '@/lib/apiErrors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(3, 'Nom requis (min. 3 caractères)').max(50, 'Maximum 50 caractères'),
  description: z.string().min(10, 'Description trop courte').max(200, 'Maximum 200 caractères'),
  price: z.number({ error: 'Prix invalide' }).min(1, 'Prix minimum : 1 FCFA'),
  stock: z.number({ error: 'Stock invalide' }).min(0, 'Le stock ne peut pas être négatif'),
  status: z.enum(['online', 'offline', 'pending']),
})

type FormData = z.infer<typeof schema>

export default function SellerEditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = Number(id)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setLoading(false)
      return
    }

    sellerService
      .getProductById(productId)
      .then((data) => {
        setProduct(data)
        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          status: data.status,
        })
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productId, reset])

  const onSubmit = async (data: FormData) => {
    if (!productId) return
    setError('')
    try {
      await sellerService.updateProductDetails(productId, data)
      navigate('/vendeur/produits')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la mise à jour du produit.'))
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold">Produit introuvable</h1>
        <Button asChild variant="outline" className="glass mt-4">
          <Link to="/vendeur/produits">Retour à mes produits</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to="/vendeur/produits"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Retour à mes produits
        </Link>
        <h1 className="text-2xl font-bold">Modifier le produit</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>

      <div className="glass-panel p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input id="name" className="glass" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} className="glass" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA)</Label>
              <Input
                id="price"
                type="number"
                min={1}
                className="glass"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock (quantité disponible)</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                className="glass"
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as FormData['status'], { shouldValidate: true })}
            >
              <SelectTrigger className="glass">
                <SelectValue placeholder="Choisir un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">En ligne</SelectItem>
                <SelectItem value="offline">Hors ligne</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="glass" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
