package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.model.TransitGateway;
import com.cloudnexus.model.TgwAttachment;
import com.cloudnexus.model.TgwRoute;
import com.cloudnexus.service.TransitGatewayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transit-gateway")
public class TransitGatewayController {

    private final TransitGatewayService tgwService;

    public TransitGatewayController(TransitGatewayService tgwService) {
        this.tgwService = tgwService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TransitGateway>> getTransitGateway() {
        return ResponseEntity.ok(ApiResponse.ok(tgwService.getTransitGateway()));
    }

    @GetMapping("/attachments")
    public ResponseEntity<ApiResponse<List<TgwAttachment>>> getAttachments() {
        return ResponseEntity.ok(ApiResponse.ok(tgwService.getAttachments()));
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<TgwRoute>>> getRoutes() {
        return ResponseEntity.ok(ApiResponse.ok(tgwService.getRoutes()));
    }
}
