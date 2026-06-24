import type { Product } from '@/types'

export function formatStockLabel(stock: number): string {
  if (stock <= 0) return 'Rupture de stock'
  if (stock === 1) return '1 unité en stock'
  return `${stock} unités en stock`
}

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= 5
}

export function getStockBadgeVariant(
  stock: number,
  status: Product['status'],
): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status !== 'online') return 'secondary'
  if (stock <= 0) return 'destructive'
  if (isLowStock(stock)) return 'outline'
  return 'default'
}
