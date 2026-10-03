package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.exception.ResourceNotFoundException;
import com.cloudnexus.model.Vpc;
import com.cloudnexus.service.VpcService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vpcs")
public class VpcController {

    private final VpcService vpcService;

    public VpcController(VpcService vpcService) {
        this.vpcService = vpcService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Vpc>>> getAllVpcs() {
        return ResponseEntity.ok(ApiResponse.ok(vpcService.getAllVpcs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Vpc>> getVpcById(@PathVariable String id) {
        Vpc vpc = vpcService.getVpcById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VPC not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.ok(vpc));
    }
}
