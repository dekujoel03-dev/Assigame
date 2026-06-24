package com.esgis2026.assigame.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Utilisateur;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    @Query("SELECT u FROM Utilisateur u LEFT JOIN FETCH u.type_utilisateur WHERE u.mail_utilisateur = :email")
    Optional<Utilisateur> findByMailUtilisateurWithType(@Param("email") String email);

    @Query("SELECT u FROM Utilisateur u LEFT JOIN FETCH u.type_utilisateur WHERE u.id_utilisateur = :id")
    Optional<Utilisateur> findByIdWithType(@Param("id") Long id);

    @Query("SELECT u FROM Utilisateur u LEFT JOIN FETCH u.type_utilisateur")
    List<Utilisateur> findAllWithType();
}
