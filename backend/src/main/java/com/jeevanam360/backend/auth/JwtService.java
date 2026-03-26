package com.jeevanam360.backend.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String jwtSecret;
    private final long tokenExpirationHours;

    public JwtService(
        @Value("${app.auth.jwt-secret}") String jwtSecret,
        @Value("${app.auth.token-expiration-hours:72}") long tokenExpirationHours
    ) {
        this.jwtSecret = jwtSecret;
        this.tokenExpirationHours = tokenExpirationHours;
    }

    public String generateToken(UserAccount user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(tokenExpirationHours, ChronoUnit.HOURS);

        return Jwts.builder()
            .subject(user.getId())
            .claim("email", user.getEmail())
            .claim("name", user.getName())
            .claim("role", user.getRole())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiresAt))
            .signWith(getSigningKey())
            .compact();
    }

    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
