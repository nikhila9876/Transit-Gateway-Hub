package com.cloudnexus.controller;

import com.cloudnexus.dto.AiAnalysisRequest;
import com.cloudnexus.dto.AiAnalysisResponse;
import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.service.AiService;
import com.cloudnexus.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final Optional<AuditService> auditService;

    public AiController(AiService aiService, Optional<AuditService> auditService) {
        this.aiService = aiService;
        this.auditService = auditService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyze(@RequestBody AiAnalysisRequest request) {
        AiAnalysisResponse response = aiService.analyzeNetwork(request);

        auditService.ifPresent(service -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null && auth.getName() != null) ? auth.getName() : "cloud-operator";

            AuditLogDto log = new AuditLogDto();
            log.setUser(username);
            log.setUsername(username);
            log.setAction("AI Analysis");
            log.setResource("/api/ai/analyze");
            log.setStatus("SUCCESS");
            String query = request != null && request.getQuestion() != null ? request.getQuestion() : "General network inquiry";
            log.setDetails("Evidence-based AI diagnostics executed for: " + (query.length() > 60 ? query.substring(0, 57) + "..." : query));
            service.recordLog(log);
        });

        return ResponseEntity.ok(ApiResponse.ok("AI analysis completed successfully", response));
    }
}
