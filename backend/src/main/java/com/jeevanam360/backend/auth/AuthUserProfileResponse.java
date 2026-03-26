package com.jeevanam360.backend.auth;

public record AuthUserProfileResponse(
    String id,
    String name,
    String email,
    String phone,
    String role
) {
    public static AuthUserProfileResponse from(UserAccount user) {
        return new AuthUserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole()
        );
    }
}
