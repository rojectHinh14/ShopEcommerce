package com.Ecommerce.config;

import com.Ecommerce.entity.Role;
import com.Ecommerce.entity.User;
import com.Ecommerce.repository.RoleRepository;
import com.Ecommerce.repository.UserRepository;
import com.Ecommerce.util.PredefinedRole;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppConfig {

    @Autowired
    PasswordEncoder passwordEncoder;

    static final String ADMIN_USER_NAME = "admin@gmail.com";
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()) {

                Role userRole = roleRepository.findByName(PredefinedRole.USER_ROLE)
                        .orElseGet(() -> {
                            Role newUserRole = new Role();
                            newUserRole.setName(PredefinedRole.USER_ROLE);
                            newUserRole.setDescription("User role");
                            return roleRepository.save(newUserRole);
                        });

                Role adminRole = roleRepository.findByName(PredefinedRole.ADMIN_ROLE)
                        .orElseGet(() -> {
                            Role newAdminRole = new Role();
                            newAdminRole.setName(PredefinedRole.ADMIN_ROLE);
                            newAdminRole.setDescription("Admin role");
                            return roleRepository.save(newAdminRole);
                        });

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User adminUser = new User();
                adminUser.setUsername(ADMIN_USER_NAME);
                adminUser.setEmail("admin@email.com");
                adminUser.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                adminUser.setRoles(roles);

                userRepository.save(adminUser);

            }
        };
    }}
