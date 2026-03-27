package com.jeevanam360.backend.auth;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final List<String> configuredAdminEmails;

    public AuthService(
        UserAccountRepository userAccountRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        @Value("${app.admin.emails:srinithisrinithi09@gmail.com}") String adminEmails
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.configuredAdminEmails = Arrays.stream(adminEmails.split(","))
            .map(this::normalizeEmail)
            .filter(value -> !value.isBlank())
            .distinct()
            .toList();
    }

    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userAccountRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        UserAccount user = new UserAccount();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPhone(request.phone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(resolveRole(normalizedEmail));
        user.setActive(true);

        UserAccount saved = userAccountRepository.save(user);
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmail(normalizeEmail(request.email()))
            .orElseThrow(() -> new IllegalArgumentException("No account was found with this email."));

        if (!user.isActive()) {
            throw new IllegalArgumentException("This account is currently inactive.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("The password is incorrect.");
        }

        user = syncConfiguredRole(user);
        return buildAuthResponse(user);
    }

    public AuthUserProfileResponse getCurrentUserProfile(String userId) {
        UserAccount user = userAccountRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("The signed-in user could not be found."));

        return AuthUserProfileResponse.from(syncConfiguredRole(user));
    }

    private AuthResponse buildAuthResponse(UserAccount user) {
        return new AuthResponse(jwtService.generateToken(user), AuthUserProfileResponse.from(user));
    }

    private UserAccount syncConfiguredRole(UserAccount user) {
        String resolvedRole = resolveRole(user.getEmail());
        if (!resolvedRole.equalsIgnoreCase(user.getRole())) {
            user.setRole(resolvedRole);
            return userAccountRepository.save(user);
        }
        return user;
    }

    private String resolveRole(String email) {
        return configuredAdminEmails.contains(normalizeEmail(email)) ? "ADMIN" : "USER";
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ENGLISH);
    }
}
