package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.TransitGatewayAttachmentDto;
import com.cloudnexus.dto.TransitGatewayDto;
import com.cloudnexus.dto.TransitGatewayRouteDto;
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
    public ResponseEntity<ApiResponse<TransitGatewayDto>> getTransitGateway() {
        return ResponseEntity.ok(ApiResponse.ok("Transit Gateway details fetched successfully", tgwService.getTransitGateway()));
    }

    @GetMapping("/attachments")
    public ResponseEntity<ApiResponse<List<TransitGatewayAttachmentDto>>> getAttachments() {
        return ResponseEntity.ok(ApiResponse.ok("TGW attachments fetched successfully", tgwService.getAttachments()));
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<TransitGatewayRouteDto>>> getRoutes() {
        return ResponseEntity.ok(ApiResponse.ok("TGW routes fetched successfully", tgwService.getRoutes()));
    }
}
