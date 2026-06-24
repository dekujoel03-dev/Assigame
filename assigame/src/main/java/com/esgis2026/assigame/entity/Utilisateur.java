package com.esgis2026.assigame.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_utilisateur;

    @Column(nullable = false ,length = 40)
    private String nom_utilisateur;

    @Column(nullable = false, length = 40)
    private String prenom_utilisateur;

    @Column( nullable = false, length = 1)
    private String sexe_utilisateur;

    @Column(nullable = false, unique = true)
    private String telephone_utilisateur;

    @Column(unique = true, length = 100)
    private String mail_utilisateur;

    @Column(nullable = false, length = 100)
    private String login_utilisateur;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 100)
    private String password_utilisateur;

    @Column( unique = true, length = 200)
    private String residence_utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type_utilisateur")
    private TypeUtilisateur type_utilisateur;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id_utilisateur == null) ? 0 : id_utilisateur.hashCode());
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
        Utilisateur other = (Utilisateur) obj;
        if (id_utilisateur == null) {
            if (other.id_utilisateur != null)
                return false;
        } else if (!id_utilisateur.equals(other.id_utilisateur))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Utilisateur [id_utilisateur=" + id_utilisateur + ", nom_utilisateur=" + nom_utilisateur
                + ", prenom_utilisateur=" + prenom_utilisateur + ", mail_utilisateur=" + mail_utilisateur
                + ", residence_utilisateur=" + residence_utilisateur + "]";
    }

}
