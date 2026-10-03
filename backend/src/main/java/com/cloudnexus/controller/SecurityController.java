package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.SecurityFindingDto;
import com.cloudnexus.service.SecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final SecurityService securityService;

    public SecurityController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SecurityFindingDto>>> getAllFindings() {
        return ResponseEntity.ok(ApiResponse.ok("Security findings fetched successfully", securityService.getAllFindings()));
    }
}
