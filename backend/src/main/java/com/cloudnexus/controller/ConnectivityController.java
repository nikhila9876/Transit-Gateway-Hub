package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.ConnectivityTestRequest;
import com.cloudnexus.dto.ConnectivityTestResponse;
import com.cloudnexus.service.ConnectivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/network")
public class ConnectivityController {

    private final ConnectivityService connectivityService;

    public ConnectivityController(ConnectivityService connectivityService) {
        this.connectivityService = connectivityService;
    }

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<ConnectivityTestResponse>> testConnectivity(@RequestBody ConnectivityTestRequest request) {
        ConnectivityTestResponse result = connectivityService.testConnectivity(request);
        return ResponseEntity.ok(ApiResponse.ok("Connectivity test completed", result));
    }
}
