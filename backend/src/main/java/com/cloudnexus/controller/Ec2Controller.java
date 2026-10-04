package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.Ec2InstanceDto;
import com.cloudnexus.exception.ResourceNotFoundException;
import com.cloudnexus.service.Ec2Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ec2")
public class Ec2Controller {

    private final Ec2Service ec2Service;

    public Ec2Controller(Ec2Service ec2Service) {
        this.ec2Service = ec2Service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Ec2InstanceDto>>> getAllEc2Instances() {
        return ResponseEntity.ok(ApiResponse.ok("EC2 instances fetched successfully", ec2Service.getAllEc2Instances()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ec2InstanceDto>> getInstanceById(@PathVariable String id) {
        Ec2InstanceDto instance = ec2Service.getInstanceById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EC2 instance not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.ok("EC2 instance fetched successfully", instance));
    }
}
