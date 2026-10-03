package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
import com.cloudnexus.dto.TransitGatewayAttachmentDto;
import com.cloudnexus.dto.TransitGatewayDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AwsNetworkFlowServiceTests {

    private Ec2Client createDummyEc2Client() {
        return Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build();
    }

    @Test
    @DisplayName("getNetworkHealthSummary - computes weighted score and status")
    void testNetworkHealthSummary() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            VpcService vpcService = new VpcService() {
                @Override public List<com.cloudnexus.dto.VpcDto> getAllVpcs() { return Collections.emptyList(); }
                @Override public Optional<com.cloudnexus.dto.VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
            };

            TransitGatewayDto tgw = new TransitGatewayDto();
            tgw.setId("tgw-001");
            tgw.setState("available");

            TransitGatewayAttachmentDto att1 = new TransitGatewayAttachmentDto("att-1", "Dev-Att", "vpc-1", "DEV", "vpc", "available", "associated", List.of("sub-1"));
            TransitGatewayAttachmentDto att2 = new TransitGatewayAttachmentDto("att-2", "Test-Att", "vpc-2", "TEST", "vpc", "available", "associated", List.of("sub-2"));

            TransitGatewayService tgwService = new TransitGatewayService() {
                @Override public TransitGatewayDto getTransitGateway() { return tgw; }
                @Override public List<TransitGatewayAttachmentDto> getAttachments() { return List.of(att1, att2); }
                @Override public List<com.cloudnexus.dto.TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
            };

            Ec2InstanceDto inst1 = new Ec2InstanceDto();
            inst1.setId("i-1");
            inst1.setName("Dev-Server");
            inst1.setState("running");

            Ec2Service ec2Service = new Ec2Service() {
                @Override public List<Ec2InstanceDto> getAllEc2Instances() { return List.of(inst1); }
                @Override public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.of(inst1); }
            };

            AwsNetworkFlowService service = new AwsNetworkFlowService(
                    ec2Client, vpcService, tgwService, ec2Service, Region.US_EAST_1
            );

            Map<String, Object> health = service.getNetworkHealthSummary();
            assertNotNull(health);
            assertTrue((int) health.get("overallScore") >= 80);
            assertNotNull(health.get("status"));
            assertNotNull(health.get("networkScore"));
            assertNotNull(health.get("computeScore"));
            assertNotNull(health.get("reasons"));
        }
    }

    @Test
    @DisplayName("getFlowLogStatus - gracefully handles unavailable API")
    void testFlowLogsGracefulFallback() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            VpcService vpcService = new VpcService() {
                @Override public List<com.cloudnexus.dto.VpcDto> getAllVpcs() { return Collections.emptyList(); }
                @Override public Optional<com.cloudnexus.dto.VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
            };
            TransitGatewayService tgwService = new TransitGatewayService() {
                @Override public TransitGatewayDto getTransitGateway() { return null; }
                @Override public List<TransitGatewayAttachmentDto> getAttachments() { return Collections.emptyList(); }
                @Override public List<com.cloudnexus.dto.TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
            };
            Ec2Service ec2Service = new Ec2Service() {
                @Override public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
                @Override public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
            };

            AwsNetworkFlowService service = new AwsNetworkFlowService(
                    ec2Client, vpcService, tgwService, ec2Service, Region.US_EAST_1
            );

            List<Map<String, Object>> flowLogs = service.getFlowLogStatus();
            assertNotNull(flowLogs);
            assertFalse(flowLogs.isEmpty());
            assertTrue(flowLogs.get(0).containsKey("status"));
        }
    }
}
