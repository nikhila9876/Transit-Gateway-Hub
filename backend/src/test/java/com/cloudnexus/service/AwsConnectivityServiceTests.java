package com.cloudnexus.service;

import com.cloudnexus.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AwsConnectivityServiceTests {

    private Ec2Client createDummyEc2Client() {
        return Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build();
    }

    @Test
    @DisplayName("testConnectivity - DEV to TEST returns REACHABLE with evidence and null latency")
    void testDevToTestReachable() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            VpcDto devVpc = new VpcDto("vpc-dev123", "Dev-VPC", "Dev-VPC", "10.10.0.0/16", "us-east-1", "available", 2, 1, "associated");
            VpcDto testVpc = new VpcDto("vpc-test456", "Test-VPC", "Test-VPC", "10.20.0.0/16", "us-east-1", "available", 2, 1, "associated");

            VpcService vpcService = new VpcService() {
                @Override
                public List<VpcDto> getAllVpcs() { return List.of(devVpc, testVpc); }
                @Override
                public Optional<VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
            };

            TransitGatewayDto tgw = new TransitGatewayDto();
            tgw.setId("tgw-0abc123");
            tgw.setName("Enterprise-TGW");
            tgw.setState("available");

            TransitGatewayAttachmentDto devAtt = new TransitGatewayAttachmentDto("tgw-att-dev", "Dev-Att", "vpc-dev123", "DEV", "vpc", "available", "associated", List.of("subnet-1"));
            TransitGatewayAttachmentDto testAtt = new TransitGatewayAttachmentDto("tgw-att-test", "Test-Att", "vpc-test456", "TEST", "vpc", "available", "associated", List.of("subnet-2"));

            TransitGatewayService tgwService = new TransitGatewayService() {
                @Override
                public TransitGatewayDto getTransitGateway() { return tgw; }
                @Override
                public List<TransitGatewayAttachmentDto> getAttachments() { return List.of(devAtt, testAtt); }
                @Override
                public List<TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
            };

            Ec2Service ec2Service = new Ec2Service() {
                @Override
                public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
                @Override
                public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
            };

            RouteTableService routeTableService = () -> Collections.emptyList();

            AwsConnectivityService service = new AwsConnectivityService(
                    ec2Client, vpcService, tgwService, ec2Service, routeTableService, Region.US_EAST_1
            );

            ConnectivityTestRequest request = new ConnectivityTestRequest("DEV", "TEST", "TCP", 8080);
            ConnectivityTestResponse response = service.testConnectivity(request);

            assertNotNull(response);
            assertEquals("REACHABLE", response.getStatus());
            assertEquals(200, response.getStatusCode());
            assertNull(response.getLatency(), "Latency must never be fabricated");
            assertEquals("AWS-EC2-DESCRIBE", response.getDiagnosticMethod());
            assertNotNull(response.getEvidence());
            assertFalse(response.getEvidence().isEmpty());
        }
    }

    @Test
    @DisplayName("testConnectivity - DEV to PROD returns UNREACHABLE due to SECURITY_GROUP_BLOCK")
    void testDevToProdIsolation() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            VpcDto devVpc = new VpcDto("vpc-dev123", "Dev-VPC", "Dev-VPC", "10.10.0.0/16", "us-east-1", "available", 2, 1, "associated");
            VpcDto prodVpc = new VpcDto("vpc-prod789", "Prod-VPC", "Prod-VPC", "10.30.0.0/16", "us-east-1", "available", 2, 1, "associated");

            VpcService vpcService = new VpcService() {
                @Override
                public List<VpcDto> getAllVpcs() { return List.of(devVpc, prodVpc); }
                @Override
                public Optional<VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
            };

            TransitGatewayDto tgw = new TransitGatewayDto();
            tgw.setId("tgw-0abc123");
            tgw.setName("Enterprise-TGW");
            tgw.setState("available");

            TransitGatewayAttachmentDto devAtt = new TransitGatewayAttachmentDto("tgw-att-dev", "Dev-Att", "vpc-dev123", "DEV", "vpc", "available", "associated", List.of("subnet-1"));
            TransitGatewayAttachmentDto prodAtt = new TransitGatewayAttachmentDto("tgw-att-prod", "Prod-Att", "vpc-prod789", "PROD", "vpc", "available", "associated", List.of("subnet-3"));

            TransitGatewayService tgwService = new TransitGatewayService() {
                @Override
                public TransitGatewayDto getTransitGateway() { return tgw; }
                @Override
                public List<TransitGatewayAttachmentDto> getAttachments() { return List.of(devAtt, prodAtt); }
                @Override
                public List<TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
            };

            Ec2Service ec2Service = new Ec2Service() {
                @Override
                public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
                @Override
                public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
            };

            RouteTableService routeTableService = () -> Collections.emptyList();

            AwsConnectivityService service = new AwsConnectivityService(
                    ec2Client, vpcService, tgwService, ec2Service, routeTableService, Region.US_EAST_1
            );

            ConnectivityTestRequest request = new ConnectivityTestRequest("DEV", "PROD", "TCP", 8080);
            ConnectivityTestResponse response = service.testConnectivity(request);

            assertNotNull(response);
            assertEquals("UNREACHABLE", response.getStatus());
            assertEquals(403, response.getStatusCode());
            assertEquals("SECURITY_GROUP_BLOCK", response.getPossibleCause());
            assertNull(response.getLatency());
        }
    }

    @Test
    @DisplayName("testConnectivity - Missing destination VPC returns INSTANCE_UNAVAILABLE")
    void testMissingDestinationVpc() {
        try (Ec2Client ec2Client = createDummyEc2Client()) {
            VpcDto devVpc = new VpcDto("vpc-dev123", "Dev-VPC", "Dev-VPC", "10.10.0.0/16", "us-east-1", "available", 2, 1, "associated");

            VpcService vpcService = new VpcService() {
                @Override
                public List<VpcDto> getAllVpcs() { return List.of(devVpc); }
                @Override
                public Optional<VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
            };

            TransitGatewayService tgwService = new TransitGatewayService() {
                @Override
                public TransitGatewayDto getTransitGateway() { return null; }
                @Override
                public List<TransitGatewayAttachmentDto> getAttachments() { return Collections.emptyList(); }
                @Override
                public List<TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
            };

            Ec2Service ec2Service = new Ec2Service() {
                @Override
                public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
                @Override
                public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
            };

            RouteTableService routeTableService = () -> Collections.emptyList();

            AwsConnectivityService service = new AwsConnectivityService(
                    ec2Client, vpcService, tgwService, ec2Service, routeTableService, Region.US_EAST_1
            );

            ConnectivityTestRequest request = new ConnectivityTestRequest("DEV", "NONEXISTENT", "TCP", 8080);
            ConnectivityTestResponse response = service.testConnectivity(request);

            assertNotNull(response);
            assertEquals("UNREACHABLE", response.getStatus());
            assertEquals(404, response.getStatusCode());
            assertEquals("INSTANCE_UNAVAILABLE", response.getPossibleCause());
        }
    }
}
