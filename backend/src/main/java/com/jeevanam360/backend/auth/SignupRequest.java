package com.jeevanam360.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String phone,
    @NotBlank @Size(min = 6, max = 120) String password
) {
}
