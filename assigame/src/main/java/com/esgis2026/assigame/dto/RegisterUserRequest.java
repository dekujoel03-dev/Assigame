package com.esgis2026.assigame.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterUserRequest {

    @NotBlank
    @Size(min = 2, max = 40)
    private String nom_utilisateur;

    @NotBlank
    @Size(min = 2, max = 40)
    private String prenom_utilisateur;

    @NotBlank
    @Pattern(regexp = "[MF]", message = "Le sexe doit être M ou F")
    private String sexe_utilisateur;

    @NotBlank
    @Size(min = 8, max = 20)
    private String telephone_utilisateur;

    @NotBlank
    @Email
    @Size(max = 100)
    private String mail_utilisateur;

    @NotBlank
    @Size(min = 8, max = 100)
    private String password_utilisateur;

    @NotBlank
    @Size(max = 200)
    private String residence_utilisateur;

    public String getNom_utilisateur() {
        return nom_utilisateur;
    }

    public void setNom_utilisateur(String nom_utilisateur) {
        this.nom_utilisateur = nom_utilisateur;
    }

    public String getPrenom_utilisateur() {
        return prenom_utilisateur;
    }

    public void setPrenom_utilisateur(String prenom_utilisateur) {
        this.prenom_utilisateur = prenom_utilisateur;
    }

    public String getSexe_utilisateur() {
        return sexe_utilisateur;
    }

    public void setSexe_utilisateur(String sexe_utilisateur) {
        this.sexe_utilisateur = sexe_utilisateur;
    }

    public String getTelephone_utilisateur() {
        return telephone_utilisateur;
    }

    public void setTelephone_utilisateur(String telephone_utilisateur) {
        this.telephone_utilisateur = telephone_utilisateur;
    }

    public String getMail_utilisateur() {
        return mail_utilisateur;
    }

    public void setMail_utilisateur(String mail_utilisateur) {
        this.mail_utilisateur = mail_utilisateur;
    }

    public String getPassword_utilisateur() {
        return password_utilisateur;
    }

    public void setPassword_utilisateur(String password_utilisateur) {
        this.password_utilisateur = password_utilisateur;
    }

    public String getResidence_utilisateur() {
        return residence_utilisateur;
    }

    public void setResidence_utilisateur(String residence_utilisateur) {
        this.residence_utilisateur = residence_utilisateur;
    }
}
