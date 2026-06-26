package com.esgis2026.assigame.service;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.exception.ResourceNotFoundException;
import com.esgis2026.assigame.repository.CategorieProduitRepository;
import com.esgis2026.assigame.util.ImageValidator;
import com.esgis2026.assigame.util.ProductImageLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CategorieProduitService {
    final CategorieProduitRepository categorieProduitRepository;

    public CategorieProduitService(CategorieProduitRepository categorieProduitRepository) {
        this.categorieProduitRepository = categorieProduitRepository;
    }

    public List<CategorieProduit> getAllCategorieProduits() {
        return categorieProduitRepository.findAll();
    }

    public CategorieProduit getCategorieProduitById(Long id) {
        return categorieProduitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable"));
    }

    public CategorieProduit createCategorieProduit(CategorieProduit categorieProduit) {
        return categorieProduitRepository.save(categorieProduit);
    }

    public void deleteCategorieProduit(Long idCategorieProduit) {
        categorieProduitRepository.deleteById(idCategorieProduit);
    }

    public CategorieProduit updateCategorieProduit(Long idCategorieProduit, CategorieProduit details) {
        CategorieProduit categorieProduit = getCategorieProduitById(idCategorieProduit);
        if (details.getNom_categorieproduit() != null && !details.getNom_categorieproduit().isBlank()) {
            categorieProduit.setNom_categorieproduit(details.getNom_categorieproduit());
        }
        if (details.getDescription() != null) {
            categorieProduit.setDescription(details.getDescription());
        }
        return categorieProduitRepository.save(categorieProduit);
    }

    public CategorieProduit uploadImage(Long id, MultipartFile file) throws IOException {
        CategorieProduit categorie = getCategorieProduitById(id);
        applyImage(categorie, file);
        return categorieProduitRepository.save(categorie);
    }

    public CategorieProduit uploadImageFromUrl(Long id, String imageUrl) throws IOException {
        CategorieProduit categorie = getCategorieProduitById(id);
        ProductImageLoader.applyFromUrl(categorie, imageUrl);
        return categorieProduitRepository.save(categorie);
    }

    private void applyImage(CategorieProduit categorie, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            ImageValidator.ValidatedImage validated = ImageValidator.validate(image);
            categorie.setImage(validated.bytes());
            categorie.setImage_type(validated.contentType());
        }
    }
}
