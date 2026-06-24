package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.security.JwtUserPrincipal;
import com.esgis2026.assigame.service.ProduitService;
import com.esgis2026.assigame.util.ImageResponseFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/produit")
public class ProduitController {
    final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @GetMapping("/list")
    public List<Produit> getAllProduit() {
        return produitService.getAllProduits();
    }
    @GetMapping("/{id}")
    public Produit getProduitById(@PathVariable Long id) {
        return produitService.getProduitById(id);
    }
    
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduit(
            @RequestParam("nom_produit") String nomProduit,
            @RequestParam("statut") String statut,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "prix", required = false) Double prix,
            @RequestParam(value = "quantite_stock", required = false) Integer quantiteStock,
            @RequestParam(value = "id_categorie", required = false) Long idCategorie,
            @RequestParam(value = "id_utilisateur", required = false) Long idUtilisateur,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "image_url", required = false) String imageUrl,
            @AuthenticationPrincipal JwtUserPrincipal principal
    ) {
        try {
            Produit produit = produitService.createProduit(
                    nomProduit, statut, description, prix, quantiteStock, idCategorie, idUtilisateur, file, imageUrl, principal);
            return ResponseEntity.ok(produit);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Image invalide ou inaccessible. Vérifiez le fichier ou l'URL."
            ));
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteProduit(@PathVariable Long id, @AuthenticationPrincipal JwtUserPrincipal principal) {
        produitService.deleteProduit(id, principal);
    }

@PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> updateProduit(
        @PathVariable Long id,
        @RequestParam(value = "nom_produit", required = false) String nomProduit,
        @RequestParam(value = "statut", required = false) String statut,
        @RequestParam(value = "description", required = false) String description,
        @RequestParam(value = "prix", required = false) Double prix,
        @RequestParam(value = "quantite_stock", required = false) Integer quantiteStock,
        @RequestParam(value = "id_categorie", required = false) Long idCategorie,
        @RequestParam(value = "id_utilisateur", required = false) Long idUtilisateur,
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam(value = "image_url", required = false) String imageUrl,
        @AuthenticationPrincipal JwtUserPrincipal principal
) {
    try {
        Produit produit = produitService.updateProduit(
                nomProduit, statut, description, prix, quantiteStock, idCategorie, idUtilisateur, id, file, imageUrl, principal);
        return ResponseEntity.ok(produit);
    } catch (IOException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", "Image invalide ou inaccessible. Vérifiez le fichier ou l'URL."
        ));
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}

    @PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "image_url", required = false) String imageUrl,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        try {
            if (file != null && !file.isEmpty()) {
                Produit produit = produitService.uploadImage(id, file, principal);
                return ResponseEntity.ok(produit);
            }
            if (imageUrl != null && !imageUrl.isBlank()) {
                Produit produit = produitService.uploadImageFromUrl(id, imageUrl, principal);
                return ResponseEntity.ok(produit);
            }
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Image invalide ou inaccessible. Vérifiez le fichier ou l'URL."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(
            @PathVariable Long id,
            @RequestParam(value = "thumb", defaultValue = "false") boolean thumb) {
        try {
            Produit produit = produitService.getProduitById(id);
            return ImageResponseFactory.build(id, produit.getImage(), produit.getImage_type(), thumb);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
