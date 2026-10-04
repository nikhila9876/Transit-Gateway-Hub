package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.dto.SecurityFindingDto;
import com.cloudnexus.service.AuditService;
import com.cloudnexus.service.SecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final SecurityService securityService;
    private final Optional<AuditService> auditService;

    public SecurityController(SecurityService securityService, Optional<AuditService> auditService) {
        this.securityService = securityService;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SecurityFindingDto>>> getAllFindings() {
        List<SecurityFindingDto> findings = securityService.getAllFindings();

        auditService.ifPresent(service -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null && auth.getName() != null) ? auth.getName() : "security-operator";

            AuditLogDto log = new AuditLogDto();
            log.setUser(username);
            log.setUsername(username);
            log.setAction("Security Audit");
            log.setResource("/api/security");
            log.setStatus("SUCCESS");
            log.setDetails("Inspected multi-VPC security groups: " + findings.size() + " findings identified.");
            service.recordLog(log);
        });

        return ResponseEntity.ok(ApiResponse.ok("Security findings fetched successfully", findings));
    }
}
