import { useEffect, useRef, useState } from 'react'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import type { Category } from '@/types'
import { adminService } from '@/services/adminService'
import { getApiErrorMessage } from '@/lib/apiErrors'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createImageFile, setCreateImageFile] = useState<File | null>(null)
  const [createImageUrl, setCreateImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState('')

  const ref = useRef<HTMLDivElement>(null)
  useApparitionAuDefilement(ref, { style: 'scaleIn', decalageMs: 90 })

  const load = () => {
    setLoading(true)
    adminService.getCategories().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setCreateError('')
    try {
      await adminService.createCategory({
        name: name.trim(),
        description: description.trim(),
        imageFile: createImageFile ?? undefined,
        imageUrl: createImageUrl.trim() || undefined,
      })
      setName('')
      setDescription('')
      setCreateImageFile(null)
      setCreateImageUrl('')
      load()
    } catch (err) {
      setCreateError(getApiErrorMessage(err, 'Impossible de créer la catégorie.'))
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setEditName(category.name)
    setEditDescription(category.description)
    setEditImageFile(null)
    setEditImageUrl('')
    setEditError('')
    setEditOpen(true)
  }

  const handleEdit = async () => {
    if (!selectedCategory || !editName.trim()) return
    setEditSubmitting(true)
    setEditError('')
    try {
      await adminService.updateCategory(selectedCategory.id, {
        name: editName.trim(),
        description: editDescription.trim(),
      })

      if (editImageFile || editImageUrl.trim()) {
        await adminService.uploadCategoryImage(selectedCategory.id, {
          file: editImageFile ?? undefined,
          imageUrl: editImageUrl.trim() || undefined,
        })
      }

      setEditOpen(false)
      load()
    } catch (err) {
      setEditError(getApiErrorMessage(err, 'Impossible de modifier la catégorie.'))
    } finally {
      setEditSubmitting(false)
    }
  }

  return (
    <div ref={ref} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Catégories</h1>
        <p className="text-muted-foreground">Gérez les catégories produits</p>
      </div>

      <div data-apparition className="glass-panel max-w-lg p-6 opacity-0 sm:p-8">
        <h2 className="mb-4 font-semibold">Nouvelle catégorie</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nom</Label>
            <Input id="cat-name" className="glass" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-desc">Description</Label>
            <Input id="cat-desc" className="glass" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-create-image-file">Photo (optionnel)</Label>
            <Input
              id="cat-create-image-file"
              type="file"
              accept="image/*"
              className="glass"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setCreateImageFile(file)
                if (file) setCreateImageUrl('')
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-create-image-url">Ou URL de l&apos;image</Label>
            <Input
              id="cat-create-image-url"
              className="glass"
              placeholder="https://images.unsplash.com/..."
              value={createImageUrl}
              onChange={(e) => {
                setCreateImageUrl(e.target.value)
                if (e.target.value.trim()) setCreateImageFile(null)
              }}
            />
          </div>
          {createError && <p className="text-sm text-red-500">{createError}</p>}
          <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={submitting}>
            <PlusCircle className="size-4" />
            {submitting ? 'Création...' : 'Ajouter'}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              data-apparition
              className="glass-card flex gap-4 p-5 opacity-0 transition-transform hover:-translate-y-0.5"
            >
              <img src={cat.image} alt={cat.name} className="size-16 rounded-xl object-cover ring-1 ring-white/80" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="glass size-8 shrink-0"
                    onClick={() => openEditDialog(cat)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{cat.description}</p>
                <p className="mt-2 text-xs font-medium text-primary">{cat.productCount} produits</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              {selectedCategory ? `Catégorie : ${selectedCategory.name}` : 'Mettez à jour le nom, la description et la photo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCategory && (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/50 p-3">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="size-14 rounded-lg object-cover"
                />
                <p className="text-sm text-muted-foreground">Photo actuelle</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-cat-name">Nom</Label>
              <Input
                id="edit-cat-name"
                className="glass"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cat-desc">Description</Label>
              <Input
                id="edit-cat-desc"
                className="glass"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cat-image-file" className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                Nouvelle photo
              </Label>
              <Input
                id="edit-cat-image-file"
                type="file"
                accept="image/*"
                className="glass"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setEditImageFile(file)
                  if (file) setEditImageUrl('')
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cat-image-url">Ou URL de l&apos;image</Label>
              <Input
                id="edit-cat-image-url"
                className="glass"
                placeholder="https://images.unsplash.com/..."
                value={editImageUrl}
                onChange={(e) => {
                  setEditImageUrl(e.target.value)
                  if (e.target.value.trim()) setEditImageFile(null)
                }}
              />
            </div>
            {editError && <p className="text-sm text-red-500">{editError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" className="glass" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90"
              disabled={editSubmitting || !editName.trim()}
              onClick={handleEdit}
            >
              {editSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
