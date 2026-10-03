package com.cloudnexus.service;

import com.cloudnexus.dto.DashboardSummaryResponse;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final MockDataStore dataStore;

    public DashboardService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public DashboardSummaryResponse getSummary() {
        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalVpcs(dataStore.getAllVpcs().size());
        response.setTransitGatewayStatus(dataStore.getTransitGateway().getState());
        response.setTransitGatewayName(dataStore.getTransitGateway().getName());
        response.setTgwAttachments(dataStore.getTgwAttachments().size());
        response.setEc2Instances(dataStore.getAllEc2Instances().size());
        response.setNetworkHealth(94);
        response.setSecurityFindings(dataStore.getSecurityFindings().size());
        response.setCrossVpcConnectivity("Optimal");
        response.setActiveAlerts(1);
        response.setTotalSubnets(6);
        response.setRegion("us-east-1");
        response.setEnvironmentBreakdown(List.of(
                Map.of("name", "DEV", "cidr", "10.10.0.0/16", "status", "Healthy", "instances", 1, "color", "#3b82f6"),
                Map.of("name", "TEST", "cidr", "10.20.0.0/16", "status", "Healthy", "instances", 1, "color", "#06b6d4"),
                Map.of("name", "PROD", "cidr", "10.30.0.0/16", "status", "Healthy", "instances", 1, "color", "#6366f1")
        ));
        return response;
    }
}
