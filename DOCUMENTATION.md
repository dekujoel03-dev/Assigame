# Assigamé — Documentation du projet

Marketplace togolaise connectant acheteurs et vendeurs. Le projet est composé d’un **backend Spring Boot** (API REST) et d’un **frontend React** (Vite).

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture](#2-architecture)
3. [Stack technique](#3-stack-technique)
4. [Structure du projet](#4-structure-du-projet)
5. [Prérequis](#5-prérequis)
6. [Installation et démarrage](#6-installation-et-démarrage)
7. [Configuration](#7-configuration)
8. [Base de données](#8-base-de-données)
9. [API REST](#9-api-rest)
10. [Gestion des images](#10-gestion-des-images)
11. [Frontend — routes et rôles](#11-frontend--routes-et-rôles)
12. [Interface responsive](#12-interface-responsive)
13. [Comptes de démonstration](#13-comptes-de-démonstration)
14. [Flux métier principaux](#14-flux-métier-principaux)
15. [Dépannage](#15-dépannage)
16. [Tests Postman](#16-tests-postman)

---

## 1. Vue d'ensemble

**Assigamé** permet de :

- Parcourir des produits par catégorie (public)
- S'inscrire et gérer un espace **vendeur** (ajout, modification, images)
- Administrer la plateforme via un espace **admin**
- Contacter les vendeurs (WhatsApp côté UI)

Les données sont persistées dans **PostgreSQL**. Les images **produits** et **catégories** sont stockées en base (`bytea`), pas sur un service externe (S3/MinIO). Le serveur génère des **miniatures** à la volée pour accélérer l'affichage des grilles.

---

## 2. Architecture

```
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│  Frontend React     │  HTTP   │  Backend Spring     │  JDBC   │  PostgreSQL      │
│  localhost:5173     │ ──────► │  localhost:8080     │ ──────► │  dbassigame      │
│  (Vite + proxy /api)│         │  REST API /api/*    │         │                  │
└─────────────────────┘         └─────────────────────┘         └──────────────────┘
```

**En développement**, le frontend proxyfie `/api` vers `http://localhost:8080` (voir `vite.config.ts`).

**Flux image (produit ou catégorie) :**

```
Upload (FormData)  →  POST /api/produit/add | /upload-image
                      POST /api/categorieproduit/{id}/upload-image
                      →  image stockée en bytea + image_type

Affichage grille   →  GET /api/.../{id}/image?thumb=1&v={version}
                      →  miniature max 480 px (JPEG), cache 7 jours

Affichage détail   →  GET /api/produit/{id}/image?v={version}
                      →  image pleine résolution
```

Le JSON expose `has_image` et `image_version`, mais **pas** les bytes de l'image.

---

## 3. Stack technique

### Backend (`assigame/`)

| Technologie        | Version / rôle                          |
|--------------------|-----------------------------------------|
| Java               | 17                                      |
| Spring Boot        | 4.0.6                                   |
| Spring Data JPA    | Persistance ORM                         |
| Spring Security    | JWT, BCrypt, contrôle d'accès par rôle  |
| PostgreSQL         | Base de données                         |
| Lombok             | Réduction du boilerplate                |
| Maven              | Build (`mvnw`)                          |

### Frontend (`assigame-frontend/`)

| Technologie        | Rôle                                    |
|--------------------|-----------------------------------------|
| React 19           | UI                                      |
| TypeScript         | Typage                                    |
| Vite 8             | Build et dev server                       |
| React Router 7     | Routing                                   |
| Axios              | Client HTTP                               |
| React Hook Form + Zod | Formulaires et validation            |
| Tailwind CSS 4     | Styles (mobile-first, breakpoints)      |
| Radix UI           | Composants accessibles                    |
| Framer Motion / GSAP / Three.js | Animations et 3D           |

---

## 4. Structure du projet

```
conception/
├── assigame/                          # Backend Spring Boot
│   ├── src/main/java/com/esgis2026/assigame/
│   │   ├── AssigameApplication.java
│   │   ├── config/
│   │   │   ├── CorsConfig.java        # CORS localhost:5173
│   │   │   ├── DataSeeder.java        # Données de test au démarrage
│   │   │   └── SecurityConfig.java
│   │   ├── controller/                # REST controllers
│   │   ├── dto/                       # LoginRequest, AuthResponse
│   │   ├── entity/                    # Produit, Utilisateur, CategorieProduit...
│   │   ├── repository/                # Spring Data JPA
│   │   ├── service/                   # Logique métier
│   │   └── util/
│   │       ├── ProductImageLoader.java   # Téléchargement URLs externes
│   │       ├── ImageScaler.java          # Redimensionnement miniatures
│   │       └── ImageResponseFactory.java # Cache HTTP + réponses image
│   └── src/main/resources/
│       └── application.properties
│
└── assigame-frontend/                 # Frontend React
    ├── src/
    │   ├── App.tsx                    # Routes principales
    │   ├── components/              # UI, layout, produits, home...
    │   ├── contexts/AuthContext.tsx
    │   ├── hooks/
    │   ├── lib/
    │   │   ├── apiConfig.ts           # URL API, miniatures, getProductImageUrl()
    │   │   ├── images.ts              # Images par défaut (catégories, hero…)
    │   │   ├── apiErrors.ts
    │   │   └── mappers.ts             # API → types frontend
    │   ├── pages/                     # Pages publiques, vendeur, admin
    │   ├── services/                  # authService, productService, sellerService...
    │   └── types/                     # Types TypeScript
    ├── .env                           # VITE_API_URL
    └── vite.config.ts                 # Proxy /api → :8080
```

---

## 5. Prérequis

- **JDK 17+**
- **Maven** (ou utiliser `./mvnw` inclus)
- **Node.js 18+** et **npm**
- **PostgreSQL 16+** avec une base `dbassigame` créée

```sql
CREATE DATABASE dbassigame;
```

---

## 6. Installation et démarrage

### Backend

```bash
cd assigame
./mvnw spring-boot:run        # Linux / macOS
.\mvnw.cmd spring-boot:run    # Windows
```

→ API disponible sur **http://localhost:8080**

### Frontend

```bash
cd assigame-frontend
npm install
npm run dev
```

→ Application sur **http://localhost:5173**

### Build frontend (local)

```bash
cd assigame-frontend
npm run build
npm run preview
```

---

## 7. Configuration

### Backend — `application.properties`

| Propriété | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| `spring.datasource.url` | URL PostgreSQL | `jdbc:postgresql://localhost:5432/dbassigame` |
| `spring.datasource.username` | Utilisateur DB | `postgres` |
| `spring.datasource.password` | Mot de passe DB | *(à configurer)* |
| `spring.jpa.hibernate.ddl-auto` | Schéma auto | `update` |
| `spring.servlet.multipart.max-file-size` | Taille max upload | `10MB` |
| `app.seed.enabled` | Seed si base vide | `true` |
| `app.seed.force` | Réinitialiser toute la base | `false` |
| `app.seed.backfill-images` | Compléter images manquantes | `true` |
| `app.security.upgrade-plain-passwords` | Migrer mots de passe en clair vers BCrypt | `true` |
| `app.jwt.secret` | Clé secrète JWT (Base64, min. 256 bits) | *(voir application.properties)* |
| `app.jwt.expiration-ms` | Durée de validité du token (ms) | `86400000` (24 h) |

### Frontend — `.env`

```env
VITE_API_URL=http://localhost:8080/api
```

En dev, les images passent aussi par le proxy Vite : `/api/produit/{id}/image`, `/api/categorieproduit/{id}/image`.

---

## 8. Base de données

### Modèle entités principales

```
TypeUtilisateur (1) ──< Utilisateur (N)
                              │
                              └──< Produit (N) >── CategorieProduit (1)
```

### Table `produit` (champs clés)

| Colonne | Type | Description |
|---------|------|-------------|
| `id_produit` | bigint | Clé primaire |
| `nom_produit` | varchar(50) | Nom |
| `description` | varchar(200) | Description |
| `prix` | double | Prix en FCFA |
| `statut` | varchar | `actif`, `inactif`, `en_attente` |
| `image` | bytea | Binaire image (non exposé en JSON) |
| `image_type` | varchar(100) | MIME (`image/jpeg`, etc.) |
| `idcategorie_produit` | FK | Catégorie |
| `id_utilisateur` | FK | Vendeur |

### Table `categorieproduit` (champs clés)

| Colonne | Type | Description |
|---------|------|-------------|
| `idcategorie_produit` | bigint | Clé primaire |
| `nom_categorieproduit` | varchar | Nom |
| `description` | varchar | Description |
| `image` | bytea | Binaire image (non exposé en JSON) |
| `image_type` | varchar(100) | MIME (`image/jpeg`, etc.) |

Le JSON catégorie expose aussi `has_image` et `image_version` (comme pour les produits).

### Seed automatique (`DataSeeder` + `MarketplaceSeedData`)

Au premier démarrage (base vide), le seeder insère un jeu de données **réaliste** pour le marché togolais :

| Élément | Quantité | Détail |
|---------|----------|--------|
| Types utilisateur | 2 | Administrateur, Vendeur |
| Utilisateurs | 11 | 1 admin + 10 vendeurs (8 villes du Togo) |
| Catégories | 12 | Téléphones, Informatique, Mode… — avec images Unsplash au seed |
| Produits | 53 | Prix en FCFA, images Unsplash, statuts variés (`actif`, `inactif`, `en_attente`) |

**Villes couvertes :** Lomé, Kara, Sokodé, Atakpamé, Kpalimé, Tsévié, Aného, Dapaong.

**Exemples de produits :** Samsung Galaxy A15, pagnes Vlisco, attiéké, Toyota Corolla, moto TVS, ciment Portland, miel de Kara, climatiseur split, etc.

Fichier source des données : `assigame/.../config/MarketplaceSeedData.java`.

Si la base existe déjà, le seed est **ignoré** (sauf backfill). Au démarrage, `DataSeeder` peut compléter :

- les **images produits** manquantes (`backfillMissingImages`)
- les **images catégories** manquantes (`backfillMissingCategoryImages`) depuis les URLs du seed
- le **stock** à zéro (`backfillMissingStock`)

Contrôlé par `app.seed.backfill-images=true` (défaut).

```properties
app.seed.force=true
```

Puis redémarrer le backend (remettre à `false` ensuite) :

```bash
cd assigame
.\mvnw.cmd spring-boot:run
```

> Le chargement des 53 images depuis Unsplash prend ~30–60 s au premier démarrage (connexion Internet requise).

---

## 9. API REST

Base URL : `http://localhost:8080/api`

### Authentification (JWT)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `POST` | `/auth/login` | Non | Connexion → retourne un **JWT** |
| `GET` | `/auth/me` | Oui | Profil de l'utilisateur connecté |

- Token **JWT** signé (HS256), durée configurable (`app.jwt.expiration-ms`, défaut 24 h)
- Envoyé dans le header : `Authorization: Bearer <token>`
- Stocké côté frontend : `localStorage.assigame_token`
- Claims du token : `sub` (id utilisateur), `email`, `role` (`ADMIN` ou `SELLER`)
- Mots de passe hashés avec **BCrypt**
- Migration automatique des anciens mots de passe en clair (`app.security.upgrade-plain-passwords=true`)

**Routes publiques (sans token) :**
- `POST /auth/login`, `POST /users/add` (inscription)
- `GET /produit/**`, `GET /categorieproduit/**`, `GET /typeutilisateur/**`

**Routes protégées :**
- `POST/PUT/DELETE /produit/**` → rôles `ADMIN` ou `SELLER`
- `/users/**` (sauf inscription) → rôle `ADMIN`
- Mutations catégories / types utilisateur → rôle `ADMIN`

### Produits

| Méthode | Endpoint | Content-Type | Description |
|---------|----------|--------------|-------------|
| `GET` | `/produit/list` | — | Liste tous les produits |
| `GET` | `/produit/{id}` | — | Détail produit |
| `GET` | `/produit/{id}/image` | — | Image binaire (`?thumb=1` pour miniature) |
| `POST` | `/produit/add` | `multipart/form-data` | Créer un produit |
| `PUT` | `/produit/update/{id}` | `multipart/form-data` | Modifier un produit |
| `POST` | `/produit/{id}/upload-image` | `multipart/form-data` | Changer uniquement l'image |
| `DELETE` | `/produit/delete/{id}` | — | Supprimer |

**Champs FormData (création / mise à jour) :**

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| `nom_produit` | Oui (add) | Nom |
| `statut` | Oui (add) | `actif`, `inactif`... |
| `description` | Non | Description |
| `prix` | Non | Prix numérique |
| `id_categorie` | Non | ID catégorie |
| `id_utilisateur` | Non | ID vendeur |
| `file` | Non | Fichier image |
| `image_url` | Non | URL publique (téléchargée côté serveur) |

> **Priorité** : si `file` est fourni, `image_url` est ignoré.

**Champs JSON produit (réponse) :**

```json
{
  "id_produit": 1,
  "nom_produit": "Samsung Galaxy A15",
  "has_image": true,
  "image_type": "image/jpeg",
  "image_version": 1042181,
  "prix": 115000,
  "statut": "actif",
  "categorie_produit": { ... },
  "utilisateur": { ... }
}
```

**Paramètres `GET /produit/{id}/image` :** `thumb=1` (miniature), `v={image_version}` (cache-busting). Voir [§10](#10-gestion-des-images).

### Catégories

| Méthode | Endpoint | Content-Type | Description |
|---------|----------|--------------|-------------|
| `GET` | `/categorieproduit/list` | — | Liste toutes les catégories |
| `GET` | `/categorieproduit/{id}` | — | Détail catégorie |
| `GET` | `/categorieproduit/{id}/image` | — | Image binaire (`?thumb=1` pour miniature) |
| `POST` | `/categorieproduit/add` | `application/json` | Créer une catégorie |
| `PUT` | `/categorieproduit/update/{id}` | `application/json` | Modifier nom / description |
| `POST` | `/categorieproduit/{id}/upload-image` | `multipart/form-data` | Changer l'image |
| `DELETE` | `/categorieproduit/delete/{id}` | — | Supprimer |

**Champs JSON catégorie (réponse) :**

```json
{
  "idcategorie_produit": 1,
  "nom_categorieproduit": "Téléphones",
  "description": "Smartphones et accessoires",
  "has_image": true,
  "image_type": "image/jpeg",
  "image_version": 52480
}
```

**Paramètres image (`GET .../image`) :**

| Paramètre | Description |
|-----------|-------------|
| `thumb=1` ou `thumb=true` | Miniature max **480 px** (JPEG), pour grilles et cartes |
| `v={version}` | Version cache-busting (valeur de `image_version`) |

**En-têtes de réponse image :**

- `Cache-Control: max-age=604800, public` (7 jours)
- `ETag` basé sur l'id et la taille du fichier source

### Utilisateurs

| Méthode | Endpoint |
|---------|----------|
| `GET` | `/users/list` |
| `POST` | `/users/add` |
| `PUT` | `/users/update/{id}` |
| `DELETE` | `/users/delete/{id}` |

### Types utilisateur

| Méthode | Endpoint |
|---------|----------|
| `GET` | `/typeutilisateur/list` |
| `POST` | `/typeutilisateur/add` |
| `PUT` | `/typeutilisateur/update/{id}` |
| `DELETE` | `/typeutilisateur/delete/{id}` |

### Exemples cURL

**Connexion :**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kodjo@assigame.tg","password":"seller123"}'
```

**Créer un produit avec image URL :**

```bash
curl -X POST http://localhost:8080/api/produit/add \
  -F "nom_produit=Mon Produit" \
  -F "statut=actif" \
  -F "description=Description du produit" \
  -F "prix=25000" \
  -F "id_categorie=1" \
  -F "id_utilisateur=2" \
  -F "image_url=https://images.unsplash.com/photo-xxx?w=800"
```

**Uploader un fichier image :**

```bash
curl -X POST http://localhost:8080/api/produit/1/upload-image \
  -F "file=@chemin/vers/photo.jpg"
```

**Récupérer une miniature produit :**

```bash
curl -o thumb.jpg "http://localhost:8080/api/produit/44/image?thumb=1"
```

**Uploader une image de catégorie (admin) :**

```bash
curl -X POST http://localhost:8080/api/categorieproduit/1/upload-image \
  -H "Authorization: Bearer <token>" \
  -F "image_url=https://images.unsplash.com/photo-xxx?w=640"
```

---

## 10. Gestion des images

### Stockage (produits et catégories)

- Colonnes `image` (bytea) + `image_type` sur `produit` et `categorieproduit`
- `@JsonIgnore` sur `image` → jamais dans le JSON
- `has_image` et `image_version` calculés pour le frontend
- `ProductImageLoader` : télécharge les URLs externes côté serveur (seed, upload `image_url`)
- Erreur image invalide → **400** avec message explicite

### Performance — miniatures et cache

| Composant | Rôle |
|-----------|------|
| `ImageScaler.java` | Redimensionne à max **480 px** (JPEG) quand `thumb=1` |
| `ImageResponseFactory.java` | Construit la réponse HTTP avec `Cache-Control` et `ETag` |

**Stratégie d'affichage frontend :**

| Contexte | URL utilisée |
|----------|--------------|
| Grilles produits (`ProductCard`) | `.../image?v={v}&thumb=1` |
| Grille catégories (`CategoryGrid`) | `.../image?v={v}&thumb=1` si image API |
| Fiche produit (`ProductGallery`) | `.../image?v={v}` (pleine résolution) |
| Aperçu rapide (`QuickViewDialog`) | miniature (`thumb=1`) |

Les 4 premiers produits de l'accueil utilisent `fetchpriority="high"` pour un chargement prioritaire.

### Cache catalogue (frontend)

`productService.ts` met en cache les listes produits et catégories **60 secondes** en mémoire, évitant des appels API répétés à chaque navigation.

- `invalidateCatalogCache()` est appelé après toute mutation vendeur/admin (création, mise à jour, upload image, suppression)
- Le paramètre `?v=` sur les URLs image force le rechargement navigateur après un nouvel upload

### Fichiers frontend clés

| Fichier | Rôle |
|---------|------|
| `lib/apiConfig.ts` | `getProductImageUrl()`, `getCategoryImageUrl()`, `withThumbParam()` |
| `lib/images.ts` | Images Unsplash par défaut ; priorité aux URLs API pour les catégories |
| `lib/mappers.ts` | Construit `product.images[]` et `category.image` depuis `has_image` |
| `components/products/ProductImage.tsx` | Affichage, fallback, prop `thumb` |
| `components/home/CategoryGrid.tsx` | Cartes catégories uniformes avec miniatures |
| `services/sellerService.ts` | `appendImageToFormData()` pour uploads produit |
| `services/adminService.ts` | CRUD catégories + `uploadCategoryImage()` |

**URL d'affichage (exemples) :**

- Dev : `/api/produit/{id}/image?v={version}&thumb=1`
- Prod : `{API_ORIGIN}/api/produit/{id}/image?v={version}&thumb=1`

### Interface vendeur

1. **Nouveau produit** : `/vendeur/produits/nouveau` — fichier **ou** URL
2. **Produit existant** : `/vendeur/produits` → icône image → fichier **ou** URL (pas les deux)

### Interface admin — catégories

Page `/admin/categories` : édition du **nom**, de la **description** et de la **photo** (fichier ou URL) via `POST /categorieproduit/{id}/upload-image`.

---

## 11. Frontend — routes et rôles

### Routes publiques

| Route | Page |
|-------|------|
| `/` | Accueil |
| `/categories` | Liste des catégories |
| `/produits` | Catalogue produits |
| `/produits/:slug` | Détail produit |
| `/a-propos` | À propos |
| `/connexion` | Login |
| `/inscription` | Inscription vendeur |

### Espace vendeur (`role: seller`)

| Route | Page |
|-------|------|
| `/vendeur` | Tableau de bord |
| `/vendeur/produits` | Mes produits |
| `/vendeur/produits/nouveau` | Ajouter un produit |

### Espace admin (`role: admin`)

| Route | Page |
|-------|------|
| `/admin` | Tableau de bord |
| `/admin/vendeurs` | Gestion vendeurs |
| `/admin/produits` | Tous les produits |
| `/admin/categories` | Catégories |

### Services frontend

| Service | Responsabilité |
|---------|----------------|
| `authService.ts` | Login, register, JWT (`localStorage`), `restoreSession()` |
| `productService.ts` | Catalogue public, catégories, filtres, cache 60 s |
| `sellerService.ts` | CRUD produits vendeur, upload images |
| `adminService.ts` | Données admin, gestion catégories et images |
| `api.ts` | Instance Axios, token JWT, intercepteur 401/403 |

### Breakpoints Tailwind utilisés

| Préfixe | Largeur min. | Usage principal |
|---------|--------------|-----------------|
| *(défaut)* | &lt; 640px | Mobile — cartes, bottom sheets, boutons pleine largeur |
| `sm` | 640px | Grilles 2 colonnes, barre d'outils en ligne |
| `md` | 768px | Tableaux admin/vendeur (cartes en dessous) |
| `lg` | 1024px | Sidebar fixe, scroll snap accueil, grille détail 2 colonnes |

---

## 12. Interface responsive

L'interface est conçue **mobile-first** avec Tailwind CSS 4. Les adaptations ci-dessous ciblent téléphones et tablettes sans casser l'expérience bureau.

### Principes globaux

- **`index.css`** : `overflow-x: hidden` sur `html`/`body` pour éviter le défilement horizontal ; prise en charge des **safe areas** (`env(safe-area-inset-*)`) sur les bords de l'écran.
- **`dialog.tsx`** : modales limitées en hauteur (`max-h-[90dvh]`) avec marges latérales sur petit écran.
- **Layouts vendeur/admin** : sidebar **fixe** à partir de `lg` ; seul le contenu principal défile ; menu hamburger &lt; `lg` avec overlay

### Accueil (`/`)

| Fichier | Comportement |
|---------|--------------|
| `HomePage.tsx` | Scroll **snap** et hauteur `100dvh` uniquement à partir de `lg` ; sur mobile, défilement vertical naturel |
| `MainLayout.tsx` | `overflow-hidden` retiré sur la home en mobile (`overflow-x-hidden` seulement) |
| `HeroSection.tsx` | Image hero réduite (`max-h-[36vh]` mobile, `42vh` tablette) pour laisser place au texte et au carousel |

### Catalogue

| Fichier | Comportement |
|---------|--------------|
| `ProductsPage.tsx` | Barre tri + filtres en colonne sur mobile ; grille `1 → sm:2 → lg:3` colonnes |
| `ProductFilters.tsx` | **Bottom sheet** sur écran &lt; 768px (poignée, overlay, safe-area bas) ; panneau flottant positionné au-dessus de la grille sur bureau |
| `ProductGallery.tsx` | Bouton **Zoom** toujours visible au tactile ; vignettes en **scroll horizontal** |
| `ProductDetailPage.tsx` | Boutons WhatsApp / Appeler / Favoris en pleine largeur sur mobile |

### Espaces vendeur et admin

| Fichier | Comportement |
|---------|--------------|
| `SellerLayout.tsx` / `AdminLayout.tsx` | Menu hamburger &lt; `lg` ; sidebar coulissante avec overlay |
| `SellerProductsPage.tsx` | **Cartes** produit sur mobile ; **tableau** à partir de `md` |
| `AdminProductsPage.tsx` | Idem pour la liste des produits |
| `AdminSellersPage.tsx` | Idem pour la liste des vendeurs |

### Tester la responsivité

1. Lancer le frontend : `npm run dev` → **http://localhost:5173**
2. Outils développeur (F12) → mode appareil (iPhone, Pixel, iPad)
3. Vérifier en priorité : accueil, catalogue + filtres, fiche produit, `/vendeur/produits`, `/admin/vendeurs`

---

## 13. Comptes de démonstration

Tous les vendeurs utilisent le mot de passe **`seller123`**.

| Rôle | Email | Ville | Mot de passe |
|------|-------|-------|--------------|
| Admin | `admin@assigame.tg` | Lomé | `admin123` |
| Vendeur | `kodjo@assigame.tg` | Lomé, Bè | `seller123` |
| Vendeur | `afi@assigame.tg` | Kara | `seller123` |
| Vendeur | `yao@assigame.tg` | Sokodé | `seller123` |
| Vendeur | `esi@assigame.tg` | Lomé, Tokoin | `seller123` |
| Vendeur | `komla@assigame.tg` | Atakpamé | `seller123` |
| Vendeur | `akouvi@assigame.tg` | Kpalimé | `seller123` |
| Vendeur | `sedzro@assigame.tg` | Tsévié | `seller123` |
| Vendeur | `ama@assigame.tg` | Aného | `seller123` |
| Vendeur | `dzifa@assigame.tg` | Lomé, Adidogomé | `seller123` |
| Vendeur | `mawuli@assigame.tg` | Dapaong | `seller123` |

---

## 14. Flux métier principaux

### Inscription vendeur

```
/inscription → POST /users/add → login automatique → /vendeur
```

### Publication produit

```
/vendeur/produits/nouveau
  → validation Zod (nom, description, prix ≥ 1, catégorie)
  → sellerService.createProduct() en FormData
  → POST /api/produit/add
  → redirection /vendeur/produits
```

### Changement d'image

```
/vendeur/produits → icône image
  → POST /api/produit/{id}/upload-image (FormData)
  → rechargement liste avec nouvelle URL ?v=
```

### Affichage catalogue

```
GET /produit/list (cache 60 s) → mapProduct() → ProductCard avec miniature thumb=1
GET /categorieproduit/list → mapCategory() → CategoryGrid avec miniature si image API
```

### Gestion catégorie (admin)

```
/admin/categories → modifier nom/description
  → PUT /api/categorieproduit/update/{id}
  → POST /api/categorieproduit/{id}/upload-image (optionnel)
  → invalidateCatalogCache()
```

---

## 15. Dépannage

| Problème | Solution |
|----------|----------|
| Port 8080 occupé | `netstat -ano \| findstr :8080` puis `taskkill /PID <pid> /F` |
| Erreur connexion PostgreSQL | Vérifier `application.properties` (URL, user, password) |
| Images non affichées | Vérifier `has_image: true` ; `GET /.../{id}/image` doit retourner 200 |
| Chargement images lent | Utiliser `?thumb=1` en grille ; vider le cache (Ctrl+Shift+R) une fois après mise à jour |
| Image catégorie par défaut Unsplash | Normal si `has_image: false` ; backfill au démarrage ou upload admin |
| Erreur Windows « chemin inexistant » (upload) | Nom de fichier trop long ou chemin OneDrive ; renommer court ou utiliser `image_url` |
| Erreur 500 sur upload image | Redémarrer le backend après `mvnw clean compile` |
| Erreur 400 image | URL invalide ou fichier trop gros (> 10 Mo) |
| Formulaire ne se soumet pas | Vérifier catégorie sélectionnée et prix ≥ 1 |
| CORS en dev | Backend autorise `localhost:5173` ; utiliser le proxy Vite |
| 401 / 403 API | Token JWT expiré ou absent — se reconnecter via `/connexion` |
| Seed ignoré | Normal si base déjà peuplée ; utiliser `app.seed.force=true` pour reset |
| Contenu coupé sur mobile | Vider le cache navigateur ; vérifier zoom à 100 % |
| Filtres invisibles mobile | Le panneau s'ouvre en bas d'écran (bottom sheet) ; taper l'overlay pour fermer |

---

## 16. Tests Postman

Une **collection Postman** prête à l'emploi est disponible dans le dossier `postman/` :

| Fichier | Description |
|---------|-------------|
| `postman/Assigame.postman_collection.json` | Toutes les requêtes + scripts de test |
| `postman/Assigame-Local.postman_environment.json` | Variables (`baseUrl`, `token`, comptes démo) |
| `postman/README.md` | Guide pas à pas détaillé |

### Import rapide

1. Démarrer le backend (`localhost:8080`)
2. Postman → **Import** → sélectionner les 2 fichiers JSON
3. Choisir l'environnement **Assigamé — Local**
4. Exécuter **01 — Auth → Login Vendeur** (le token est enregistré automatiquement)
5. Tester les dossiers **02 Public**, **03 Vendeur**, **04 Admin**

### Authentification dans Postman

```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{ "email": "kodjo@assigame.tg", "password": "seller123" }
```

Réponse → copier `token` ou laisser le script de test le placer dans `{{token}}`.

Requêtes protégées :
```
Authorization: Bearer {{token}}
```

### Produits en form-data

Les créations/modifications produit utilisent **`multipart/form-data`**, pas du JSON :

| Champ | Obligatoire (add) |
|-------|-------------------|
| `nom_produit` | Oui |
| `statut` | Oui (`actif`, `inactif`…) |
| `file` ou `image_url` | Non |

Voir le guide complet : **[postman/README.md](./postman/README.md)**.

---

## Évolutions possibles

- Stockage images sur S3/MinIO (avec vignettes pré-générées)
- Pagination API côté serveur
- Cache serveur des miniatures (mémoire ou disque)
- Tests unitaires et d'intégration
- CI/CD automatisé
- PWA (installation mobile, mode hors-ligne partiel)

---

*Documentation générée pour le projet Assigamé — ESGIS 2026.*
