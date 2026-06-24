export interface ApiCategorieProduit {
  idcategorie_produit: number
  nom_categorieproduit: string
  description?: string
  has_image?: boolean
  image_version?: number
}

export interface ApiTypeUtilisateur {
  id_type_utilisateur: number
  libelle_type_utilisateur: string
  description_type_utilisateur?: string
}

export interface ApiUtilisateur {
  id_utilisateur: number
  nom_utilisateur: string
  prenom_utilisateur: string
  sexe_utilisateur: string
  telephone_utilisateur: string
  mail_utilisateur: string
  login_utilisateur: string
  residence_utilisateur?: string
  type_utilisateur?: ApiTypeUtilisateur
}

export interface ApiProduit {
  id_produit: number
  nom_produit: string
  description?: string
  prix?: number
  image_type?: string
  has_image?: boolean
  image_version?: number
  date_ajout?: string
  statut: string
  quantite_stock?: number
  categorie_produit?: ApiCategorieProduit
  utilisateur?: ApiUtilisateur
}

export interface ApiAuthResponse {
  token: string
  user: ApiUtilisateur
}
