package com.jeevanam360.backend.auth;

import java.time.Instant;
import java.util.Arrays;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    @Bean
    public ApplicationRunner adminAccountBootstrap(
        UserAccountRepository userAccountRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.admin.emails:}") String adminEmails,
        @Value("${app.admin.bootstrap-password:}") String bootstrapPassword,
        @Value("${app.admin.bootstrap-name:Jeevanam 360 Admin}") String bootstrapName,
        @Value("${app.admin.bootstrap-phone:}") String bootstrapPhone
    ) {
        return args -> {
            String primaryAdminEmail = Arrays.stream(adminEmails.split(","))
                .map(this::normalizeEmail)
                .filter(value -> !value.isBlank())
                .findFirst()
                .orElse("");

            if (primaryAdminEmail.isBlank()) {
                return;
            }

            String trimmedPassword = trimToNull(bootstrapPassword);
            if (trimmedPassword == null) {
                LOGGER.info("Admin bootstrap skipped because APP_ADMIN_BOOTSTRAP_PASSWORD is not set.");
                return;
            }

            UserAccount user = userAccountRepository.findByEmail(primaryAdminEmail)
                .orElseGet(UserAccount::new);

            boolean updated = false;
            if (user.getId() == null) {
                user.setEmail(primaryAdminEmail);
                user.setCreatedAt(Instant.now());
                updated = true;
            }

            String resolvedName = trimToNull(bootstrapName);
            if (resolvedName != null && !resolvedName.equals(user.getName())) {
                user.setName(resolvedName);
                updated = true;
            }

            String resolvedPhone = trimToNull(bootstrapPhone);
            if (resolvedPhone != null && !resolvedPhone.equals(user.getPhone())) {
                user.setPhone(resolvedPhone);
                updated = true;
            }

            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                user.setRole("ADMIN");
                updated = true;
            }

            if (!user.isActive()) {
                user.setActive(true);
                updated = true;
            }

            if (user.getPasswordHash() == null || !passwordEncoder.matches(trimmedPassword, user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode(trimmedPassword));
                updated = true;
            }

            if (updated) {
                userAccountRepository.save(user);
                LOGGER.info("Admin account synced for {}.", primaryAdminEmail);
            }
        };
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ENGLISH);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
