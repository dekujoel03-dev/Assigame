package com.esgis2026.assigame.service;

import com.esgis2026.assigame.dto.AuthResponse;
import com.esgis2026.assigame.dto.LoginRequest;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.UtilisateurRepository;
import com.esgis2026.assigame.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public AuthService(
            UtilisateurRepository utilisateurRepository,
            PasswordService passwordService,
            JwtService jwtService
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByMailUtilisateurWithType(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        String storedPassword = utilisateur.getPassword_utilisateur();
        if (!passwordService.matches(request.getPassword(), storedPassword)) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        if (passwordService.needsUpgrade(storedPassword)) {
            utilisateur.setPassword_utilisateur(passwordService.encode(request.getPassword()));
            utilisateurRepository.save(utilisateur);
        }

        String token = jwtService.generateToken(utilisateur);
        return new AuthResponse(token, utilisateur);
    }
}
