package com.esgis2026.assigame.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Arrays;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "produit")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_produit;

    @Column( nullable = false, length = 50)
    private String nom_produit;

    @Column( length = 200)
    private String description;

    @Column()
    private Double prix;

    @JsonIgnore
    @Column(columnDefinition = "bytea")
    private byte[] image;

    @Column(length = 100)
    private String image_type;

    @Column
    private LocalDateTime date_ajout;

    @Column(nullable = false)
    private String statut;

    @Column(name = "quantite_stock")
    @com.fasterxml.jackson.annotation.JsonProperty("quantite_stock")
    private Integer quantite_stock = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcategorie_produit")
    private CategorieProduit categorie_produit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @JsonProperty("has_image")
    public boolean hasImage() {
        return image != null && image.length > 0;
    }

    @JsonProperty("image_version")
    public long getImageVersion() {
        return image != null ? image.length : 0L;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id_produit == null) ? 0 : id_produit.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Produit other = (Produit) obj;
        if (id_produit == null) {
            if (other.id_produit != null)
                return false;
        } else if (!id_produit.equals(other.id_produit))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Produit [id_produit=" + id_produit + ", nom_produit=" + nom_produit + ", description=" + description
                + ", prix=" + prix + ", image=" + Arrays.toString(image) + ", image_type=" + image_type
                + ", date_ajout=" + date_ajout + ", statut=" + statut + ", categorie_produit=" + categorie_produit
                + ", utilisateur=" + utilisateur + "]";
    }

    
    

}
