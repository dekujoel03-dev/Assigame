package com.esgis2026.assigame.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final PasswordEncoder passwordEncoder;

    public PasswordService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean isEncoded(String password) {
        return password != null
                && (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }

    public String encodeIfNeeded(String password) {
        if (password == null || password.isBlank() || isEncoded(password)) {
            return password;
        }
        return encode(password);
    }

    /**
     * Vérifie le mot de passe. Accepte les anciens mots de passe en clair (migration).
     */
    public boolean matches(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null) {
            return false;
        }
        if (isEncoded(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return storedPassword.equals(rawPassword);
    }

    public boolean needsUpgrade(String storedPassword) {
        return storedPassword != null && !isEncoded(storedPassword);
    }
}
