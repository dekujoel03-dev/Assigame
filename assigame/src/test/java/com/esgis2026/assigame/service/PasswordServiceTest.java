package com.esgis2026.assigame.service;

import com.esgis2026.assigame.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordServiceTest {

    private PasswordService passwordService;

    @BeforeEach
    void setUp() {
        passwordService = new PasswordService(new BCryptPasswordEncoder());
    }

    @Test
    void verifyCredential_acceptsBcryptHash() {
        String encoded = passwordService.encode("seller123");
        assertTrue(passwordService.verifyCredential("seller123", encoded));
        assertFalse(passwordService.verifyCredential("wrong", encoded));
    }

    @Test
    void encodeRawPassword_rejectsPreEncodedValue() {
        String encoded = passwordService.encode("seller123");
        assertThrows(BadRequestException.class, () -> passwordService.encodeRawPassword(encoded));
    }

    @Test
    void verifyCredential_rejectsLegacyPlaintextAfterUpgradeNeeded() {
        assertTrue(passwordService.needsUpgrade("plain-password"));
        assertTrue(passwordService.verifyCredential("plain-password", "plain-password"));
    }
}
