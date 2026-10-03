package com.cloudnexus.service;

import com.cloudnexus.dto.DashboardSummaryDto;
import com.cloudnexus.repository.MockDataStore;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.regions.Region;

import static org.junit.jupiter.api.Assertions.*;

class AwsDashboardServiceTests {

    @Test
    @DisplayName("AwsDashboardService aggregates resources and calculates network health")
    void testAwsDashboardServiceAggregation() {
        MockDataStore dataStore = new MockDataStore();
        VpcService vpcService = new MockVpcService(dataStore);
        TransitGatewayService tgwService = new MockTransitGatewayService(dataStore);
        Ec2Service ec2Service = new MockEc2Service(dataStore);
        AuditService auditService = new MockAuditService(dataStore);
        SecurityService securityService = new MockSecurityService(dataStore);

        AwsDashboardService dashboardService = new AwsDashboardService(
                vpcService,
                tgwService,
                ec2Service,
                auditService,
                securityService,
                Region.US_EAST_1
        );

        DashboardSummaryDto summary = dashboardService.getSummary();

        assertNotNull(summary);
        assertTrue(summary.getVpcCount() > 0);
        assertTrue("available".equalsIgnoreCase(summary.getTransitGatewayStatus()));
        assertTrue(summary.getAttachmentCount() > 0);
        assertTrue(summary.getEc2Count() > 0);
        assertTrue(summary.getNetworkHealth() >= 80);
        assertNotNull(summary.getEnvironmentBreakdown());
        assertFalse(summary.getEnvironmentBreakdown().isEmpty());
    }
}
