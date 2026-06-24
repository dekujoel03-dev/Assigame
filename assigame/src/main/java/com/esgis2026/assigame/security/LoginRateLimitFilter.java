package com.esgis2026.assigame.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private final int maxAttempts;
    private final long windowMs;
    private final Map<String, AttemptWindow> attempts = new ConcurrentHashMap<>();

    public LoginRateLimitFilter(
            @Value("${app.security.login-max-attempts:10}") int maxAttempts,
            @Value("${app.security.login-window-ms:60000}") long windowMs) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if (!isLoginAttempt(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = clientKey(request);
        AttemptWindow window = attempts.computeIfAbsent(key, ignored -> new AttemptWindow());
        synchronized (window) {
            window.resetIfExpired(windowMs);
            if (window.count.incrementAndGet() > maxAttempts) {
                response.setStatus(429);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                response.getWriter().write(
                        "{\"message\":\"Trop de tentatives de connexion. Réessayez dans une minute.\"}"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isLoginAttempt(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod())
                && request.getRequestURI() != null
                && request.getRequestURI().endsWith("/api/auth/login");
    }

    private String clientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final class AttemptWindow {
        private final AtomicInteger count = new AtomicInteger(0);
        private long startedAt = System.currentTimeMillis();

        void resetIfExpired(long windowMs) {
            long now = System.currentTimeMillis();
            if (now - startedAt > windowMs) {
                count.set(0);
                startedAt = now;
            }
        }
    }
}
