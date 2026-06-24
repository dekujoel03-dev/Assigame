import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Category } from '@/types'
import { categoryService } from '@/services/productService'
import { sellerService } from '@/services/sellerService'
import { CITIES } from '@/lib/constants'
import { getApiErrorMessage } from '@/lib/apiErrors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(3, 'Nom requis'),
  description: z.string().min(10, 'Description trop courte'),
  price: z.number({ error: 'Prix invalide (minimum 1 FCFA)' }).min(1, 'Prix invalide (minimum 1 FCFA)'),
  categoryId: z.number().min(1, 'Catégorie requise'),
  ville: z.string().min(1, 'Ville requise'),
  stock: z.number().min(0, 'Stock invalide'),
  imageUrl: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function SellerAddProductPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stock: 1, ville: 'Lomé', categoryId: 0 },
  })

  useEffect(() => {
    categoryService.getAll().then(setCategories)
  }, [])

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      await sellerService.createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        ville: data.ville,
        stock: data.stock,
        images: data.imageUrl ? [data.imageUrl] : [],
        imageFile: imageFile ?? undefined,
      })
      navigate('/vendeur/produits')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la création du produit.'))
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ajouter un produit</h1>
        <p className="text-muted-foreground">Publiez un nouveau produit sur Assigamé</p>
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
              <Input id="price" type="number" min={1} className="glass" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" className="glass" {...register('stock', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={watch('categoryId') ? String(watch('categoryId')) : ''}
                onValueChange={(v) => setValue('categoryId', Number(v), { shouldValidate: true })}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Ville</Label>
              <Select value={watch('ville')} onValueChange={(v) => setValue('ville', v)}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Image (fichier)</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              className="glass"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Ou URL image (optionnel)</Label>
            <Input id="imageUrl" className="glass" placeholder="https://..." {...register('imageUrl')} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="glass" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
              {isSubmitting ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
