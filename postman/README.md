# Tests API avec Postman — Assigamé

Guide pas à pas pour tester l'API REST (`http://localhost:8080/api`) avec Postman.

---

## 1. Prérequis

1. **PostgreSQL** démarré, base `dbassigame` créée
2. **Backend** lancé :

```bash
cd assigame
.\mvnw.cmd spring-boot:run    # Windows
```

3. **Postman** installé ([postman.com/downloads](https://www.postman.com/downloads/))

---

## 2. Importer la collection

1. Ouvrir Postman
2. **Import** → glisser les fichiers du dossier `postman/` :
   - `Assigame.postman_collection.json`
   - `Assigame-Local.postman_environment.json`
3. En haut à droite, sélectionner l'environnement **Assigamé — Local**

### Variables d'environnement

| Variable | Valeur | Rôle |
|----------|--------|------|
| `baseUrl` | `http://localhost:8080/api` | URL de base |
| `token` | *(vide au départ)* | Rempli automatiquement après login |
| `productId` | `1` | ID produit (auto via Mes produits) |
| `categoryId` | `1` | ID catégorie (auto via Liste catégories) |
| `registerEmail` | *(auto)* | Email unique pour inscription test |
| `sellerEmail` | `kodjo@assigame.tg` | Compte vendeur démo |
| `sellerPassword` | `seller123` | |
| `adminEmail` | `admin@assigame.tg` | Compte admin démo |
| `adminPassword` | `admin123` | |

---

## 3. Parcours recommandé

### Étape A — Routes publiques (sans connexion)

Dossier **02 — Public** :

| Requête | Méthode | Résultat attendu |
|---------|---------|------------------|
| Santé API | `GET /health` | `200` + `{"status":"UP"}` |
| Liste produits | `GET /produit/list` | `200` + tableau JSON |
| Détail produit | `GET /produit/{{productId}}` | `200` + objet produit |
| Image produit | `GET /produit/{{productId}}/image` | `200` (binaire) ou `404` |
| Liste catégories | `GET /categorieproduit/list` | `200` (définit `categoryId`) |
| Détail catégorie | `GET /categorieproduit/{{categoryId}}` | `200` |
| Image catégorie | `GET /categorieproduit/{{categoryId}}/image` | `200` ou `404` |
| Inscription vendeur | `POST /users/add` | `200` (email unique auto) |

Aucun header `Authorization` nécessaire.

---

### Étape B — Authentification JWT

Dossier **01 — Auth** :

1. Exécuter **Login Vendeur**
2. Onglet **Test Results** : les tests doivent passer
3. Vérifier dans l'environnement : `token` est rempli automatiquement

**Corps de la requête login :**

```json
{
  "email": "kodjo@assigame.tg",
  "password": "seller123"
}
```

**Réponse typique :**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id_utilisateur": 2,
    "mail_utilisateur": "kodjo@assigame.tg",
    ...
  }
}
```

4. Exécuter **Profil connecté (GET /auth/me)** → `200` avec les infos utilisateur

Le token est envoyé automatiquement via l'auth **Bearer** de la collection :
```
Authorization: Bearer {{token}}
```

---

### Étape C — Actions vendeur

> Exécuter **Login Vendeur** avant ce dossier.

Dossier **03 — Vendeur** :

0. **Mes produits (prépare productId)** — obligatoire avant Modifier/Supprimer
1. Créer produit (image URL ou fichier)
2. Modifier produit
3. Changer image
4. Supprimer produit

#### Créer un produit (image URL)

- **POST** `{{baseUrl}}/produit/add`
- Body → **form-data** (pas raw JSON) :

| Clé | Type | Exemple |
|-----|------|---------|
| `nom_produit` | Text | `Produit test Postman` |
| `statut` | Text | `actif` |
| `description` | Text | `Créé via Postman` |
| `prix` | Text | `35000` |
| `id_categorie` | Text | `{{categoryId}}` |
| `id_utilisateur` | Text | `2` *(ID du vendeur)* |
| `image_url` | Text | `https://images.unsplash.com/photo-...?w=800` |

> Si `file` est fourni, `image_url` est ignoré.

#### Créer un produit (fichier)

Même requête, mais remplacer `image_url` par :

| Clé | Type |
|-----|------|
| `file` | **File** → choisir une image locale |

#### Changer uniquement l'image

- **POST** `{{baseUrl}}/produit/{id}/upload-image`
- form-data : `file` **ou** `image_url`

#### Modifier / supprimer

- **PUT** `{{baseUrl}}/produit/update/{id}` — form-data (champs optionnels)
- **DELETE** `{{baseUrl}}/produit/delete/{id}`

---

### Étape D — Actions admin

1. Exécuter **Login Admin**
2. Dossier **04 — Admin**

| Requête | Méthode | Auth |
|---------|---------|------|
| Liste utilisateurs | `GET /users/list` | Admin |
| Ajouter catégorie | `POST /categorieproduit/add` | Admin (JSON) |
| Modifier catégorie | `PUT /categorieproduit/update/{id}` | Admin |
| Supprimer catégorie | `DELETE /categorieproduit/delete/{id}` | Admin |

**Inscription vendeur (public, dossier 02 — Public) :**

```json
POST /users/add
{
  "nom_utilisateur": "Test",
  "prenom_utilisateur": "Postman",
  "sexe_utilisateur": "M",
  "telephone_utilisateur": "+22890111222",
  "mail_utilisateur": "nouveau@assigame.tg",
  "password_utilisateur": "motdepasse123",
  "residence_utilisateur": "Lomé"
}
```

Le rôle vendeur est attribué automatiquement côté serveur.

---

### Étape E — Tests d'erreur

Dossier **05 — Erreurs** :

| Scénario | Code attendu |
|----------|--------------|
| Login mauvais mot de passe | `401` |
| `/auth/me` sans token | `401` |
| Vendeur → `GET /users/list` | `403` |

---

## 4. Créer une requête manuellement

### JSON (login, catégories, users)

1. Méthode + URL : `POST http://localhost:8080/api/auth/login`
2. **Headers** : `Content-Type: application/json`
3. **Body** → **raw** → **JSON**

### FormData (produits, images)

1. **Body** → **form-data**
2. Ne pas mettre `Content-Type` manuellement (Postman ajoute le boundary)
3. Chaque champ en type **Text**, sauf `file` en type **File**

### Bearer token manuel

Onglet **Authorization** → Type **Bearer Token** → coller le token.

Ou header :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 5. Lancer toute la collection (Collection Runner)

1. Clic droit sur **Assigamé API** → **Run collection**
2. Ordre conseillé :
   - 01 — Auth → Login Vendeur
   - 02 — Public (toutes)
   - 03 — Vendeur (créer → modifier → upload → supprimer)
   - 01 — Auth → Login Admin
   - 04 — Admin
   - 05 — Erreurs
3. Cocher l'environnement **Assigamé — Local**
4. **Run Assigamé API**

---

## 6. Dépannage Postman

| Problème | Cause / solution |
|----------|------------------|
| `Could not get response` | Backend non démarré ou port 8080 occupé |
| `401 Unauthorized` | Token absent ou expiré → relancer **Login** |
| `403 Forbidden` | Mauvais rôle (ex. vendeur sur route admin) |
| `400` sur upload image | URL invalide, fichier > 10 Mo, ou ni `file` ni `image_url` |
| Body produit ignoré | Utiliser **form-data**, pas JSON |
| `404` sur Modifier produit | Exécuter **Mes produits (prépare productId)** après Login Vendeur |

---

## 7. Matrice des droits

| Endpoint | Public | SELLER | ADMIN |
|----------|--------|--------|-------|
| `POST /auth/login` | ✅ | ✅ | ✅ |
| `GET /auth/me` | ❌ | ✅ | ✅ |
| `GET /health` | ✅ | ✅ | ✅ |
| `GET /produit/**` | ✅ | ✅ | ✅ |
| `POST/PUT/DELETE /produit/**` | ❌ | ✅ | ✅ |
| `GET /categorieproduit/**` | ✅ | ✅ | ✅ |
| `POST/PUT/DELETE /categorieproduit/**` | ❌ | ❌ | ✅ |
| `POST /users/add` | ✅ | ✅ | ✅ |
| `GET /users/**` (sauf add) | ❌ | ❌ | ✅ |

---

