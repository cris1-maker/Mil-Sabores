package com.milsabores.api.auth.controller;

import com.milsabores.api.auth.dto.*;
import com.milsabores.api.auth.model.UserAccount;
import com.milsabores.api.auth.repository.UserAccountRepository;
import com.milsabores.api.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final UserAccountRepository users;
  private final PasswordEncoder pe;
  private final JwtUtil jwt;

  public AuthController(UserAccountRepository users, PasswordEncoder pe, JwtUtil jwt) {
    this.users = users; this.pe = pe; this.jwt = jwt;
  }

  @PostMapping("/register")
  public MeDto register(@RequestBody RegisterRequest r) {
    if (users.existsByEmail(r.email())) throw new IllegalArgumentException("EMAIL_TAKEN");
    var u = UserAccount.builder()
        .email(r.email())
        .passwordHash(pe.encode(r.password()))
        .role(UserAccount.Role.USER)
        .build();
    users.save(u);
    return new MeDto(u.getId(), u.getEmail(), u.getRole().name());
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody LoginRequest r) {
    var u = users.findByEmail(r.email()).orElseThrow(() -> new IllegalArgumentException("INVALID_CREDENTIALS"));
    if (!pe.matches(r.password(), u.getPasswordHash())) throw new IllegalArgumentException("INVALID_CREDENTIALS");
    var token = jwt.createToken(u.getId(), u.getEmail(), u.getRole().name());
    return new AuthResponse(token);
  }

  @GetMapping("/me")
  public MeDto me(@RequestAttribute(name="uid", required=false) Long uid) {
    // Opcional: podrías crear un resolver; por simplicidad consultamos por SecurityContext:
    var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof Long p)) throw new RuntimeException("UNAUTHORIZED");
    var u = users.findById(p).orElseThrow();
    return new MeDto(u.getId(), u.getEmail(), u.getRole().name());
  }
}
