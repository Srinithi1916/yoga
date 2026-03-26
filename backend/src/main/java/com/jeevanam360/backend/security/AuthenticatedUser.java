package com.jeevanam360.backend.security;

public record AuthenticatedUser(
    String id,
    String name,
    String email,
    String phone,
    String role
) {
}
