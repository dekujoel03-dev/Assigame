/** Redirige uniquement vers un chemin interne sûr (évite les open redirects). */
export function getSafeRedirectPath(path?: string): string | undefined {
  if (!path) return undefined
  if (!path.startsWith('/') || path.startsWith('//')) return undefined
  if (path.includes('://')) return undefined
  return path
}

export function getDefaultAppPath(role: 'admin' | 'seller'): string {
  return role === 'admin' ? '/admin' : '/vendeur'
}
