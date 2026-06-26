package com.esgis2026.assigame.security;

import com.esgis2026.assigame.entity.TypeUtilisateur;

public final class UserRoleResolver {

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_SELLER = "SELLER";

    private static final String ADMIN_LABEL = "administrateur";
    private static final String SELLER_LABEL = "vendeur";

    private UserRoleResolver() {
    }

    public static String resolveRole(TypeUtilisateur type) {
        if (type == null || type.getLibelle_type_utilisateur() == null) {
            return ROLE_SELLER;
        }
        String normalized = normalize(type.getLibelle_type_utilisateur());
        if (ADMIN_LABEL.equals(normalized)) {
            return ROLE_ADMIN;
        }
        return ROLE_SELLER;
    }

    public static boolean isAdminType(TypeUtilisateur type) {
        return ROLE_ADMIN.equals(resolveRole(type));
    }

    public static boolean isSellerType(TypeUtilisateur type) {
        if (type == null || type.getLibelle_type_utilisateur() == null) {
            return false;
        }
        return SELLER_LABEL.equals(normalize(type.getLibelle_type_utilisateur()));
    }

    private static String normalize(String label) {
        return label.trim().toLowerCase();
    }
}
