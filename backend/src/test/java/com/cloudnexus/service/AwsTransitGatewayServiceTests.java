package com.cloudnexus.service;

import com.cloudnexus.exception.AwsIntegrationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

import static org.junit.jupiter.api.Assertions.*;

class AwsTransitGatewayServiceTests {

    @Test
    @DisplayName("AwsTransitGatewayService safely converts AWS API failure to AwsIntegrationException")
    void testAwsTransitGatewayExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsTransitGatewayService service = new AwsTransitGatewayService(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    service::getTransitGateway
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to inspect Transit Gateway"));
        }
    }

    @Test
    @DisplayName("AwsTransitGatewayService getAttachments safely handles AWS API failure")
    void testGetAttachmentsExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsTransitGatewayService service = new AwsTransitGatewayService(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    service::getAttachments
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to discover Transit Gateway attachments"));
        }
    }

    @Test
    @DisplayName("AwsRouteTableService safely converts AWS API failure to AwsIntegrationException")
    void testAwsRouteTableExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsRouteTableService service = new AwsRouteTableService(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    service::getAllRouteTables
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to discover VPC route tables"));
        }
    }
}
