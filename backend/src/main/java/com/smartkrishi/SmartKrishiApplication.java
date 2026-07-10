package com.smartkrishi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class SmartKrishiApplication {

    public static void main(String[] args) {
        loadDotEnv();
        String profile = System.getProperty("SPRING_PROFILES_ACTIVE");
        if (profile == null) {
            profile = System.getenv("SPRING_PROFILES_ACTIVE");
        }
        if (profile == null || "local".equals(profile)) {
            System.setProperty("spring.jpa.hibernate.ddl-auto", "update");
            System.out.println("[SmartKrishiApplication] Local profile active: set spring.jpa.hibernate.ddl-auto to update");
        }
        SpringApplication.run(SmartKrishiApplication.class, args);
    }

    private static void loadDotEnv() {
        try {
            java.io.File envFile = new java.io.File(".env");
            if (!envFile.exists()) {
                envFile = new java.io.File("../.env");
            }
            if (envFile.exists()) {
                System.out.println("[DOTENV] Loading env file from: " + envFile.getAbsolutePath());
                java.nio.file.Files.lines(envFile.toPath()).forEach(line -> {
                    String trimmed = line.trim();
                    if (!trimmed.isEmpty() && !trimmed.startsWith("#") && trimmed.contains("=")) {
                        int index = trimmed.indexOf('=');
                        String key = trimmed.substring(0, index).trim();
                        String value = trimmed.substring(index + 1).trim();
                        // Remove surrounding quotes if present
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        
                        // Ignore offline Aiven cloud database configurations
                        if (value.contains("aivencloud.com")) {
                            System.out.println("[DOTENV] Ignoring offline Aiven cloud database setting: " + key);
                            return;
                        }

                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                            System.out.println("[DOTENV] Set property: " + key + "=" + (key.contains("PASSWORD") || key.contains("SECRET") ? "******" : value));
                        } else {
                            System.out.println("[DOTENV] Skipped property (already exists): " + key);
                        }
                    }
                });
            } else {
                System.out.println("[DOTENV] No .env or ../.env file found!");
            }
        } catch (Exception e) {
            System.err.println("Failed to load .env file: " + e.getMessage());
        }
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Krishi Agricultural Marketplace")
                        .version("1.0.0")
                        .description("Complete REST API for agricultural marketplace platform with multi-vendor support")
                        .contact(new Contact()
                                .name("Smart Krishi Team")
                                .email("support@smartkrishi.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token")));
    }
}
