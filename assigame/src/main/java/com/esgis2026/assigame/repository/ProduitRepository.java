package com.esgis2026.assigame.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Produit;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    @Query("SELECT p FROM Produit p LEFT JOIN FETCH p.categorie_produit LEFT JOIN FETCH p.utilisateur u LEFT JOIN FETCH u.type_utilisateur")
    List<Produit> findAllWithRelations();

    @Query("SELECT p FROM Produit p LEFT JOIN FETCH p.categorie_produit LEFT JOIN FETCH p.utilisateur u LEFT JOIN FETCH u.type_utilisateur WHERE p.id_produit = :id")
    Optional<Produit> findByIdWithRelations(@Param("id") Long id);
}
