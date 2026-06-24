-- Script SQL optionnel pour insérer les données de test Assigamé
-- Usage : psql -U postgres -d dbassigame -f seed-data.sql

TRUNCATE TABLE produit, utilisateur, categorieproduit, typeutilisateur RESTART IDENTITY CASCADE;

INSERT INTO typeutilisateur (libelle_type_utilisateur, description_type_utilisateur) VALUES
('Administrateur', 'Accès complet à la plateforme'),
('Vendeur', 'Compte vendeur sur la marketplace');

INSERT INTO utilisateur (
  nom_utilisateur, prenom_utilisateur, sexe_utilisateur, telephone_utilisateur,
  mail_utilisateur, login_utilisateur, password_utilisateur, residence_utilisateur, id_type_utilisateur
) VALUES
('Admin', 'ASSIGAME', 'M', '+22890000000', 'admin@assigame.tg', 'admin@assigame.tg', 'admin123', 'Lomé, Administratif', 1),
('Mensah', 'Kodjo', 'M', '+22890123456', 'kodjo@assigame.tg', 'kodjo@assigame.tg', 'seller123', 'Lomé, Bè', 2),
('Koffi', 'Afi', 'F', '+22890765432', 'afi@assigame.tg', 'afi@assigame.tg', 'seller123', 'Kara, Centre', 2),
('Agbeko', 'Yao', 'M', '+22891234567', 'yao@assigame.tg', 'yao@assigame.tg', 'seller123', 'Sokodé, Komah', 2),
('Amegavi', 'Esi', 'F', '+22892345678', 'esi@assigame.tg', 'esi@assigame.tg', 'seller123', 'Lomé, Tokoin', 2),
('Tetteh', 'Komla', 'M', '+22893456789', 'komla@assigame.tg', 'komla@assigame.tg', 'seller123', 'Atakpamé, Zongo', 2);

INSERT INTO categorieproduit (nom_categorieproduit, description) VALUES
('Téléphones', 'Smartphones et accessoires mobiles'),
('Informatique', 'Ordinateurs, périphériques et logiciels'),
('Mode et habillement', 'Vêtements, chaussures et accessoires'),
('Électroménager', 'Appareils pour la maison'),
('Maison et décoration', 'Meubles et objets de décoration'),
('Automobile', 'Véhicules et pièces détachées'),
('Agropastoral', 'Produits agricoles et élevage'),
('Beauté et cosmétique', 'Soins et produits de beauté');

INSERT INTO produit (nom_produit, description, prix, statut, date_ajout, idcategorie_produit, id_utilisateur) VALUES
('Samsung Galaxy A15', 'Smartphone Samsung Galaxy A15 avec écran Super AMOLED 6.5", 128 Go de stockage, triple caméra 50MP.', 115000, 'actif', NOW() - INTERVAL '12 days', 1, 2),
('MacBook Air M2', 'Ordinateur portable Apple MacBook Air M2, 8 Go RAM, 256 Go SSD.', 850000, 'actif', NOW() - INTERVAL '14 days', 2, 3),
('Robe Wax Premium', 'Magnifique robe en tissu wax authentique, coupe élégante et confortable.', 35000, 'actif', NOW() - INTERVAL '13 days', 3, 5),
('Mixeur Philips HR3655', 'Mixeur plongeant Philips 800W avec accessoires multiples.', 45000, 'actif', NOW() - INTERVAL '15 days', 4, 4),
('Canapé 3 places moderne', 'Canapé 3 places en tissu gris anthracite, design scandinave.', 280000, 'actif', NOW() - INTERVAL '16 days', 5, 2),
('Toyota Corolla 2019', 'Toyota Corolla 2019 en excellent état, 45 000 km, climatisation, caméra de recul.', 8500000, 'actif', NOW() - INTERVAL '17 days', 6, 6),
('Sac de riz local 50kg', 'Riz local de qualité supérieure, cultivé dans la région des plateaux.', 28000, 'actif', NOW() - INTERVAL '18 days', 7, 4),
('Kit soin visage complet', 'Ensemble complet de soins visage : nettoyant, tonique, sérum vitamine C et crème hydratante.', 22000, 'actif', NOW() - INTERVAL '19 days', 8, 5),
('iPhone 14 Pro', 'iPhone 14 Pro 256 Go, couleur Deep Purple. État neuf, garantie 6 mois.', 650000, 'actif', NOW() - INTERVAL '11 days', 1, 3),
('HP Pavilion 15', 'Ordinateur portable HP Pavilion 15, Intel Core i5, 16 Go RAM, 512 Go SSD.', 420000, 'actif', NOW() - INTERVAL '20 days', 2, 2),
('Baskets Nike Air Max', 'Baskets Nike Air Max 90, tailles 40-45 disponibles. Couleurs variées.', 55000, 'actif', NOW() - INTERVAL '21 days', 3, 5),
('Réfrigérateur LG 350L', 'Réfrigérateur LG No Frost 350 litres, classe énergétique A++. Garantie 2 ans.', 320000, 'inactif', NOW() - INTERVAL '23 days', 4, 4);
