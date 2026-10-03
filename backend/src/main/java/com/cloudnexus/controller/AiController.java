package com.cloudnexus.controller;

import com.cloudnexus.dto.AiAnalysisRequest;
import com.cloudnexus.dto.AiAnalysisResponse;
import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyze(@RequestBody AiAnalysisRequest request) {
        AiAnalysisResponse response = aiService.analyzeNetwork(request);
        return ResponseEntity.ok(ApiResponse.ok("AI analysis completed successfully", response));
    }
}
