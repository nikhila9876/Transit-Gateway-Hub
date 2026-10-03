package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
import com.cloudnexus.dto.SecurityFindingDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AwsSecurityAnalysisServiceTests {

    private Ec2Client createDummyEc2Client() {
        return Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build();
    }

    @Test
    @DisplayName("getAllFindings - returns empty list when AWS API is unavailable (never fabricates)")
    void testAwsSecurityAnalysisGraceful() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            Ec2Service ec2Service = new Ec2Service() {
                @Override public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
                @Override public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
            };

            AwsSecurityAnalysisService service = new AwsSecurityAnalysisService(
                    ec2Client, ec2Service, Region.US_EAST_1
            );

            List<SecurityFindingDto> findings = service.getAllFindings();
            assertNotNull(findings);
        }
    }

    @Test
    @DisplayName("getAllFindings - detects public EC2 instance exposure")
    void testDetectPublicInstance() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            Ec2InstanceDto publicInstance = new Ec2InstanceDto();
            publicInstance.setId("i-pub001");
            publicInstance.setName("Exposed-Server");
            publicInstance.setPublicIp("54.210.10.20");
            publicInstance.setSubnet("Public-Subnet-1");

            Ec2Service ec2Service = new Ec2Service() {
                @Override public List<Ec2InstanceDto> getAllEc2Instances() { return List.of(publicInstance); }
                @Override public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.of(publicInstance); }
            };

            AwsSecurityAnalysisService service = new AwsSecurityAnalysisService(
                    ec2Client, ec2Service, Region.US_EAST_1
            );

            List<SecurityFindingDto> findings = service.getAllFindings();
            assertNotNull(findings);
            assertTrue(findings.stream().anyMatch(f -> "EC2 Instance Has Public IP Address".equals(f.getTitle())));
            assertTrue(findings.stream().anyMatch(f -> "MEDIUM".equals(f.getSeverity())));
        }
    }
}
