package com.cloudnexus.service;

import com.cloudnexus.dto.MonitoringDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.ec2.Ec2Client;

import static org.junit.jupiter.api.Assertions.*;

class AwsMonitoringServiceTests {

    @Test
    @DisplayName("AwsMonitoringService handles anonymous credentials gracefully with fallback baseline")
    void testAwsMonitoringServiceGracefulFallback() {
        try (CloudWatchClient cwClient = CloudWatchClient.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build();
             Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsMonitoringService service = new AwsMonitoringService(cwClient, ec2Client, Region.US_EAST_1);

            MonitoringDto metrics = service.getMonitoringMetrics();

            assertNotNull(metrics);
            assertNotNull(metrics.getOverallStatus());
            assertTrue(metrics.getNetworkHealthPercent() >= 0);
            assertNotNull(metrics.getVpcMetrics());
            assertNotNull(metrics.getTgwMetrics());

            // Second call should return cached instance
            MonitoringDto cached = service.getMonitoringMetrics();
            assertSame(metrics, cached);
        }
    }
}
