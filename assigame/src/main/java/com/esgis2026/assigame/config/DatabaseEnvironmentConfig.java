package com.esgis2026.assigame.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Convertit DATABASE_URL (format Render/Heroku) en URL JDBC pour Spring Boot.
 */
public class DatabaseEnvironmentConfig implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        String jdbcUrl = databaseUrl.startsWith("jdbc:") ? databaseUrl : "jdbc:" + databaseUrl;
        Map<String, Object> properties = new HashMap<>();
        properties.put("spring.datasource.url", jdbcUrl);
        environment.getPropertySources().addFirst(new MapPropertySource("renderDatabase", properties));
    }
}
