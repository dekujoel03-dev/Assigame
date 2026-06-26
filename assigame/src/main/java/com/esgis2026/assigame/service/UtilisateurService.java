package com.esgis2026.assigame.service;

import com.esgis2026.assigame.dto.RegisterUserRequest;
import com.esgis2026.assigame.entity.TypeUtilisateur;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.exception.ConflictException;
import com.esgis2026.assigame.exception.ResourceNotFoundException;
import com.esgis2026.assigame.repository.TypeUtilisateurRepository;
import com.esgis2026.assigame.repository.UtilisateurRepository;
import com.esgis2026.assigame.security.UserRoleResolver;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurService {
    final UtilisateurRepository utilisateurRepository;
    private final TypeUtilisateurRepository typeUtilisateurRepository;
    private final PasswordService passwordService;

    public UtilisateurService(
            UtilisateurRepository utilisateurRepository,
            TypeUtilisateurRepository typeUtilisateurRepository,
            PasswordService passwordService) {
        this.utilisateurRepository = utilisateurRepository;
        this.typeUtilisateurRepository = typeUtilisateurRepository;
        this.passwordService = passwordService;
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAllWithType();
    }

    public Utilisateur registerPublicUser(RegisterUserRequest request) {
        String email = request.getMail_utilisateur().trim().toLowerCase();
        String telephone = request.getTelephone_utilisateur().trim();

        if (utilisateurRepository.existsByMail_utilisateur(email)) {
            throw new ConflictException("Cet email est déjà utilisé");
        }
        if (utilisateurRepository.existsByTelephone_utilisateur(telephone)) {
            throw new ConflictException("Ce numéro de téléphone est déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom_utilisateur(request.getNom_utilisateur().trim());
        utilisateur.setPrenom_utilisateur(request.getPrenom_utilisateur().trim());
        utilisateur.setSexe_utilisateur(request.getSexe_utilisateur().trim().toUpperCase());
        utilisateur.setTelephone_utilisateur(telephone);
        utilisateur.setMail_utilisateur(email);
        utilisateur.setLogin_utilisateur(email);
        utilisateur.setResidence_utilisateur(request.getResidence_utilisateur().trim());
        utilisateur.setPassword_utilisateur(
                passwordService.encodeRawPassword(request.getPassword_utilisateur()));
        utilisateur.setType_utilisateur(resolveSellerType());
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long idUtilisateur) {
        utilisateurRepository.deleteById(idUtilisateur);
    }

    public Utilisateur updateUtilisateur(Utilisateur details, Long idUtilisateur) {
        Utilisateur utiliateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        utiliateur.setNom_utilisateur(details.getNom_utilisateur());
        utiliateur.setMail_utilisateur(details.getMail_utilisateur());
        utiliateur.setSexe_utilisateur(details.getSexe_utilisateur());
        utiliateur.setResidence_utilisateur(details.getResidence_utilisateur());
        utiliateur.setPrenom_utilisateur(details.getPrenom_utilisateur());
        utiliateur.setLogin_utilisateur(details.getLogin_utilisateur());
        if (details.getPassword_utilisateur() != null && !details.getPassword_utilisateur().isBlank()) {
            utiliateur.setPassword_utilisateur(
                    passwordService.encodeRawPassword(details.getPassword_utilisateur()));
        }

        return utilisateurRepository.save(utiliateur);
    }

    private TypeUtilisateur resolveSellerType() {
        return typeUtilisateurRepository.findAll().stream()
                .filter(UserRoleResolver::isSellerType)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Type vendeur introuvable"));
    }
}
