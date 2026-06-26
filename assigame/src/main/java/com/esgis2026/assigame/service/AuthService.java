package com.esgis2026.assigame.service;

import com.esgis2026.assigame.dto.AuthResponse;
import com.esgis2026.assigame.dto.LoginRequest;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.exception.InvalidCredentialsException;
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
        String email = request.getEmail().trim().toLowerCase();
        Utilisateur utilisateur = utilisateurRepository.findByMailUtilisateurWithType(email)
                .orElseThrow(InvalidCredentialsException::new);

        String storedPassword = utilisateur.getPassword_utilisateur();
        if (!passwordService.verifyCredential(request.getPassword(), storedPassword)) {
            throw new InvalidCredentialsException();
        }

        if (passwordService.needsUpgrade(storedPassword)) {
            utilisateur.setPassword_utilisateur(passwordService.encode(request.getPassword()));
            utilisateurRepository.save(utilisateur);
        }

        String token = jwtService.generateToken(utilisateur);
        return new AuthResponse(token, utilisateur);
    }
}
