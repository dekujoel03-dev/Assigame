package com.esgis2026.assigame.config;

import com.esgis2026.assigame.security.JwtAccessDeniedHandler;
import com.esgis2026.assigame.security.JwtAuthenticationEntryPoint;
import com.esgis2026.assigame.security.JwtAuthenticationFilter;
import com.esgis2026.assigame.security.LoginRateLimitFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final LoginRateLimitFilter loginRateLimitFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            JwtAccessDeniedHandler jwtAccessDeniedHandler,
            LoginRateLimitFilter loginRateLimitFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
        this.loginRateLimitFilter = loginRateLimitFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                .headers(headers -> headers
                        .contentTypeOptions(withDefaults())
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'none'; frame-ancestors 'none';")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/add").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produit/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorieproduit/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/typeutilisateur/**").permitAll()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categorieproduit/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorieproduit/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categorieproduit/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/typeutilisateur/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/typeutilisateur/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/typeutilisateur/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/produit/**").hasAnyRole("ADMIN", "SELLER")
                        .requestMatchers(HttpMethod.PUT, "/api/produit/**").hasAnyRole("ADMIN", "SELLER")
                        .requestMatchers(HttpMethod.DELETE, "/api/produit/**").hasAnyRole("ADMIN", "SELLER")
                        .requestMatchers("/api/auth/me").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(loginRateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
