package com.milsabores.api;

import com.milsabores.api.auth.model.UserAccount;
import com.milsabores.api.auth.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MilSaboresApplication {
    public static void main(String[] args) {
        SpringApplication.run(MilSaboresApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(UserAccountRepository users, PasswordEncoder encoder) {
        return args -> {
            // ADMIN
            users.findByEmail("admin@duoc.cl").orElseGet(() -> {
                UserAccount admin = new UserAccount();
                admin.setEmail("admin@duoc.cl");
                admin.setFullName("Administrador MilSabores");
                admin.setPasswordHash(encoder.encode("Admin123"));
                admin.setRole(UserAccount.Role.ADMIN);
                return users.save(admin);
            });

            // CLIENTE (opcional)
            users.findByEmail("cliente@gmail.com").orElseGet(() -> {
                UserAccount cliente = new UserAccount();
                cliente.setEmail("cliente@gmail.com");
                cliente.setFullName("Cliente de Prueba");
                cliente.setPasswordHash(encoder.encode("Cliente123"));
                cliente.setRole(UserAccount.Role.USER);
                return users.save(cliente);
            });
        };
    }
}
