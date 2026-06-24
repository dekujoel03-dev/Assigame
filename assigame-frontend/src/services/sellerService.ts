import type { ApiProduit } from '@/types/api'
import type { DashboardStats, Product, ProductEditFormData, ProductFormData } from '@/types'
import { mapProduct, toBackendStatut } from '@/lib/mappers'
import { authService } from '@/services/authService'
import { invalidateCatalogCache } from '@/services/productService'
import api from '@/services/api'

function getCurrentSellerId(): number {
  const user = authService.getCurrentUser()
  if (!user) throw new Error('Utilisateur non connecté')
  return user.id
}

function appendImageToFormData(formData: FormData, file?: File, imageUrl?: string) {
  if (file) {
    formData.append('file', file)
    return
  }
  if (imageUrl?.trim()) {
    formData.append('image_url', imageUrl.trim())
  }
}

export const sellerService = {
  async getStats(): Promise<DashboardStats> {
    const products = await this.getProducts()
    return {
      totalProducts: products.length,
      totalStock: products.reduce((sum, product) => sum + product.stock, 0),
      outOfStockCount: products.filter((product) => product.stock === 0).length,
      totalViews: products.reduce((sum, product) => sum + product.views, 0),
      totalOrders: 0,
      totalFavorites: products.reduce((sum, product) => sum + product.favorites, 0),
    }
  },

  async getProducts(): Promise<Product[]> {
    const sellerId = getCurrentSellerId()
    const { data } = await api.get<ApiProduit[]>('/produit/list', {
      headers: { 'Cache-Control': 'no-cache' },
      params: { _t: Date.now() },
    })
    return data
      .filter((product) => product.utilisateur?.id_utilisateur === sellerId)
      .map(mapProduct)
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const sellerId = getCurrentSellerId()
    const formData = new FormData()
    formData.append('nom_produit', data.name)
    formData.append('statut', 'actif')
    formData.append('description', data.description)
    formData.append('prix', String(data.price))
    formData.append('quantite_stock', String(data.stock))
    formData.append('id_categorie', String(data.categoryId))
    formData.append('id_utilisateur', String(sellerId))
    appendImageToFormData(formData, data.imageFile, data.images[0])

    const { data: created } = await api.post<ApiProduit>('/produit/add', formData)
    invalidateCatalogCache()
    return mapProduct(created)
  },

  async getProductById(id: number): Promise<Product> {
    const sellerId = getCurrentSellerId()
    const { data } = await api.get<ApiProduit>(`/produit/${id}`, {
      headers: { 'Cache-Control': 'no-cache' },
      params: { _t: Date.now() },
    })
    const product = mapProduct(data)
    if (product.sellerId !== sellerId) {
      throw new Error('Produit introuvable')
    }
    return product
  },

  async updateProductDetails(id: number, data: ProductEditFormData): Promise<Product> {
    const formData = new FormData()
    formData.append('nom_produit', data.name)
    formData.append('description', data.description)
    formData.append('prix', String(data.price))
    formData.append('quantite_stock', String(data.stock))
    formData.append('statut', toBackendStatut(data.status))

    const { data: updated } = await api.put<ApiProduit>(`/produit/update/${id}`, formData)
    invalidateCatalogCache()
    return mapProduct(updated)
  },

  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const formData = new FormData()
    if (data.name) formData.append('nom_produit', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.price !== undefined) formData.append('prix', String(data.price))
    if (data.categoryId) formData.append('id_categorie', String(data.categoryId))
    appendImageToFormData(formData, data.imageFile, data.images?.[0])

    const { data: updated } = await api.put<ApiProduit>(`/produit/update/${id}`, formData)
    invalidateCatalogCache()
    return mapProduct(updated)
  },

  async uploadProductImage(id: number, options: { file?: File; imageUrl?: string }): Promise<Product> {
    const formData = new FormData()
    appendImageToFormData(formData, options.file, options.imageUrl)

    if (!formData.has('file') && !formData.has('image_url')) {
      throw new Error('Fichier ou URL image requis')
    }

    const { data: updated } = await api.post<ApiProduit>(`/produit/${id}/upload-image`, formData)
    invalidateCatalogCache()
    return mapProduct(updated)
  },

  async updateProductImageFromUrl(id: number, imageUrl: string): Promise<Product> {
    return this.uploadProductImage(id, { imageUrl })
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/produit/delete/${id}`)
    invalidateCatalogCache()
  },

  async toggleStatus(id: number): Promise<Product> {
    const products = await this.getProducts()
    const product = products.find((item) => item.id === id)
    if (!product) throw new Error('Produit introuvable')

    const nextStatus = product.status === 'online' ? 'offline' : 'online'
    const formData = new FormData()
    formData.append('statut', toBackendStatut(nextStatus))

    const { data: updated } = await api.put<ApiProduit>(`/produit/update/${id}`, formData)
    invalidateCatalogCache()
    return mapProduct(updated)
  },
}
