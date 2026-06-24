-- ============================================================
-- Insertion d'images dans la table produit (PostgreSQL)
-- Colonnes : image (bytea) + image_type (varchar, ex: image/jpeg)
-- ============================================================

-- Méthode 1 : depuis un fichier local (psql)
-- Remplacez le chemin par votre image réelle.
/*
\lo_import 'C:/images/samsung.jpg'
-- psql affiche un OID, par exemple 12345

UPDATE produit
SET image = lo_get(12345),
    image_type = 'image/jpeg'
WHERE id_produit = 1;
*/

-- Méthode 2 : depuis un fichier avec pg_read_binary_file (serveur PostgreSQL)
-- Le fichier doit être accessible par le processus postgres sur le serveur.
/*
UPDATE produit
SET image = pg_read_binary_file('C:/Program Files/PostgreSQL/16/data/samsung.jpg'),
    image_type = 'image/jpeg'
WHERE id_produit = 1;
*/

-- Méthode 3 : vérifier qu'une image est bien stockée
SELECT
    id_produit,
    nom_produit,
    image_type,
    octet_length(image) AS taille_octets
FROM produit
WHERE id_produit = 1;

-- Méthode 4 : retirer une image
/*
UPDATE produit
SET image = NULL,
    image_type = NULL
WHERE id_produit = 1;
*/
