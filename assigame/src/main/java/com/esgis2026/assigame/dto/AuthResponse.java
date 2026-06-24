package com.esgis2026.assigame.dto;

import com.esgis2026.assigame.entity.Utilisateur;

public class AuthResponse {
    private String token;
    private Utilisateur user;

    public AuthResponse() {
    }

    public AuthResponse(String token, Utilisateur user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Utilisateur getUser() {
        return user;
    }

    public void setUser(Utilisateur user) {
        this.user = user;
    }
}
