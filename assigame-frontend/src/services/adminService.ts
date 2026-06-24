import type { ApiCategorieProduit, ApiProduit, ApiUtilisateur } from '@/types/api'
import type { Activity, AdminStats, Category, Product, Seller } from '@/types'
import { mapCategory, mapProduct, mapSeller } from '@/lib/mappers'
import { invalidateCatalogCache } from '@/services/productService'
import api from '@/services/api'

function appendImageToFormData(formData: FormData, file?: File, imageUrl?: string) {
  if (file) {
    formData.append('file', file)
  } else if (imageUrl?.trim()) {
    formData.append('image_url', imageUrl.trim())
  }
}

function isSeller(user: ApiUtilisateur): boolean {
  const label = user.type_utilisateur?.libelle_type_utilisateur?.toLowerCase() ?? ''
  return !label.includes('admin')
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const [usersRes, productsRes, categoriesRes] = await Promise.all([
      api.get<ApiUtilisateur[]>('/users/list'),
      api.get<ApiProduit[]>('/produit/list'),
      api.get<ApiCategorieProduit[]>('/categorieproduit/list'),
    ])

    const sellers = usersRes.data.filter(isSeller)

    return {
      totalUsers: usersRes.data.length,
      totalSellers: sellers.length,
      totalProducts: productsRes.data.length,
      totalCategories: categoriesRes.data.length,
    }
  },

  async getActivities(): Promise<Activity[]> {
    const { data: products } = await api.get<ApiProduit[]>('/produit/list')
    return products.slice(0, 6).map((product, index) => ({
      id: index + 1,
      type: 'product' as const,
      message: `Produit : ${product.nom_produit}`,
      timestamp: product.date_ajout ?? new Date().toISOString(),
    }))
  },

  async getSellers(page = 1, pageSize = 10, search = ''): Promise<{ data: Seller[]; total: number }> {
    const [{ data: users }, { data: products }] = await Promise.all([
      api.get<ApiUtilisateur[]>('/users/list'),
      api.get<ApiProduit[]>('/produit/list'),
    ])

    let sellers = users.filter(isSeller).map((user) => {
      const productCount = products.filter(
        (product) => product.utilisateur?.id_utilisateur === user.id_utilisateur,
      ).length
      return mapSeller(user, productCount)
    })

    if (search) {
      const q = search.toLowerCase()
      sellers = sellers.filter(
        (seller) => seller.name.toLowerCase().includes(q) || seller.ville.toLowerCase().includes(q),
      )
    }

    const start = (page - 1) * pageSize
    return { data: sellers.slice(start, start + pageSize), total: sellers.length }
  },

  async getProducts(page = 1, pageSize = 10, search = ''): Promise<{ data: Product[]; total: number }> {
    const { data } = await api.get<ApiProduit[]>('/produit/list')
    let products = data.map(mapProduct)

    if (search) {
      const q = search.toLowerCase()
      products = products.filter((product) => product.name.toLowerCase().includes(q))
    }

    const start = (page - 1) * pageSize
    return { data: products.slice(start, start + pageSize), total: products.length }
  },

  async getCategories(): Promise<Category[]> {
    const [{ data: categories }, { data: products }] = await Promise.all([
      api.get<ApiCategorieProduit[]>('/categorieproduit/list', {
        headers: { 'Cache-Control': 'no-cache' },
        params: { _t: Date.now() },
      }),
      api.get<ApiProduit[]>('/produit/list'),
    ])

    return categories.map((category) => {
      const productCount = products.filter(
        (product) => product.categorie_produit?.idcategorie_produit === category.idcategorie_produit,
      ).length
      return mapCategory(category, productCount)
    })
  },

  async toggleSellerVerification(id: number): Promise<Seller> {
    const { data: users } = await api.get<ApiUtilisateur[]>('/users/list')
    const user = users.find((item) => item.id_utilisateur === id)
    if (!user) throw new Error('Vendeur introuvable')
    return mapSeller(user)
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/produit/delete/${id}`)
    invalidateCatalogCache()
  },

  async createCategory(data: {
    name: string
    description: string
    imageFile?: File
    imageUrl?: string
  }): Promise<Category> {
    const { data: created } = await api.post<ApiCategorieProduit>('/categorieproduit/add', {
      nom_categorieproduit: data.name,
      description: data.description,
    })

    if (data.imageFile || data.imageUrl?.trim()) {
      const category = await this.uploadCategoryImage(created.idcategorie_produit, {
        file: data.imageFile,
        imageUrl: data.imageUrl,
      })
      invalidateCatalogCache()
      return category
    }

    invalidateCatalogCache()
    return mapCategory(created)
  },

  async updateCategory(
    id: number,
    data: { name: string; description: string },
  ): Promise<Category> {
    const { data: updated } = await api.put<ApiCategorieProduit>(`/categorieproduit/update/${id}`, {
      nom_categorieproduit: data.name,
      description: data.description,
    })
    invalidateCatalogCache()
    return mapCategory(updated)
  },

  async uploadCategoryImage(
    id: number,
    options: { file?: File; imageUrl?: string },
  ): Promise<Category> {
    const formData = new FormData()
    appendImageToFormData(formData, options.file, options.imageUrl)

    if (!formData.has('file') && !formData.has('image_url')) {
      throw new Error('Fichier ou URL image requis')
    }

    const { data: updated } = await api.post<ApiCategorieProduit>(
      `/categorieproduit/${id}/upload-image`,
      formData,
    )
    invalidateCatalogCache()
    return mapCategory(updated)
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categorieproduit/delete/${id}`)
    invalidateCatalogCache()
  },
}
