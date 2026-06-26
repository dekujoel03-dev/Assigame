package com.esgis2026.assigame.config;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.entity.TypeUtilisateur;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.CategorieProduitRepository;
import com.esgis2026.assigame.repository.ProduitRepository;
import com.esgis2026.assigame.repository.TypeUtilisateurRepository;
import com.esgis2026.assigame.repository.UtilisateurRepository;
import com.esgis2026.assigame.util.ProductImageLoader;
import com.esgis2026.assigame.service.PasswordService;
import com.esgis2026.assigame.security.UserRoleResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final TypeUtilisateurRepository typeUtilisateurRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CategorieProduitRepository categorieProduitRepository;
    private final ProduitRepository produitRepository;
    private final PasswordService passwordService;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.force:false}")
    private boolean seedForce;

    @Value("${app.seed.backfill-images:true}")
    private boolean backfillImages;

    @Value("${app.security.upgrade-plain-passwords:true}")
    private boolean upgradePlainPasswords;

    public DataSeeder(
            TypeUtilisateurRepository typeUtilisateurRepository,
            UtilisateurRepository utilisateurRepository,
            CategorieProduitRepository categorieProduitRepository,
            ProduitRepository produitRepository,
            PasswordService passwordService
    ) {
        this.typeUtilisateurRepository = typeUtilisateurRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.categorieProduitRepository = categorieProduitRepository;
        this.produitRepository = produitRepository;
        this.passwordService = passwordService;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }

        if (seedForce) {
            log.warn("Réinitialisation forcée des données de test...");
            produitRepository.deleteAll();
            utilisateurRepository.deleteAll();
            categorieProduitRepository.deleteAll();
            typeUtilisateurRepository.deleteAll();
        } else if (typeUtilisateurRepository.count() > 0) {
            if (upgradePlainPasswords) {
                upgradePlainTextPasswords();
            }
            if (backfillImages) {
                backfillMissingImages();
                backfillMissingCategoryImages();
            }
            backfillMissingStock();
            log.info("Base déjà initialisée, seed ignoré. Utilisez app.seed.force=true pour recharger les données.");
            return;
        }

        log.info("Insertion des données réalistes Assigamé ({} produits)...",
                MarketplaceSeedData.products(LocalDateTime.now()).size());

        Map<String, TypeUtilisateur> types = seedTypes();
        Map<String, Utilisateur> sellers = seedUsers(types);
        Map<String, CategorieProduit> categories = seedCategories();
        seedProducts(categories, sellers);

        log.info("Données insérées : {} catégories, {} vendeurs, {} produits.",
                categories.size(), sellers.size(), produitRepository.count());
        log.info("Comptes démo : admin@assigame.tg / admin123 | kodjo@assigame.tg / seller123");
    }

    private Map<String, TypeUtilisateur> seedTypes() {
        Map<String, TypeUtilisateur> types = new LinkedHashMap<>();
        for (MarketplaceSeedData.TypeSeed seed : MarketplaceSeedData.types()) {
            TypeUtilisateur type = new TypeUtilisateur();
            type.setLibelle_type_utilisateur(seed.libelle());
            type.setDescription_type_utilisateur(seed.description());
            TypeUtilisateur saved = typeUtilisateurRepository.save(type);
            String key = UserRoleResolver.isAdminType(saved) ? "admin" : "seller";
            types.put(key, saved);
        }
        return types;
    }

    private Map<String, Utilisateur> seedUsers(Map<String, TypeUtilisateur> types) {
        Map<String, Utilisateur> users = new LinkedHashMap<>();
        TypeUtilisateur adminType = types.get("admin");
        TypeUtilisateur sellerType = types.get("seller");

        for (MarketplaceSeedData.UserSeed seed : MarketplaceSeedData.users()) {
            TypeUtilisateur type = seed.isAdmin() ? adminType : sellerType;
            Utilisateur user = saveUser(
                    seed.nom(), seed.prenom(), seed.sexe(), seed.telephone(),
                    seed.email(), seed.password(), seed.residence(), type
            );
            if (!seed.isAdmin()) {
                users.put(seed.key(), user);
            }
        }
        return users;
    }

    private Utilisateur saveUser(
            String nom,
            String prenom,
            String sexe,
            String telephone,
            String email,
            String password,
            String residence,
            TypeUtilisateur type
    ) {
        Utilisateur user = new Utilisateur();
        user.setNom_utilisateur(nom);
        user.setPrenom_utilisateur(prenom);
        user.setSexe_utilisateur(sexe);
        user.setTelephone_utilisateur(telephone);
        user.setMail_utilisateur(email);
        user.setLogin_utilisateur(email);
        user.setPassword_utilisateur(passwordService.encode(password));
        user.setResidence_utilisateur(residence);
        user.setType_utilisateur(type);
        return utilisateurRepository.save(user);
    }

    private Map<String, CategorieProduit> seedCategories() {
        Map<String, CategorieProduit> categories = new LinkedHashMap<>();
        for (MarketplaceSeedData.CategorySeed seed : MarketplaceSeedData.categories()) {
            CategorieProduit category = new CategorieProduit();
            category.setNom_categorieproduit(seed.name());
            category.setDescription(seed.description());
            try {
                ProductImageLoader.applyFromUrl(category, seed.imageUrl());
            } catch (IOException e) {
                log.warn("Image non chargée pour la catégorie {} ({})", seed.name(), seed.imageUrl());
            }
            categories.put(seed.key(), categorieProduitRepository.save(category));
        }
        return categories;
    }

    private void seedProducts(Map<String, CategorieProduit> categories, Map<String, Utilisateur> sellers) {
        for (MarketplaceSeedData.ProductSeed seed : MarketplaceSeedData.products(LocalDateTime.now())) {
            Produit produit = new Produit();
            produit.setNom_produit(seed.name());
            produit.setDescription(seed.description());
            produit.setPrix(seed.price());
            produit.setStatut(seed.status());
            produit.setDate_ajout(seed.addedAt());
            produit.setQuantite_stock(Math.max(1, Math.abs(seed.name().hashCode() % 40) + 1));
            produit.setCategorie_produit(categories.get(seed.categoryKey()));
            produit.setUtilisateur(sellers.get(seed.sellerKey()));
            try {
                ProductImageLoader.applyFromUrl(produit, seed.imageUrl());
            } catch (IOException e) {
                log.warn("Image non chargée pour {} ({})", seed.name(), seed.imageUrl());
            }
            produitRepository.save(produit);
        }
    }

    private void upgradePlainTextPasswords() {
        int upgraded = 0;
        for (Utilisateur utilisateur : utilisateurRepository.findAll()) {
            String password = utilisateur.getPassword_utilisateur();
            if (passwordService.needsUpgrade(password)) {
                utilisateur.setPassword_utilisateur(passwordService.encode(password));
                utilisateurRepository.save(utilisateur);
                upgraded++;
            }
        }
        if (upgraded > 0) {
            log.info("Mots de passe migrés vers BCrypt pour {} utilisateur(s).", upgraded);
        }
    }

    private void backfillMissingImages() {
        Map<String, String> imageByName = new LinkedHashMap<>();
        for (MarketplaceSeedData.ProductSeed seed : MarketplaceSeedData.products(LocalDateTime.now())) {
            imageByName.put(seed.name(), seed.imageUrl());
        }

        int filled = 0;
        for (Produit produit : produitRepository.findAll()) {
            if (produit.hasImage()) {
                continue;
            }
            String imageUrl = imageByName.get(produit.getNom_produit());
            if (imageUrl == null) {
                continue;
            }
            try {
                ProductImageLoader.applyFromUrl(produit, imageUrl);
                produitRepository.save(produit);
                filled++;
            } catch (IOException e) {
                log.warn("Backfill image échoué pour {} ({})", produit.getNom_produit(), imageUrl);
            }
        }

        if (filled > 0) {
            log.info("Images manquantes complétées pour {} produit(s).", filled);
        }
    }

    private void backfillMissingCategoryImages() {
        Map<String, String> imageByName = new LinkedHashMap<>();
        for (MarketplaceSeedData.CategorySeed seed : MarketplaceSeedData.categories()) {
            imageByName.put(seed.name(), seed.imageUrl());
        }

        int filled = 0;
        for (CategorieProduit category : categorieProduitRepository.findAll()) {
            if (category.hasImage()) {
                continue;
            }
            String imageUrl = imageByName.get(category.getNom_categorieproduit());
            if (imageUrl == null) {
                continue;
            }
            try {
                ProductImageLoader.applyFromUrl(category, imageUrl);
                categorieProduitRepository.save(category);
                filled++;
            } catch (IOException e) {
                log.warn("Backfill image échoué pour la catégorie {} ({})",
                        category.getNom_categorieproduit(), imageUrl);
            }
        }

        if (filled > 0) {
            log.info("Images manquantes complétées pour {} catégorie(s).", filled);
        }
    }

    private void backfillMissingStock() {
        int filled = 0;
        for (Produit produit : produitRepository.findAll()) {
            if (produit.getQuantite_stock() != null && produit.getQuantite_stock() > 0) {
                continue;
            }
            produit.setQuantite_stock(Math.max(1, Math.abs(produit.getNom_produit().hashCode() % 40) + 1));
            produitRepository.save(produit);
            filled++;
        }
        if (filled > 0) {
            log.info("Stock complété pour {} produit(s).", filled);
        }
    }
}
