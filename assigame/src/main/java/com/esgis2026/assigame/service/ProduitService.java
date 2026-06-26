package com.esgis2026.assigame.service;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.exception.ResourceNotFoundException;
import com.esgis2026.assigame.repository.ProduitRepository;
import com.esgis2026.assigame.security.JwtUserPrincipal;
import com.esgis2026.assigame.security.SecurityUtils;
import com.esgis2026.assigame.util.ImageValidator;
import com.esgis2026.assigame.util.ProductImageLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProduitService {

    final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public List<Produit> getAllProduits() {
        return produitRepository.findAllWithRelations();
    }

    public Produit createProduit(String nomProduit, String statut, String description,
                                 Double prix, Integer quantiteStock, Long idCategorie, Long idUtilisateur,
                                 MultipartFile image, String imageUrl, JwtUserPrincipal principal) throws IOException {
        Produit produit = new Produit();
        produit.setNom_produit(nomProduit);
        produit.setStatut(statut);
        produit.setDescription(description);
        produit.setPrix(prix);
        produit.setQuantite_stock(quantiteStock != null ? quantiteStock : 0);
        produit.setDate_ajout(LocalDateTime.now());

        if (idCategorie != null) {
            CategorieProduit cat = new CategorieProduit();
            cat.setIdcategorie_produit(idCategorie);
            produit.setCategorie_produit(cat);
        }

        Long ownerId = SecurityUtils.resolveOwnerId(idUtilisateur, principal);
        Utilisateur user = new Utilisateur();
        user.setId_utilisateur(ownerId);
        produit.setUtilisateur(user);

        applyImage(produit, image);
        applyImageFromUrlIfNeeded(produit, image, imageUrl);
        Produit saved = produitRepository.save(produit);
        return reloadWithRelations(saved);
    }

    public Produit updateProduit(String nomProduit, String statut, String description,
                                   Double prix, Integer quantiteStock, Long idCategorie, Long idUtilisateur,
                                   Long id, MultipartFile image, String imageUrl,
                                   JwtUserPrincipal principal) throws IOException {

        Produit produit = findProductOrThrow(id);
        SecurityUtils.assertCanModifyProduct(produit, principal);

        if (nomProduit != null) produit.setNom_produit(nomProduit);
        if (statut != null) produit.setStatut(statut);
        if (description != null) produit.setDescription(description);
        if (prix != null) produit.setPrix(prix);
        if (quantiteStock != null) produit.setQuantite_stock(quantiteStock);

        if (idCategorie != null) {
            CategorieProduit cat = new CategorieProduit();
            cat.setIdcategorie_produit(idCategorie);
            produit.setCategorie_produit(cat);
        }

        if (SecurityUtils.isAdmin(principal) && idUtilisateur != null) {
            Utilisateur user = new Utilisateur();
            user.setId_utilisateur(idUtilisateur);
            produit.setUtilisateur(user);
        }

        applyImage(produit, image);
        applyImageFromUrlIfNeeded(produit, image, imageUrl);
        Produit saved = produitRepository.save(produit);
        return reloadWithRelations(saved);
    }

    public void deleteProduit(Long id, JwtUserPrincipal principal) {
        Produit produit = findProductOrThrow(id);
        SecurityUtils.assertCanModifyProduct(produit, principal);
        produitRepository.deleteById(id);
    }

    public Produit getProduitById(Long id) {
        return findProductOrThrow(id);
    }

    public Produit uploadImage(Long id, MultipartFile file, JwtUserPrincipal principal) throws IOException {
        Produit produit = findProductOrThrow(id);
        SecurityUtils.assertCanModifyProduct(produit, principal);
        applyImage(produit, file);
        return reloadWithRelations(produitRepository.save(produit));
    }

    public Produit uploadImageFromUrl(Long id, String imageUrl, JwtUserPrincipal principal) throws IOException {
        Produit produit = findProductOrThrow(id);
        SecurityUtils.assertCanModifyProduct(produit, principal);
        ProductImageLoader.applyFromUrl(produit, imageUrl);
        return reloadWithRelations(produitRepository.save(produit));
    }

    private Produit findProductOrThrow(Long id) {
        return produitRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable"));
    }

    private Produit reloadWithRelations(Produit produit) {
        return produitRepository.findByIdWithRelations(produit.getId_produit())
                .orElse(produit);
    }

    private void applyImage(Produit produit, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            ImageValidator.ValidatedImage validated = ImageValidator.validate(image);
            produit.setImage(validated.bytes());
            produit.setImage_type(validated.contentType());
        }
    }

    private void applyImageFromUrlIfNeeded(Produit produit, MultipartFile image, String imageUrl) throws IOException {
        if ((image == null || image.isEmpty()) && imageUrl != null && !imageUrl.isBlank()) {
            ProductImageLoader.applyFromUrl(produit, imageUrl);
        }
    }
}
