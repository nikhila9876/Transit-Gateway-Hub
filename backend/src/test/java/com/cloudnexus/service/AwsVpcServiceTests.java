package com.cloudnexus.service;

import com.cloudnexus.exception.AwsIntegrationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

import static org.junit.jupiter.api.Assertions.*;

class AwsVpcServiceTests {

    @Test
    @DisplayName("AwsVpcService safely handles AWS authentication failure and converts to AwsIntegrationException")
    void testAwsVpcServiceExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsVpcService service = new AwsVpcService(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    service::getAllVpcs
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to discover VPCs from AWS"));
        }
    }

    @Test
    @DisplayName("AwsVpcService getVpcById safely converts AWS API failure to AwsIntegrationException")
    void testGetVpcByIdExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsVpcService service = new AwsVpcService(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    () -> service.getVpcById("vpc-nonexistent")
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to inspect AWS VPC"));
        }
    }
}
