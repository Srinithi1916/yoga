package com.jeevanam360.backend.auth;

public record AuthResponse(
    String token,
    AuthUserProfileResponse user
) {
}
