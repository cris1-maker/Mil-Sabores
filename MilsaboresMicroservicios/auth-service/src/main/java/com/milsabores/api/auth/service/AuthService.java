package com.milsabores.api.auth.service;

import com.milsabores.api.auth.dto.AuthResponse;
import com.milsabores.api.auth.dto.LoginRequest;
import com.milsabores.api.auth.dto.RegisterRequest;
import com.milsabores.api.auth.model.UserAccount;
import com.milsabores.api.auth.repository.UserAccountRepository;
import com.milsabores.api.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserAccountRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest r) {
        var email = r.email().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("Email ya registrado");
        }

        var ua = UserAccount.builder()
                .email(email)
                .fullName(r.fullName() == null ? "Usuario" : r.fullName())
                .passwordHash(encoder.encode(r.password()))   // <- passwordHash
                .role(UserAccount.Role.USER)                  // <- role por defecto
                .build();

        users.save(ua); // <- OK

        // Usa createToken(id, email, role) como definimos en JwtUtil
        String token = jwt.createToken(ua.getId(), ua.getEmail(), ua.getRole().name());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest r) {
        var ua = users.findByEmail(r.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (!encoder.matches(r.password(), ua.getPasswordHash())) { // <- passwordHash
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        String token = jwt.createToken(ua.getId(), ua.getEmail(), ua.getRole().name()); // <- createToken
        return new AuthResponse(token);
    }
}
