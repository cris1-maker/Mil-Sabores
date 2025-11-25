package com.milsabores.api.auth.service;

import com.milsabores.api.auth.dto.ProfileDto;
import com.milsabores.api.auth.model.UserAccount;
import com.milsabores.api.auth.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserAccountService {

    private final UserAccountRepository repo;

    public UserAccountService(UserAccountRepository repo) {
        this.repo = repo;
    }

    public UserAccount save(UserAccount u) {
        return repo.save(u);
    }

    public List<UserAccount> findAll() {
        return repo.findAll();
    }

    private ProfileDto toDto(UserAccount u) {
        return new ProfileDto(
                u.getId(),
                u.getEmail(),
                u.getFullName(),
                u.getRole().name()
        );
    }

    // ==== PARA LISTADOS ====
    public List<ProfileDto> findAllProfiles() {
        return repo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public ProfileDto findProfileById(Long id) {
        var u = repo.findById(id).orElseThrow();
        return toDto(u);
    }

    public ProfileDto findProfileByEmail(String email) {
        var u = repo.findByEmail(email).orElseThrow();
        return toDto(u);
    }

    // ==== LO NUEVO: resolver según auth.getName() (email o id) ====
    public ProfileDto findProfileByAuthName(String name) {
        Optional<UserAccount> opt = repo.findByEmail(name);

        if (opt.isEmpty()) {
            try {
                Long id = Long.parseLong(name);
                opt = repo.findById(id);
            } catch (NumberFormatException ignored) {
                // no era número, dejamos opt vacío
            }
        }

        var u = opt.orElseThrow();
        return toDto(u);
    }
}
