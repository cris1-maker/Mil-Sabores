package com.milsabores.api.auth.controller;

import com.milsabores.api.auth.dto.ProfileDto;
import com.milsabores.api.auth.service.UserAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserAccountService service;

    public UserController(UserAccountService service) {
        this.service = service;
    }

    // === LISTAR TODOS LOS USUARIOS (AdminUsuarios) ===
    @GetMapping
    public List<ProfileDto> list() {
        return service.findAllProfiles();
    }

    // === PERFIL DEL USUARIO AUTENTICADO (AdminPerfil) ===
    @GetMapping("/me")
    public ProfileDto me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sin autenticación válida"
            );
        }

        String name = auth.getName();
        return service.findProfileByAuthName(name);
    }
}
