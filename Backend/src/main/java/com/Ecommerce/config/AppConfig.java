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

    PasswordEncoder passwordEncoder;

    static final String ADMIN_USER_NAME = "admin";
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()) {

                // Tạo Role USER
                Role userRole = new Role();
                userRole.setName(PredefinedRole.USER_ROLE);
                userRole.setDescription("User role");
                roleRepository.save(userRole);

                // Tạo Role ADMIN
                Role adminRole = new Role();
                adminRole.setName(PredefinedRole.ADMIN_ROLE);
                adminRole.setDescription("Admin role");
                roleRepository.save(adminRole);

                // Gán role ADMIN cho user admin
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                // Tạo user admin
                User user = new User();
                user.setUsername(ADMIN_USER_NAME);
                user.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                user.setRoles(roles);

                userRepository.save(user);

            }
        };
    }
}
