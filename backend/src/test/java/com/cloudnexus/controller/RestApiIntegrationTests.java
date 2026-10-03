package com.cloudnexus.controller;

import com.cloudnexus.dto.AiAnalysisRequest;
import com.cloudnexus.dto.ConnectivityTestRequest;
import com.cloudnexus.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RestApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    private String adminToken;

    @BeforeEach
    void setUp() {
        adminToken = "Bearer " + jwtService.generateToken("admin", "ROLE_ADMIN");
    }

    @Test
    @DisplayName("GET /api/dashboard/summary - returns valid dashboard metrics")
    void testGetDashboardSummary() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalVpcs").value(3))
                .andExpect(jsonPath("$.data.transitGatewayName").value("Enterprise-TGW"))
                .andExpect(jsonPath("$.data.attachmentCount").value(3))
                .andExpect(jsonPath("$.data.ec2Count").value(3))
                .andExpect(jsonPath("$.data.networkHealth").value(94));
    }

    @Test
    @DisplayName("GET /api/vpcs - returns 3 multi-environment VPCs")
    void testGetAllVpcs() throws Exception {
        mockMvc.perform(get("/api/vpcs")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[*].cidr", hasItems("10.10.0.0/16", "10.20.0.0/16", "10.30.0.0/16")));
    }

    @Test
    @DisplayName("GET /api/vpcs/{id} - returns detailed VPC with subnets and security group")
    void testGetVpcById() throws Exception {
        mockMvc.perform(get("/api/vpcs/vpc-0dev1010001")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("DEV"))
                .andExpect(jsonPath("$.data.subnets", hasSize(2)));
    }

    @Test
    @DisplayName("GET /api/transit-gateway - returns central hub details")
    void testGetTransitGateway() throws Exception {
        mockMvc.perform(get("/api/transit-gateway")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Enterprise-TGW"))
                .andExpect(jsonPath("$.data.state").value("Available"));
    }

    @Test
    @DisplayName("GET /api/transit-gateway/attachments - returns 3 VPC attachments")
    void testGetTgwAttachments() throws Exception {
        mockMvc.perform(get("/api/transit-gateway/attachments")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(3)));
    }

    @Test
    @DisplayName("GET /api/transit-gateway/routes - returns propagated routes")
    void testGetTgwRoutes() throws Exception {
        mockMvc.perform(get("/api/transit-gateway/routes")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(3)));
    }

    @Test
    @DisplayName("GET /api/route-tables - returns VPC route tables with TGW target")
    void testGetRouteTables() throws Exception {
        mockMvc.perform(get("/api/route-tables")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(3)));
    }

    @Test
    @DisplayName("GET /api/ec2 - returns EC2 instances across VPCs")
    void testGetEc2Instances() throws Exception {
        mockMvc.perform(get("/api/ec2")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[*].name", hasItems("Dev-App-Server", "Test-App-Server", "Prod-App-Server")));
    }

    @Test
    @DisplayName("GET /api/security - returns security posture findings")
    void testGetSecurityFindings() throws Exception {
        mockMvc.perform(get("/api/security")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(4))));
    }

    @Test
    @DisplayName("GET /api/monitoring - returns telemetry metrics")
    void testGetMonitoringMetrics() throws Exception {
        mockMvc.perform(get("/api/monitoring")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.networkHealthPercent").value(94.0))
                .andExpect(jsonPath("$.data.overallStatus").value("OPTIMAL"));
    }

    @Test
    @DisplayName("POST /api/network/test - executes synthetic cross-VPC probe")
    void testConnectivityTest() throws Exception {
        ConnectivityTestRequest request = new ConnectivityTestRequest("DEV", "TEST", "TCP", 8080);

        mockMvc.perform(post("/api/network/test")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.source").value("DEV"))
                .andExpect(jsonPath("$.data.destination").value("TEST"))
                .andExpect(jsonPath("$.data.status").value("SUCCESS"))
                .andExpect(jsonPath("$.data.latency").isNumber())
                .andExpect(jsonPath("$.data.diagnosticMessage").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/ai/analyze - performs AI network diagnostic inference")
    void testAiAnalyze() throws Exception {
        AiAnalysisRequest request = new AiAnalysisRequest("Why can't DEV reach PROD?", null);

        mockMvc.perform(post("/api/ai/analyze")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.summary").isNotEmpty())
                .andExpect(jsonPath("$.data.evidence").isNotEmpty())
                .andExpect(jsonPath("$.data.possibleCause").isNotEmpty())
                .andExpect(jsonPath("$.data.recommendedChecks").isArray())
                .andExpect(jsonPath("$.data.recommendedAction").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/audit - returns security and operational audit logs")
    void testGetAuditLogs() throws Exception {
        mockMvc.perform(get("/api/audit")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(4))));
    }

    @Test
    @DisplayName("GET /api/network/health - returns composite network health score")
    void testGetNetworkHealth() throws Exception {
        mockMvc.perform(get("/api/network/health")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.overallScore").isNumber())
                .andExpect(jsonPath("$.data.status").isString())
                .andExpect(jsonPath("$.data.networkScore").isNumber());
    }

    @Test
    @DisplayName("GET /api/network/flow-logs - returns VPC flow logs status")
    void testGetFlowLogs() throws Exception {
        mockMvc.perform(get("/api/network/flow-logs")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }
}
