import type { ApiCategorieProduit, ApiProduit } from '@/types/api'
import type { Category, PaginatedResponse, Product, ProductFilters } from '@/types'
import { mapCategory, mapProduct } from '@/lib/mappers'
import api from '@/services/api'

const CATALOG_CACHE_MS = 60_000

let productsCache: { data: Product[]; expiresAt: number } | null = null
let categoriesCache: { data: Category[]; expiresAt: number } | null = null
let productsFetchPromise: Promise<Product[]> | null = null
let categoriesFetchPromise: Promise<Category[]> | null = null

export function invalidateCatalogCache(): void {
  productsCache = null
  categoriesCache = null
  productsFetchPromise = null
  categoriesFetchPromise = null
}

async function fetchProducts(): Promise<Product[]> {
  const now = Date.now()
  if (productsCache && now < productsCache.expiresAt) {
    return productsCache.data
  }

  if (productsFetchPromise) {
    return productsFetchPromise
  }

  productsFetchPromise = (async () => {
    try {
      const { data } = await api.get<ApiProduit[]>('/produit/list')
      const products = data.map(mapProduct)
      productsCache = { data: products, expiresAt: Date.now() + CATALOG_CACHE_MS }
      return products
    } finally {
      productsFetchPromise = null
    }
  })()

  return productsFetchPromise
}

/** Produits visibles sur le site public (en ligne uniquement). */
function filterPublicProducts(products: Product[]): Product[] {
  return products.filter((product) => product.status === 'online')
}

async function fetchCategoriesWithCounts(): Promise<Category[]> {
  const now = Date.now()
  if (categoriesCache && now < categoriesCache.expiresAt) {
    return categoriesCache.data
  }

  if (categoriesFetchPromise) {
    return categoriesFetchPromise
  }

  categoriesFetchPromise = (async () => {
    try {
      const [{ data: categories }, products] = await Promise.all([
        api.get<ApiCategorieProduit[]>('/categorieproduit/list'),
        fetchProducts(),
      ])

      const publicProducts = filterPublicProducts(products)

      const mapped = categories.map((category) => {
        const productCount = publicProducts.filter(
          (product) => product.categoryId === category.idcategorie_produit,
        ).length
        return mapCategory(category, productCount)
      })

      categoriesCache = { data: mapped, expiresAt: Date.now() + CATALOG_CACHE_MS }
      return mapped
    } finally {
      categoriesFetchPromise = null
    }
  })()

  return categoriesFetchPromise
}

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    )
  }

  if (filters.category) {
    result = result.filter(
      (p) => p.categoryName === filters.category || String(p.categoryId) === filters.category,
    )
  }

  if (filters.city) {
    result = result.filter((p) => p.ville === filters.city)
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.available) {
    result = result.filter((p) => p.available)
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      result.sort((a, b) => b.views - a.views)
      break
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return result
}

export const productService = {
  async getAll(filters: ProductFilters = {}, page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> {
    const allProducts = filterPublicProducts(await fetchProducts())
    const filtered = filterProducts(allProducts, filters)
    const start = (page - 1) * pageSize
    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    }
  },

  async getById(id: number): Promise<Product | null> {
    try {
      const { data } = await api.get<ApiProduit>(`/produit/${id}`)
      return mapProduct(data)
    } catch {
      return null
    }
  },

  async getByIdOrSlug(idOrSlug: string, options: { publicOnly?: boolean } = { publicOnly: true }): Promise<Product | null> {
    let product: Product | null = null

    if (/^\d+$/.test(idOrSlug)) {
      product = await this.getById(Number(idOrSlug))
    } else {
      const products = await fetchProducts()
      product = products.find((p) => p.slug === idOrSlug) ?? null
    }

    if (!product) return null
    if (options.publicOnly && product.status !== 'online') return null
    return product
  },

  /** @deprecated Préférer getByIdOrSlug — conservé pour compatibilité slugs anciens. */
  async getBySlug(slug: string): Promise<Product | null> {
    return this.getByIdOrSlug(slug)
  },

  async getTrending(limit = 4): Promise<Product[]> {
    const products = filterPublicProducts(await fetchProducts())
    return products.filter((p) => p.available).slice(0, limit)
  },

  async getRecent(limit = 8): Promise<Product[]> {
    const products = filterPublicProducts(await fetchProducts())
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  },

  async getFeatured(limit = 4): Promise<Product[]> {
    const products = filterPublicProducts(await fetchProducts())
    return products.filter((p) => p.available).slice(0, limit)
  },

  async getBySeller(sellerId: number): Promise<Product[]> {
    const products = filterPublicProducts(await fetchProducts())
    return products.filter((p) => p.sellerId === sellerId)
  },
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return fetchCategoriesWithCounts()
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = await fetchCategoriesWithCounts()
    return categories.find((c) => c.slug === slug) ?? null
  },

  async getById(id: number): Promise<Category | null> {
    const categories = await fetchCategoriesWithCounts()
    return categories.find((c) => c.id === id) ?? null
  },
}
