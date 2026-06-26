import type { ApiCategorieProduit, ApiProduit, ApiUtilisateur } from '@/types/api'
import type { Category, Product, Seller, User, UserRole } from '@/types'
import { DEFAULT_PRODUCT_IMAGE, getCategoryImageUrl, getProductImageUrl } from '@/lib/apiConfig'
import { getCategoryImageMeta } from '@/lib/images'
import { slugify } from '@/lib/utils'

function mapUserRole(type?: { libelle_type_utilisateur?: string }): UserRole {
  const label = type?.libelle_type_utilisateur?.trim().toLowerCase() ?? ''
  if (label === 'administrateur') return 'admin'
  return 'seller'
}

function mapProductStatus(statut: string): Product['status'] {
  const value = statut.toLowerCase()
  if (value.includes('inactif') || value.includes('offline') || value.includes('hors')) {
    return 'offline'
  }
  if (value.includes('pending') || value.includes('attente')) {
    return 'pending'
  }
  return 'online'
}

function isProductAvailable(statut: string): boolean {
  return mapProductStatus(statut) === 'online'
}

export function mapUser(apiUser: ApiUtilisateur): User {
  return {
    id: apiUser.id_utilisateur,
    nom: apiUser.nom_utilisateur,
    prenom: apiUser.prenom_utilisateur,
    email: apiUser.mail_utilisateur,
    telephone: apiUser.telephone_utilisateur,
    ville: apiUser.residence_utilisateur ?? 'Lomé',
    role: mapUserRole(apiUser.type_utilisateur),
    verified: true,
  }
}

export function mapSeller(apiUser: ApiUtilisateur, productCount = 0): Seller {
  return {
    id: apiUser.id_utilisateur,
    name: `${apiUser.prenom_utilisateur} ${apiUser.nom_utilisateur}`.trim(),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    ville: apiUser.residence_utilisateur ?? 'Lomé',
    telephone: apiUser.telephone_utilisateur,
    verified: true,
    rating: 4.5,
    productCount,
    totalViews: 0,
  }
}

export function mapCategory(
  apiCategory: ApiCategorieProduit,
  productCount = 0,
): Category {
  const name = apiCategory.nom_categorieproduit
  const slug = slugify(name)
  const hasImage = Boolean(apiCategory.has_image || apiCategory.image_version)
  const imageMeta = getCategoryImageMeta(slug)

  return {
    id: apiCategory.idcategorie_produit,
    name,
    slug,
    description: apiCategory.description ?? '',
    image: hasImage
      ? getCategoryImageUrl(apiCategory.idcategorie_produit, apiCategory.image_version)
      : imageMeta.src,
    productCount,
  }
}

export function mapProduct(apiProduct: ApiProduit): Product {
  const categoryName = apiProduct.categorie_produit?.nom_categorieproduit ?? 'Autre'
  const seller = apiProduct.utilisateur
  const sellerName = seller
    ? `${seller.prenom_utilisateur} ${seller.nom_utilisateur}`.trim()
    : 'Vendeur Assigamé'

  const hasImage = Boolean(apiProduct.has_image || apiProduct.image_type)
  const imageVersion = String(apiProduct.image_version ?? apiProduct.id_produit)

  return {
    id: apiProduct.id_produit,
    name: apiProduct.nom_produit,
    slug: slugify(apiProduct.nom_produit),
    description: apiProduct.description ?? '',
    price: apiProduct.prix ?? 0,
    images: hasImage
      ? [getProductImageUrl(apiProduct.id_produit, imageVersion)]
      : [DEFAULT_PRODUCT_IMAGE],
    categoryId: apiProduct.categorie_produit?.idcategorie_produit ?? 0,
    categoryName,
    sellerId: seller?.id_utilisateur ?? 0,
    sellerName,
    sellerPhone: seller?.telephone_utilisateur ?? '',
    ville: seller?.residence_utilisateur ?? 'Lomé',
    stock: apiProduct.quantite_stock ?? 0,
    available: isProductAvailable(apiProduct.statut) && (apiProduct.quantite_stock ?? 0) > 0,
    rating: 4.5,
    reviewCount: 0,
    views: 0,
    favorites: 0,
    createdAt: apiProduct.date_ajout ?? new Date().toISOString(),
    status: mapProductStatus(apiProduct.statut),
  }
}

export function toBackendStatut(status: Product['status']): string {
  if (status === 'offline') return 'inactif'
  if (status === 'pending') return 'en_attente'
  return 'actif'
}
