package com.cloudnexus.service;

import com.cloudnexus.dto.DashboardSummaryDto;
import com.cloudnexus.model.AuditLog;
import com.cloudnexus.model.TransitGateway;
import com.cloudnexus.model.Vpc;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link DashboardService}.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockDashboardService implements DashboardService {

    private final MockDataStore dataStore;

    public MockDashboardService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public DashboardSummaryDto getSummary() {
        List<Vpc> vpcs = dataStore.getAllVpcs();
        TransitGateway tgw = dataStore.getTransitGateway();
        int totalSubnets = vpcs.stream().mapToInt(Vpc::getSubnetCount).sum();

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setVpcCount(vpcs.size());
        dto.setTotalVpcs(vpcs.size());
        dto.setTransitGatewayStatus(tgw.getState());
        dto.setTransitGatewayName(tgw.getName());
        dto.setAttachmentCount(dataStore.getTgwAttachments().size());
        dto.setTgwAttachments(dataStore.getTgwAttachments().size());
        dto.setEc2Count(dataStore.getAllEc2Instances().size());
        dto.setEc2Instances(dataStore.getAllEc2Instances().size());
        dto.setNetworkHealth(94);
        dto.setSecurityFindings(dataStore.getSecurityFindings().size());
        dto.setCrossVpcConnectivity("Full Mesh (Policy Guarded)");
        dto.setActiveAlerts(0);
        dto.setTotalSubnets(totalSubnets);
        dto.setRegion("us-east-1");

        // Environment breakdown
        List<Map<String, Object>> breakdown = vpcs.stream()
                .map(v -> Map.of(
                        "name", (Object) v.getName(),
                        "cidr", v.getCidr(),
                        "state", v.getState(),
                        "ec2Count", v.getEc2Count(),
                        "subnetCount", v.getSubnetCount(),
                        "color", v.getColor()
                ))
                .collect(Collectors.toList());
        dto.setEnvironmentBreakdown(breakdown);

        // Recent activity
        List<Map<String, Object>> recentActivity = dataStore.getAuditLogs().stream()
                .limit(5)
                .map(a -> Map.of(
                        "id", (Object) a.getId(),
                        "timestamp", a.getTimestamp(),
                        "user", a.getActor(),
                        "action", a.getAction(),
                        "resource", a.getResource(),
                        "status", a.getStatus()
                ))
                .collect(Collectors.toList());
        dto.setRecentActivity(recentActivity);

        return dto;
    }
}
