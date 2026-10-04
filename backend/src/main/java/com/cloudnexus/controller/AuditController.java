package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for retrieving and filtering enterprise compliance audit records.
 */
@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAllLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String user,
            @RequestParam(required = false) String status
    ) {
        List<AuditLogDto> all = auditService.getAllLogs();
        List<AuditLogDto> filtered = all.stream().filter(log -> {
            if (action != null && !action.isBlank() && !"All".equalsIgnoreCase(action)) {
                if (log.getAction() == null || !log.getAction().equalsIgnoreCase(action.trim())) {
                    return false;
                }
            }
            if (user != null && !user.isBlank() && !"All".equalsIgnoreCase(user)) {
                String u = log.getUser() != null ? log.getUser() : log.getUsername();
                if (u == null || !u.equalsIgnoreCase(user.trim())) {
                    return false;
                }
            }
            if (status != null && !status.isBlank() && !"All".equalsIgnoreCase(status)) {
                if (log.getStatus() == null || !log.getStatus().equalsIgnoreCase(status.trim())) {
                    return false;
                }
            }
            if (search != null && !search.isBlank()) {
                String s = search.toLowerCase().trim();
                String target = (
                        (log.getAction() != null ? log.getAction() : "") + " " +
                        (log.getUser() != null ? log.getUser() : "") + " " +
                        (log.getResource() != null ? log.getResource() : "") + " " +
                        (log.getDetails() != null ? log.getDetails() : "") + " " +
                        (log.getMessage() != null ? log.getMessage() : "")
                ).toLowerCase();
                if (!target.contains(s)) {
                    return false;
                }
            }
            return true;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok("Audit logs fetched successfully", filtered));
    }
}
