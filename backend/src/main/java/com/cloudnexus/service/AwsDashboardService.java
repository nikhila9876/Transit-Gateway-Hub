package com.cloudnexus.service;

import com.cloudnexus.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Real AWS SDK v2-backed implementation of {@link DashboardService}.
 * Aggregates live resources across VPCs, Transit Gateway, EC2, and security posture
 * to produce accurate CloudNexus platform intelligence and Network Health scores.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsDashboardService implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(AwsDashboardService.class);

    private final VpcService vpcService;
    private final TransitGatewayService transitGatewayService;
    private final Ec2Service ec2Service;
    private final AuditService auditService;
    private final SecurityService securityService;
    private final Region awsRegion;

    public AwsDashboardService(VpcService vpcService,
                               TransitGatewayService transitGatewayService,
                               Ec2Service ec2Service,
                               AuditService auditService,
                               SecurityService securityService,
                               Region awsRegion) {
        this.vpcService = vpcService;
        this.transitGatewayService = transitGatewayService;
        this.ec2Service = ec2Service;
        this.auditService = auditService;
        this.securityService = securityService;
        this.awsRegion = awsRegion;
    }

    @Override
    public DashboardSummaryDto getSummary() {
        log.info("Computing real AWS dashboard metrics for region: {}", awsRegion.id());

        List<VpcDto> vpcs;
        try {
            vpcs = vpcService.getAllVpcs();
        } catch (Exception e) {
            log.warn("Unable to discover VPCs for dashboard summary: {}", e.getMessage());
            vpcs = Collections.emptyList();
        }

        TransitGatewayDto tgw;
        try {
            tgw = transitGatewayService.getTransitGateway();
        } catch (Exception e) {
            log.warn("Unable to discover Transit Gateway for dashboard summary: {}", e.getMessage());
            tgw = null;
        }

        List<TransitGatewayAttachmentDto> attachments;
        try {
            attachments = transitGatewayService.getAttachments();
        } catch (Exception e) {
            log.warn("Unable to discover TGW attachments for dashboard summary: {}", e.getMessage());
            attachments = Collections.emptyList();
        }

        List<Ec2InstanceDto> instances;
        try {
            instances = ec2Service.getAllEc2Instances();
        } catch (Exception e) {
            log.warn("Unable to discover EC2 instances for dashboard summary: {}", e.getMessage());
            instances = Collections.emptyList();
        }

        List<SecurityFindingDto> findings;
        try {
            findings = securityService != null ? securityService.getAllFindings() : Collections.emptyList();
        } catch (Exception e) {
            log.warn("Unable to discover security findings: {}", e.getMessage());
            findings = Collections.emptyList();
        }

        List<AuditLogDto> auditLogs;
        try {
            auditLogs = auditService != null ? auditService.getAllLogs() : Collections.emptyList();
        } catch (Exception e) {
            log.warn("Unable to discover audit logs: {}", e.getMessage());
            auditLogs = Collections.emptyList();
        }

        int totalSubnets = vpcs.stream().mapToInt(VpcDto::getSubnetCount).sum();

        // Calculate CloudNexus Network Health (0 - 100)
        int networkHealth = calculateNetworkHealth(tgw, attachments, instances);

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setVpcCount(vpcs.size());
        dto.setTotalVpcs(vpcs.size());

        if (tgw != null) {
            dto.setTransitGatewayStatus(tgw.getState() != null ? tgw.getState() : "available");
            dto.setTransitGatewayName(tgw.getName() != null && !tgw.getName().isBlank() ? tgw.getName() : "Enterprise-TGW");
        } else {
            dto.setTransitGatewayStatus("not-configured");
            dto.setTransitGatewayName("Enterprise-TGW");
        }

        dto.setAttachmentCount(attachments.size());
        dto.setTgwAttachments(attachments.size());
        dto.setEc2Count(instances.size());
        dto.setEc2Instances(instances.size());
        dto.setNetworkHealth(networkHealth);
        dto.setSecurityFindings(findings.size());
        dto.setCrossVpcConnectivity(attachments.size() > 1 ? "Full Mesh (Transit Gateway)" : "Isolated / Single Hub");
        dto.setActiveAlerts(networkHealth < 80 ? 1 : 0);
        dto.setTotalSubnets(totalSubnets);
        dto.setRegion(awsRegion != null ? awsRegion.id() : "us-east-1");

        // Environment breakdown
        List<Map<String, Object>> breakdown = vpcs.stream()
                .map(v -> Map.of(
                        "name", (Object) (v.getName() != null ? v.getName() : v.getId()),
                        "cidr", v.getCidr() != null ? v.getCidr() : "",
                        "state", v.getState() != null ? v.getState() : "available",
                        "ec2Count", v.getEc2Count(),
                        "subnetCount", v.getSubnetCount(),
                        "color", getEnvironmentColor(v.getName())
                ))
                .collect(Collectors.toList());
        dto.setEnvironmentBreakdown(breakdown);

        // Recent activity
        List<Map<String, Object>> recentActivity = auditLogs.stream()
                .limit(5)
                .map(a -> Map.of(
                        "id", (Object) (a.getId() != null ? a.getId() : "log-" + System.currentTimeMillis()),
                        "timestamp", a.getTimestamp() != null ? a.getTimestamp() : "",
                        "user", a.getUser() != null ? a.getUser() : "SYSTEM",
                        "action", a.getAction() != null ? a.getAction() : "SYNC",
                        "resource", a.getResource() != null ? a.getResource() : "AWS",
                        "status", a.getStatus() != null ? a.getStatus() : "SUCCESS"
                ))
                .collect(Collectors.toList());
        dto.setRecentActivity(recentActivity);

        return dto;
    }

    private int calculateNetworkHealth(TransitGatewayDto tgw,
                                       List<TransitGatewayAttachmentDto> attachments,
                                       List<Ec2InstanceDto> instances) {
        int score = 100;

        // TGW state impact
        if (tgw == null) {
            score -= 15;
        } else if (!"available".equalsIgnoreCase(tgw.getState())) {
            score -= 25;
        }

        // Attachments state impact
        if (!attachments.isEmpty()) {
            long nonAvailable = attachments.stream()
                    .filter(a -> !"available".equalsIgnoreCase(a.getState()))
                    .count();
            score -= (int) (nonAvailable * 10);
        }

        // EC2 state impact
        if (!instances.isEmpty()) {
            long stopped = instances.stream()
                    .filter(i -> "stopped".equalsIgnoreCase(i.getState()) || "stopping".equalsIgnoreCase(i.getState()))
                    .count();
            long terminated = instances.stream()
                    .filter(i -> "terminated".equalsIgnoreCase(i.getState()) || "shutting-down".equalsIgnoreCase(i.getState()))
                    .count();
            score -= (int) (stopped * 5);
            score -= (int) (terminated * 10);
        }

        return Math.max(10, Math.min(100, score));
    }

    private String getEnvironmentColor(String name) {
        if (name == null) return "#6366f1";
        String lower = name.toLowerCase();
        if (lower.contains("dev")) return "#3b82f6";
        if (lower.contains("test")) return "#f59e0b";
        if (lower.contains("prod")) return "#10b981";
        return "#6366f1";
    }
}
