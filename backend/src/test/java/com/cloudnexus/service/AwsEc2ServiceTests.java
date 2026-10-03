package com.cloudnexus.service;

import com.cloudnexus.exception.AwsIntegrationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

import static org.junit.jupiter.api.Assertions.*;

class AwsEc2ServiceTests {

    @Test
    @DisplayName("AwsEc2Service safely converts AWS API failure to AwsIntegrationException")
    void testAwsEc2ServiceExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsEc2Service service = new AwsEc2Service(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    service::getAllEc2Instances
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to discover EC2 instances from AWS"));
        }
    }

    @Test
    @DisplayName("AwsEc2Service getInstanceById safely converts AWS API failure to AwsIntegrationException")
    void testGetInstanceByIdExceptionHandling() {
        try (Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build()) {

            AwsEc2Service service = new AwsEc2Service(ec2Client, Region.US_EAST_1);

            AwsIntegrationException thrown = assertThrows(
                    AwsIntegrationException.class,
                    () -> service.getInstanceById("i-nonexistent")
            );

            assertNotNull(thrown.getMessage());
            assertEquals("EC2", thrown.getServiceName());
            assertTrue(thrown.getMessage().contains("Unable to inspect EC2 instance"));
        }
    }
}
