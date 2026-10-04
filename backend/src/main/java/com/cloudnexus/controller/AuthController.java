package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.dto.LoginRequest;
import com.cloudnexus.dto.LoginResponse;
import com.cloudnexus.security.JwtService;
import com.cloudnexus.service.AuditService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final Optional<AuditService> auditService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          Optional<AuditService> auditService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(authentication);

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.contains("ADMIN"))
                .findFirst()
                .map(a -> a.replace("ROLE_", ""))
                .orElse("VIEWER");

        LoginResponse loginResponse = new LoginResponse(
                token,
                authentication.getName(),
                role,
                jwtService.getExpirationMs()
        );

        auditService.ifPresent(service -> {
            AuditLogDto log = new AuditLogDto();
            log.setUser(authentication.getName());
            log.setUsername(authentication.getName());
            log.setRole("ROLE_" + role);
            log.setAction("Login");
            log.setResource("/api/auth/login");
            log.setStatus("SUCCESS");
            log.setDetails("User " + authentication.getName() + " logged in successfully.");
            service.recordLog(log);
        });

        return ResponseEntity.ok(ApiResponse.ok("Login successful", loginResponse));
    }
}
