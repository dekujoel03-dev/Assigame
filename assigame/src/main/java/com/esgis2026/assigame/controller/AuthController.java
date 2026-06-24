package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.dto.AuthResponse;
import com.esgis2026.assigame.dto.LoginRequest;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.UtilisateurRepository;
import com.esgis2026.assigame.security.JwtUserPrincipal;
import com.esgis2026.assigame.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UtilisateurRepository utilisateurRepository;

    public AuthController(AuthService authService, UtilisateurRepository utilisateurRepository) {
        this.authService = authService;
        this.utilisateurRepository = utilisateurRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Utilisateur> me(@AuthenticationPrincipal JwtUserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return utilisateurRepository.findByIdWithType(principal.getUserId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
