package com.esgis2026.assigame.security;

import com.esgis2026.assigame.entity.TypeUtilisateur;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserRoleResolverTest {

    @Test
    void resolveRole_administrateur_exact() {
        TypeUtilisateur type = typeWithLabel("Administrateur");
        assertEquals(UserRoleResolver.ROLE_ADMIN, UserRoleResolver.resolveRole(type));
        assertTrue(UserRoleResolver.isAdminType(type));
    }

    @Test
    void resolveRole_vendeur_exact() {
        TypeUtilisateur type = typeWithLabel("Vendeur");
        assertEquals(UserRoleResolver.ROLE_SELLER, UserRoleResolver.resolveRole(type));
        assertTrue(UserRoleResolver.isSellerType(type));
    }

    @Test
    void resolveRole_doesNotElevateSimilarLabels() {
        TypeUtilisateur type = typeWithLabel("Super-Admin délégué");
        assertEquals(UserRoleResolver.ROLE_SELLER, UserRoleResolver.resolveRole(type));
        assertFalse(UserRoleResolver.isAdminType(type));
    }

    @Test
    void resolveRole_nullTypeDefaultsToSeller() {
        assertEquals(UserRoleResolver.ROLE_SELLER, UserRoleResolver.resolveRole(null));
    }

    private static TypeUtilisateur typeWithLabel(String label) {
        TypeUtilisateur type = new TypeUtilisateur();
        type.setLibelle_type_utilisateur(label);
        return type;
    }
}
