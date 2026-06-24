package com.esgis2026.assigame.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "categorieproduit")
public class CategorieProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idcategorie_produit;

    @Column(unique = true, nullable = false, length = 40)
    private String nom_categorieproduit;

    @Column(length = 100)
    private String description;

    @JsonIgnore
    @Column(columnDefinition = "bytea")
    private byte[] image;

    @Column(length = 100)
    private String image_type;

    @JsonProperty("has_image")
    public boolean hasImage() {
        return image != null && image.length > 0;
    }

    @JsonProperty("image_version")
    public long getImageVersion() {
        return image != null ? image.length : 0L;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CategorieProduit that = (CategorieProduit) o;
        return Objects.equals(idcategorie_produit, that.idcategorie_produit);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(idcategorie_produit);
    }

    @Override
    public String toString() {
        return "categorieProduit{" +
                "idcategorie_produit=" + idcategorie_produit +
                ", nom_categorieproduit='" + nom_categorieproduit + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}

