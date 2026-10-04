package com.cloudnexus.service;

import com.cloudnexus.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class EvidenceBasedAiServiceTests {

    @Test
    @DisplayName("analyzeNetwork - DEV to PROD question returns Zero-Trust isolation explanation")
    void testDevToProdAnalysis() {
        VpcDto devVpc = new VpcDto("vpc-dev", "Dev-VPC", "Dev-VPC", "10.10.0.0/16", "us-east-1", "available", 2, 1, "associated");
        VpcDto prodVpc = new VpcDto("vpc-prod", "Prod-VPC", "Prod-VPC", "10.30.0.0/16", "us-east-1", "available", 2, 1, "associated");

        VpcService vpcService = new VpcService() {
            @Override public List<VpcDto> getAllVpcs() { return List.of(devVpc, prodVpc); }
            @Override public Optional<VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
        };

        TransitGatewayDto tgw = new TransitGatewayDto();
        tgw.setId("tgw-001");
        tgw.setState("available");

        TransitGatewayService tgwService = new TransitGatewayService() {
            @Override public TransitGatewayDto getTransitGateway() { return tgw; }
            @Override public List<TransitGatewayAttachmentDto> getAttachments() { return Collections.emptyList(); }
            @Override public List<TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
        };

        Ec2Service ec2Service = new Ec2Service() {
            @Override public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
            @Override public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
        };

        SecurityService secService = () -> Collections.emptyList();
        RouteTableService rtbService = () -> Collections.emptyList();

        EvidenceBasedAiService service = new EvidenceBasedAiService(
                vpcService, tgwService, ec2Service, secService, rtbService
        );

        AiAnalysisRequest request = new AiAnalysisRequest("Why can't DEV reach PROD?", null);
        AiAnalysisResponse response = service.analyzeNetwork(request);

        assertNotNull(response);
        assertEquals("SECURITY_GROUP_BLOCK", response.getPossibleCause());
        assertTrue(response.getConfidence() >= 0.85);
        assertNotNull(response.getEvidence());
        assertNotNull(response.getRecommendedChecks());
        assertFalse(response.getRecommendedChecks().isEmpty());
    }

    @Test
    @DisplayName("analyzeNetwork - Security question evaluates security findings count")
    void testSecurityAnalysis() {
        VpcService vpcService = new VpcService() {
            @Override public List<VpcDto> getAllVpcs() { return Collections.emptyList(); }
            @Override public Optional<VpcDetailsDto> getVpcById(String id) { return Optional.empty(); }
        };

        TransitGatewayService tgwService = new TransitGatewayService() {
            @Override public TransitGatewayDto getTransitGateway() { return null; }
            @Override public List<TransitGatewayAttachmentDto> getAttachments() { return Collections.emptyList(); }
            @Override public List<TransitGatewayRouteDto> getRoutes() { return Collections.emptyList(); }
        };

        Ec2Service ec2Service = new Ec2Service() {
            @Override public List<Ec2InstanceDto> getAllEc2Instances() { return Collections.emptyList(); }
            @Override public Optional<Ec2InstanceDto> getInstanceById(String id) { return Optional.empty(); }
        };

        SecurityFindingDto finding = new SecurityFindingDto();
        finding.setId("sec-1");
        finding.setTitle("Publicly Accessible SSH");
        finding.setSeverity("HIGH");

        SecurityService secService = () -> List.of(finding);
        RouteTableService rtbService = () -> Collections.emptyList();

        EvidenceBasedAiService service = new EvidenceBasedAiService(
                vpcService, tgwService, ec2Service, secService, rtbService
        );

        AiAnalysisRequest request = new AiAnalysisRequest("What are the main security risks?", null);
        AiAnalysisResponse response = service.analyzeNetwork(request);

        assertNotNull(response);
        assertTrue(response.getSummary().contains("1 active security finding"));
        assertTrue(response.getEvidence().contains("Publicly Accessible SSH"));
    }
}
