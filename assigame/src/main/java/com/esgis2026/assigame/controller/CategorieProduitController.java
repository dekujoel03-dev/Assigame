package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.service.CategorieProduitService;
import com.esgis2026.assigame.util.ImageResponseFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorieproduit")
public class CategorieProduitController {
    private final CategorieProduitService categorieProduitService;

    public CategorieProduitController(CategorieProduitService categorieProduitService) {
        this.categorieProduitService = categorieProduitService;
    }

    @GetMapping("/list")
    public List<CategorieProduit> getAllCategorieProduits() {
        return categorieProduitService.getAllCategorieProduits();
    }

    @GetMapping("/{id}")
    public CategorieProduit getCategorieProduitById(@PathVariable Long id) {
        return categorieProduitService.getCategorieProduitById(id);
    }

    @PostMapping("/add")
    public CategorieProduit addCategorieProduit(@RequestBody CategorieProduit categorieProduit) {
        return categorieProduitService.createCategorieProduit(categorieProduit);
    }

    @DeleteMapping("delete/{id}")
    public void deleteCategorieProduit(@PathVariable Long id) {
        categorieProduitService.deleteCategorieProduit(id);
    }

    @PutMapping("update/{id}")
    public CategorieProduit updateCategorieProduit(@RequestBody CategorieProduit categorieProduit, @PathVariable Long id) {
        return categorieProduitService.updateCategorieProduit(id, categorieProduit);
    }

    @PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "image_url", required = false) String imageUrl) {
        try {
            if (file != null && !file.isEmpty()) {
                CategorieProduit categorie = categorieProduitService.uploadImage(id, file);
                return ResponseEntity.ok(categorie);
            }
            if (imageUrl != null && !imageUrl.isBlank()) {
                CategorieProduit categorie = categorieProduitService.uploadImageFromUrl(id, imageUrl);
                return ResponseEntity.ok(categorie);
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
            CategorieProduit categorie = categorieProduitService.getCategorieProduitById(id);
            return ImageResponseFactory.build(id, categorie.getImage(), categorie.getImage_type(), thumb);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
