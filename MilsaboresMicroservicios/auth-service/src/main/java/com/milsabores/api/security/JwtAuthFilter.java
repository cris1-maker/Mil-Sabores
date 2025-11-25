package com.milsabores.api.security;

import com.milsabores.api.auth.repository.UserAccountRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException; // <- IMPORT CORRECTO (jjwt 0.12.5)
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwt;
    private final UserAccountRepository users;

    public JwtAuthFilter(JwtUtil jwt, UserAccountRepository users) {
        this.jwt = jwt; this.users = users;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String h = req.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) {
            String token = h.substring(7);
            try {
                var jws = jwt.parse(token);
                Claims c = jws.getPayload();
                Long uid = c.get("uid", Number.class).longValue();
                String role = c.get("role", String.class);

                users.findById(uid).orElseThrow(); // usuario sigue existiendo

                var auth = new AbstractAuthenticationToken(
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))) {
                    @Override public Object getCredentials() { return token; }
                    @Override public Object getPrincipal() { return uid; }
                };
                auth.setAuthenticated(true);
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext().setAuthentication(auth);
            } catch (JwtException e) {
                // Token inválido → seguimos sin autenticar
            } catch (RuntimeException e) {
                // Otros errores en tiempo de ejecución → seguimos sin autenticar
            }
        }
        chain.doFilter(req, res);
    }
}
