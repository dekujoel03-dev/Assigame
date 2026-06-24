package com.esgis2026.assigame.config;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Jeu de données réaliste pour la marketplace togolaise Assigamé.
 * Prix en FCFA, villes et produits adaptés au marché local.
 */
public final class MarketplaceSeedData {

    private MarketplaceSeedData() {
    }

    public static List<TypeSeed> types() {
        return List.of(
                new TypeSeed("Administrateur", "Accès complet à la plateforme"),
                new TypeSeed("Vendeur", "Compte vendeur sur la marketplace")
        );
    }

    public static List<UserSeed> users() {
        return List.of(
                new UserSeed("Admin", "ASSIGAME", "M", "+22890000000",
                        "admin@assigame.tg", "admin123", "Lomé, Administratif", "admin"),
                new UserSeed("Mensah", "Kodjo", "M", "+22890123456",
                        "kodjo@assigame.tg", "seller123", "Lomé, Bè", "kodjo"),
                new UserSeed("Koffi", "Afi", "F", "+22890765432",
                        "afi@assigame.tg", "seller123", "Kara, Centre", "afi"),
                new UserSeed("Agbeko", "Yao", "M", "+22891234567",
                        "yao@assigame.tg", "seller123", "Sokodé, Komah", "yao"),
                new UserSeed("Amegavi", "Esi", "F", "+22892345678",
                        "esi@assigame.tg", "seller123", "Lomé, Tokoin", "esi"),
                new UserSeed("Tetteh", "Komla", "M", "+22893456789",
                        "komla@assigame.tg", "seller123", "Atakpamé, Zongo", "komla"),
                new UserSeed("Dossou", "Akouvi", "F", "+22894567890",
                        "akouvi@assigame.tg", "seller123", "Kpalimé, Agomé", "akouvi"),
                new UserSeed("Sedzro", "Koffi", "M", "+22895678901",
                        "sedzro@assigame.tg", "seller123", "Tsévié, Centre", "sedzro"),
                new UserSeed("Napoe", "Ama", "F", "+22896789012",
                        "ama@assigame.tg", "seller123", "Aného, Plage", "ama"),
                new UserSeed("Abotsi", "Dzifa", "F", "+22897890123",
                        "dzifa@assigame.tg", "seller123", "Lomé, Adidogomé", "dzifa"),
                new UserSeed("Gaba", "Mawuli", "M", "+22898901234",
                        "mawuli@assigame.tg", "seller123", "Dapaong, Sagbata", "mawuli")
        );
    }

    public static List<CategorySeed> categories() {
        return List.of(
                new CategorySeed("telephones", "Téléphones",
                        "Smartphones, tablettes et accessoires mobiles",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=640&h=480&fit=crop"),
                new CategorySeed("informatique", "Informatique",
                        "Ordinateurs, imprimantes et périphériques",
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=640&h=480&fit=crop"),
                new CategorySeed("mode", "Mode et habillement",
                        "Vêtements, pagnes, chaussures et accessoires",
                        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=640&h=480&fit=crop"),
                new CategorySeed("electromenager", "Électroménager",
                        "Cuisine, climatisation et appareils ménagers",
                        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&h=480&fit=crop"),
                new CategorySeed("maison", "Maison et décoration",
                        "Meubles, literie et décoration intérieure",
                        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=640&h=480&fit=crop"),
                new CategorySeed("automobile", "Automobile",
                        "Véhicules, motos et pièces détachées",
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=640&h=480&fit=crop"),
                new CategorySeed("agropastoral", "Agropastoral",
                        "Produits agricoles, élevage et intrants",
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=640&h=480&fit=crop"),
                new CategorySeed("beaute", "Beauté et cosmétique",
                        "Soins corps, cheveux et parfums",
                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=640&h=480&fit=crop"),
                new CategorySeed("alimentation", "Alimentation",
                        "Produits alimentaires locaux et importés",
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=480&fit=crop"),
                new CategorySeed("sport", "Sport et loisirs",
                        "Équipements sportifs et articles de loisir",
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&h=480&fit=crop"),
                new CategorySeed("enfants", "Enfants et bébé",
                        "Jouets, vêtements et puériculture",
                        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=640&h=480&fit=crop"),
                new CategorySeed("btp", "Matériaux BTP",
                        "Ciment, fer à béton et quincaillerie",
                        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&h=480&fit=crop")
        );
    }

    public static List<ProductSeed> products(LocalDateTime now) {
        return List.of(
                // ——— Téléphones ———
                p("Samsung Galaxy A15", "Galaxy A15 128 Go, écran 6.5\", triple caméra 50 MP. Garantie 6 mois.",
                        115000, "actif", "telephones", "kodjo", 3, now,
                        "https://images.unsplash.com/photo-1610945265064-0e34e55182fa?w=800&h=800&fit=crop"),
                p("iPhone 13 128 Go", "iPhone 13 reconditionné grade A, batterie 87%. Face ID OK.",
                        420000, "actif", "telephones", "dzifa", 5, now,
                        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop"),
                p("Tecno Spark 20 Pro", "Tecno Spark 20 Pro, 256 Go, 8 Go RAM. Idéal usage quotidien.",
                        95000, "actif", "telephones", "mawuli", 7, now,
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop"),
                p("Écouteurs Bluetooth JBL", "JBL Tune 510BT, autonomie 40 h. Livraison Lomé sous 24 h.",
                        28000, "actif", "telephones", "kodjo", 10, now,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"),
                p("Coque Samsung + verre trempé", "Pack coque silicone et protection écran Galaxy A série.",
                        3500, "actif", "telephones", "kodjo", 14, now,
                        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop"),

                // ——— Informatique ———
                p("MacBook Air M2", "MacBook Air M2, 8 Go RAM, 256 Go SSD. Parfait état.",
                        850000, "actif", "informatique", "afi", 4, now,
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop"),
                p("HP Pavilion 15 i5", "HP Pavilion 15, Core i5, 16 Go RAM, 512 Go SSD, Windows 11.",
                        420000, "actif", "informatique", "dzifa", 8, now,
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop"),
                p("Imprimante Canon PIXMA", "Imprimante jet d'encre Canon, Wi-Fi, scan et copie.",
                        85000, "actif", "informatique", "sedzro", 12, now,
                        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop"),
                p("Clé USB 64 Go", "Clé USB 3.0 64 Go, transfert rapide. Lot de 5 disponible.",
                        4500, "actif", "informatique", "kodjo", 18, now,
                        "https://images.unsplash.com/photo-1627881478826-97d9574d1f0a?w=800&h=800&fit=crop"),
                p("Souris sans fil Logitech", "Souris Logitech M185, pile incluse, compatible PC et Mac.",
                        7500, "en_attente", "informatique", "dzifa", 22, now,
                        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop"),

                // ——— Mode ———
                p("Robe Wax Premium", "Robe wax authentique, coupe moderne. Tailles S à XL.",
                        35000, "actif", "mode", "esi", 2, now,
                        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop"),
                p("Pagne Vlisco 6 yards", "Pagne Vlisco original, motifs exclusifs. Plusieurs coloris.",
                        42000, "actif", "mode", "afi", 6, now,
                        "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=800&fit=crop"),
                p("Baskets Nike Air Max", "Nike Air Max 90, tailles 40-45. Modèles variés en stock.",
                        55000, "actif", "mode", "esi", 9, now,
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop"),
                p("Costume homme sur mesure", "Costume 2 pièces, tissu importé. Prise de mesures à Lomé.",
                        75000, "actif", "mode", "ama", 15, now,
                        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop"),
                p("Sac à main cuir", "Sac à main en cuir véritable, fabrication artisanale togolaise.",
                        32000, "actif", "mode", "afi", 20, now,
                        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop"),

                // ——— Électroménager ———
                p("Mixeur Philips HR3655", "Mixeur plongeant Philips 800 W avec accessoires.",
                        45000, "actif", "electromenager", "yao", 5, now,
                        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop"),
                p("Réfrigérateur LG 350L", "LG No Frost 350 L, classe A++. Garantie 2 ans.",
                        320000, "inactif", "electromenager", "yao", 11, now,
                        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop"),
                p("Climatiseur Split 1.5 CV", "Climatiseur split 1.5 CV, installation possible à Lomé.",
                        285000, "actif", "electromenager", "dzifa", 13, now,
                        "https://images.unsplash.com/photo-1631545256061-25c8e992ebfe?w=800&h=800&fit=crop"),
                p("Ventilateur sur pied Midea", "Ventilateur 40 cm, 3 vitesses. Idéal saison sèche.",
                        18000, "actif", "electromenager", "sedzro", 17, now,
                        "https://images.unsplash.com/photo-1524488765339-b316b1c21352?w=800&h=800&fit=crop"),
                p("Cuisinière 4 feux", "Cuisinière à gaz 4 feux avec four. Très bon état.",
                        95000, "actif", "electromenager", "komla", 25, now,
                        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop"),

                // ——— Maison ———
                p("Canapé 3 places moderne", "Canapé tissu gris anthracite, design scandinave.",
                        280000, "actif", "maison", "komla", 6, now,
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop"),
                p("Matelas 160x200 orthopédique", "Matelas mousse haute densité, housse amovible.",
                        65000, "actif", "maison", "sedzro", 10, now,
                        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop"),
                p("Table à manger 6 places", "Table en bois massif + 6 chaises. Livraison Tsévié.",
                        185000, "actif", "maison", "sedzro", 16, now,
                        "https://images.unsplash.com/photo-1617806118773-12c932ad9a03?w=800&h=800&fit=crop"),
                p("Rideaux occultants", "Paire de rideaux occultants 2x1.4 m, plusieurs coloris.",
                        15000, "actif", "maison", "ama", 21, now,
                        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop"),

                // ——— Automobile ———
                p("Toyota Corolla 2019", "Corolla 2019, 45 000 km, clim, caméra recul. Carnet à jour.",
                        8500000, "actif", "automobile", "komla", 7, now,
                        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop"),
                p("Moto TVS Apache 160", "Moto TVS Apache 160 cc, 2021. Papiers en règle.",
                        1200000, "actif", "automobile", "mawuli", 14, now,
                        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=800&fit=crop"),
                p("Pneus 195/65 R15 (x4)", "Lot de 4 pneus neufs 195/65 R15. Montage possible.",
                        180000, "actif", "automobile", "komla", 19, now,
                        "https://images.unsplash.com/photo-1486262715619-67b85e44308d?w=800&h=800&fit=crop"),
                p("Batterie voiture 70 Ah", "Batterie 70 Ah maintenance free. Garantie 12 mois.",
                        45000, "actif", "automobile", "yao", 28, now,
                        "https://images.unsplash.com/photo-1625047509168-a7026f36de0c?w=800&h=800&fit=crop"),

                // ——— Agropastoral ———
                p("Sac de riz local 50 kg", "Riz local plateau, qualité supérieure. Livraison gros.",
                        28000, "actif", "agropastoral", "yao", 4, now,
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop"),
                p("Maïs jaune 100 kg", "Maïs jaune séché, origine région des Savanes.",
                        35000, "actif", "agropastoral", "akouvi", 8, now,
                        "https://images.unsplash.com/photo-1551754655-cd27e38d1686?w=800&h=800&fit=crop"),
                p("Poulets de chair (lot 50)", "Poulets prêts à l'emport, élevage local Sokodé.",
                        275000, "actif", "agropastoral", "yao", 12, now,
                        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=800&fit=crop"),
                p("Engrais NPK 50 kg", "Engrais NPK 15-15-15, sac 50 kg. Conseil agronomique offert.",
                        22000, "actif", "agropastoral", "akouvi", 24, now,
                        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop"),
                p("Miel pur de Kara 1 L", "Miel artisanal de Kara, récolte récente, sans additifs.",
                        8000, "actif", "agropastoral", "afi", 30, now,
                        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop"),

                // ——— Beauté ———
                p("Kit soin visage complet", "Nettoyant, tonique, sérum vitamine C et crème hydratante.",
                        22000, "actif", "beaute", "esi", 3, now,
                        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop"),
                p("Huile de karité bio 500 ml", "Beurre de karité pur, pression à froid, origine Kara.",
                        6500, "actif", "beaute", "afi", 9, now,
                        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"),
                p("Perruque lace front", "Perruque lace front 22\", cheveux naturels, plusieurs styles.",
                        48000, "actif", "beaute", "esi", 15, now,
                        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop"),
                p("Parfum homme 100 ml", "Eau de toilette homme, senteur boisée. Flacon 100 ml.",
                        18500, "actif", "beaute", "ama", 23, now,
                        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop"),

                // ——— Alimentation ———
                p("Huile de palme 5 L", "Huile de palme rouge, qualité alimentaire, bidon 5 L.",
                        7500, "actif", "alimentation", "akouvi", 2, now,
                        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop"),
                p("Gari blanc 25 kg", "Gari blanc fin, transformation locale Kpalimé.",
                        12000, "actif", "alimentation", "akouvi", 6, now,
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop"),
                p("Poisson fumé (kpan)", "Poisson fumé traditionnel, vendu au kilo. Fraîcheur garantie.",
                        3500, "actif", "alimentation", "ama", 11, now,
                        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=800&fit=crop"),
                p("Boîte conserve tomate x12", "Conserve tomate pelée, carton de 12 boîtes.",
                        9500, "actif", "alimentation", "sedzro", 18, now,
                        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=800&fit=crop"),
                p("Attiéké frais 5 kg", "Attiéké frais du jour, préparation artisanale Lomé.",
                        4000, "actif", "alimentation", "kodjo", 26, now,
                        "https://images.unsplash.com/photo-1604908176997-4314ef3dd979?w=800&h=800&fit=crop"),

                // ——— Sport ———
                p("Ballon football taille 5", "Ballon football taille 5, coutures renforcées.",
                        8500, "actif", "sport", "mawuli", 5, now,
                        "https://images.unsplash.com/photo-1614632537428-1e6c2e7e0aab?w=800&h=800&fit=crop"),
                p("Maillot ASKO de Kara", "Maillot réplique ASKO Kara, tailles M à XXL.",
                        12000, "actif", "sport", "afi", 13, now,
                        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=800&fit=crop"),
                p("Tapis de yoga", "Tapis yoga antidérapant 6 mm avec sac de transport.",
                        15000, "actif", "sport", "esi", 20, now,
                        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop"),
                p("Vélo VTT adulte", "VTT 26\", 21 vitesses, freins à disque. Bon état.",
                        95000, "actif", "sport", "mawuli", 27, now,
                        "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=800&fit=crop"),

                // ——— Enfants ———
                p("Poussette pliable", "Poussette pliable légère, pare-soleil inclus.",
                        42000, "actif", "enfants", "ama", 7, now,
                        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop"),
                p("Jouets éducatifs lot", "Lot jouets éducatifs 3-6 ans : puzzles, cubes, lettres.",
                        18000, "actif", "enfants", "ama", 14, now,
                        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop"),
                p("Cartable scolaire", "Cartable renforcé, compartiments multiples. Modèles garçon/fille.",
                        9500, "actif", "enfants", "sedzro", 22, now,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"),

                // ——— BTP ———
                p("Ciment Portland 50 kg", "Sac ciment Portland 50 kg. Vente en gros possible.",
                        6500, "actif", "btp", "sedzro", 4, now,
                        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=800&fit=crop"),
                p("Fer à béton 12 mm", "Fer à béton haute adhérence 12 mm, barre 12 m.",
                        8500, "actif", "btp", "sedzro", 10, now,
                        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=800&fit=crop"),
                p("Peinture acrylique 20 L", "Peinture acrylique mate blanche, seau 20 L.",
                        32000, "actif", "btp", "komla", 16, now,
                        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=800&fit=crop"),
                p("Robinet mitigeur cuisine", "Mitigeur cuisine chromé, cartouche céramique.",
                        12500, "en_attente", "btp", "sedzro", 29, now,
                        "https://images.unsplash.com/photo-1585704032915-c3400f1993b8?w=800&h=800&fit=crop")
        );
    }

    private static ProductSeed p(
            String name,
            String description,
            double price,
            String status,
            String categoryKey,
            String sellerKey,
            int daysAgo,
            LocalDateTime now,
            String imageUrl
    ) {
        return new ProductSeed(name, description, price, status, categoryKey, sellerKey,
                now.minusDays(daysAgo), imageUrl);
    }

    public record TypeSeed(String libelle, String description) {
    }

    public record UserSeed(
            String nom,
            String prenom,
            String sexe,
            String telephone,
            String email,
            String password,
            String residence,
            String key
    ) {
        public boolean isAdmin() {
            return "admin".equals(key);
        }
    }

    public record CategorySeed(String key, String name, String description, String imageUrl) {
    }

    public record ProductSeed(
            String name,
            String description,
            Double price,
            String status,
            String categoryKey,
            String sellerKey,
            LocalDateTime addedAt,
            String imageUrl
    ) {
    }
}
