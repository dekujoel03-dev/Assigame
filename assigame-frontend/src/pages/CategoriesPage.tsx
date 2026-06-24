import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/types'
import { categoryService } from '@/services/productService'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { EnTetePage, SectionPage } from '@/components/layout/MiseEnPage'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryService.getAll().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <EnTetePage
        badge="Catalogue"
        title="Toutes les catégories"
        description="Parcourez les univers produits disponibles sur Assigamé, partout au Togo."
      />
      <SectionPage style="scaleIn">
        <CategoryGrid categories={categories} loading={loading} />
        <div
          data-apparition
          className="glass-panel mt-14 flex flex-col items-center gap-4 p-8 text-center opacity-0 sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <h2 className="text-xl font-bold">Vous cherchez un produit précis ?</h2>
            <p className="mt-1 text-muted-foreground">Explorez notre catalogue complet.</p>
          </div>
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Voir tous les produits
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </SectionPage>
    </>
  )
}
