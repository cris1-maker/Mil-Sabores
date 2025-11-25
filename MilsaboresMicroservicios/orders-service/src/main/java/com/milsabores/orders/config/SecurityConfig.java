package com.milsabores.orders.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Habilitar CORS manejado por Spring Security
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Deshabilitar CSRF porque estás haciendo API REST
            .csrf(csrf -> csrf.disable())
            // Dejar todo permitido (la seguridad real la tienes en el auth-service)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Desde dónde permites llamadas
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://milsabores-web.s3-website-us-east-1.amazonaws.com"
        ));

        // Qué métodos permites
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Qué headers permites
        config.setAllowedHeaders(List.of("*"));

        // Si usas cookies / Authorization header, esto en true
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
