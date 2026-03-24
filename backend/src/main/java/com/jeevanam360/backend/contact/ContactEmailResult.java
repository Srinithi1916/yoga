package com.jeevanam360.backend.contact;

public record ContactEmailResult(
    boolean emailSent,
    String emailStatus
) {
}