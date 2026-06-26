package com.esgis2026.assigame.service;

import com.esgis2026.assigame.exception.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

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

    public String encodeRawPassword(String password) {
        if (password == null || password.isBlank()) {
            throw new BadRequestException("Mot de passe requis");
        }
        if (isEncoded(password)) {
            throw new BadRequestException("Format de mot de passe invalide");
        }
        return encode(password);
    }

    public boolean verifyCredential(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null) {
            return false;
        }
        if (isEncoded(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return constantTimeEquals(rawPassword, storedPassword);
    }

    public boolean needsUpgrade(String storedPassword) {
        return storedPassword != null && !isEncoded(storedPassword);
    }

    private boolean constantTimeEquals(String left, String right) {
        return MessageDigest.isEqual(
                left.getBytes(StandardCharsets.UTF_8),
                right.getBytes(StandardCharsets.UTF_8)
        );
    }
}
