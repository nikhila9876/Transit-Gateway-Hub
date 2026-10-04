package com.cloudnexus.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtTokenProvider implements JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${cloudnexus.jwt.secret:c2VjdXJlX2Nsb3VkbmV4dXNfZW50ZXJwcmlzZV9qd3Rfc2VjcmV0X2tleV8yNTZiaXRfbWluaW11bV9sZW5ndGg=}") String secret,
            @Value("${cloudnexus.jwt.expiration-ms:86400000}") long expirationMs) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    @Override
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    @Override
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);
        String normalizedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        return Jwts.builder()
                .subject(username)
                .claim("roles", List.of(normalizedRole))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    @Override
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @Override
    public long getExpirationMs() {
        return expirationMs;
    }
}
