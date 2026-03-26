package com.jeevanam360.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserAccountRepository userAccountRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
        user.setRole("USER");
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

        return buildAuthResponse(user);
    }

    public AuthUserProfileResponse getCurrentUserProfile(String userId) {
        UserAccount user = userAccountRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("The signed-in user could not be found."));

        return AuthUserProfileResponse.from(user);
    }

    private AuthResponse buildAuthResponse(UserAccount user) {
        return new AuthResponse(jwtService.generateToken(user), AuthUserProfileResponse.from(user));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
