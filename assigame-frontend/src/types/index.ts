export type UserRole = 'seller' | 'admin'

export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  ville: string
  role: UserRole
  avatar?: string
  verified?: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

export interface Seller {
  id: number
  name: string
  avatar: string
  ville: string
  telephone: string
  verified: boolean
  rating: number
  productCount: number
  totalViews: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  categoryId: number
  categoryName: string
  sellerId: number
  sellerName: string
  sellerPhone: string
  ville: string
  stock: number
  available: boolean
  rating: number
  reviewCount: number
  views: number
  favorites: number
  trending?: boolean
  featured?: boolean
  createdAt: string
  status: 'online' | 'offline' | 'pending'
}

export interface Activity {
  id: number
  type: 'seller' | 'product' | 'order'
  message: string
  timestamp: string
}

export interface DashboardStats {
  totalProducts: number
  totalStock: number
  outOfStockCount: number
  totalViews: number
  totalOrders: number
  totalFavorites: number
}

export interface AdminStats {
  totalUsers: number
  totalSellers: number
  totalProducts: number
  totalCategories: number
}

export interface ProductFilters {
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  available?: boolean
  search?: string
  sort?: 'recent' | 'price-asc' | 'price-desc' | 'popular'
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  nom: string
  prenom: string
  telephone: string
  email: string
  password: string
  ville: string
}

export interface ProductEditFormData {
  name: string
  description: string
  price: number
  stock: number
  status: Product['status']
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  categoryId: number
  ville: string
  stock: number
  images: string[]
  imageFile?: File
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
