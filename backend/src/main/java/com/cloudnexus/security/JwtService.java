package com.cloudnexus.security;

import org.springframework.security.core.Authentication;

/**
 * Service contract for JWT generation, validation, and claim parsing.
 */
public interface JwtService {
    String generateToken(Authentication authentication);
    String generateToken(String username, String role);
    String getUsernameFromToken(String token);
    boolean validateToken(String token);
    long getExpirationMs();
}
