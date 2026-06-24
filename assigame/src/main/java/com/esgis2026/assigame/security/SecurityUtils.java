package com.esgis2026.assigame.security;

import com.esgis2026.assigame.entity.Produit;
import org.springframework.security.access.AccessDeniedException;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static boolean isAdmin(JwtUserPrincipal principal) {
        return principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());
    }

    public static void assertCanModifyProduct(Produit produit, JwtUserPrincipal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentification requise");
        }
        if (isAdmin(principal)) {
            return;
        }

        Long ownerId = produit.getUtilisateur() != null
                ? produit.getUtilisateur().getId_utilisateur()
                : null;
        if (ownerId == null || !ownerId.equals(principal.getUserId())) {
            throw new AccessDeniedException("Vous ne pouvez modifier que vos propres produits");
        }
    }

    public static Long resolveOwnerId(Long requestedOwnerId, JwtUserPrincipal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentification requise");
        }
        if (isAdmin(principal)) {
            return requestedOwnerId != null ? requestedOwnerId : principal.getUserId();
        }
        return principal.getUserId();
    }
}
