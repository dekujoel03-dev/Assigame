export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'

function buildImageQuery(version?: string | number, thumb?: boolean): string {
  const params = new URLSearchParams()
  if (version !== undefined && version !== '') {
    params.set('v', String(version))
  }
  if (thumb) {
    params.set('thumb', '1')
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function isApiImageUrl(src: string): boolean {
  return /\/(produit|categorieproduit)\/\d+\/image/.test(src)
}

export function withThumbParam(src: string): string {
  if (!isApiImageUrl(src) || src.includes('thumb=')) {
    return src
  }
  return `${src}${src.includes('?') ? '&' : '?'}thumb=1`
}

export function getProductImageUrl(
  productId: number,
  version?: string,
  options?: { thumb?: boolean },
): string {
  const query = buildImageQuery(version, options?.thumb)
  if (import.meta.env.DEV) {
    return `/api/produit/${productId}/image${query}`
  }
  return `${API_ORIGIN}/api/produit/${productId}/image${query}`
}

export function getCategoryImageUrl(
  categoryId: number,
  version?: string | number,
  options?: { thumb?: boolean },
): string {
  const query = buildImageQuery(version, options?.thumb)
  if (import.meta.env.DEV) {
    return `/api/categorieproduit/${categoryId}/image${query}`
  }
  return `${API_ORIGIN}/api/categorieproduit/${categoryId}/image${query}`
}
