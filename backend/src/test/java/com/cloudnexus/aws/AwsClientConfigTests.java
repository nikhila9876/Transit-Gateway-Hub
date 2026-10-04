package com.cloudnexus.aws;

import com.cloudnexus.aws.config.AwsClientConfig;
import com.cloudnexus.aws.config.AwsRegionConfig;
import com.cloudnexus.aws.dto.AwsConnectionStatus;
import com.cloudnexus.aws.service.AwsConnectionService;
import com.cloudnexus.exception.AwsIntegrationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.sts.StsClient;

import static org.junit.jupiter.api.Assertions.*;

class AwsClientConfigTests {

    @Test
    @DisplayName("AwsRegionConfig resolves default us-east-1 region correctly")
    void testRegionConfigDefaults() {
        AwsRegionConfig regionConfig = new AwsRegionConfig();
        Region region = regionConfig.awsRegion();
        assertNotNull(region);
        assertEquals(Region.US_EAST_1, region);
        assertEquals("us-east-1", regionConfig.getConfiguredRegionName());
    }

    @Test
    @DisplayName("AwsClientConfig instantiates required AWS SDK v2 client beans")
    void testAwsClientInstantiation() {
        AwsClientConfig clientConfig = new AwsClientConfig();
        AwsCredentialsProvider creds = AnonymousCredentialsProvider.create();
        Region region = Region.US_EAST_1;

        assertNotNull(clientConfig.awsCredentialsProvider());

        try (Ec2Client ec2Client = clientConfig.ec2Client(region, creds);
             CloudWatchClient cloudWatchClient = clientConfig.cloudWatchClient(region, creds);
             StsClient stsClient = clientConfig.stsClient(region, creds)) {

            assertNotNull(ec2Client);
            assertNotNull(cloudWatchClient);
            assertNotNull(stsClient);
        }
    }

    @Test
    @DisplayName("AwsConnectionStatus data model holds connection metadata correctly")
    void testAwsConnectionStatusModel() {
        long now = System.currentTimeMillis();
        AwsConnectionStatus status = new AwsConnectionStatus(
                true,
                "us-east-1",
                "******1234",
                "arn:aws:sts::123456789012:assumed-role/LabRole/CloudNexus",
                "CONNECTED",
                "Connected to AWS in us-east-1",
                now
        );

        assertTrue(status.isConnected());
        assertEquals("us-east-1", status.getRegion());
        assertEquals("******1234", status.getAccountId());
        assertEquals("CONNECTED", status.getStatus());
        assertEquals(now, status.getTimestamp());
        assertTrue(status.getMessage().contains("Connected"));
    }

    @Test
    @DisplayName("AwsConnectionService gracefully handles unauthenticated client without throwing uncaught exceptions")
    void testConnectionGracefulFallbackWhenCredentialsMissing() {
        AwsClientConfig clientConfig = new AwsClientConfig();
        try (StsClient stsClient = clientConfig.stsClient(Region.US_EAST_1, AnonymousCredentialsProvider.create())) {
            AwsConnectionService service = new AwsConnectionService(stsClient, Region.US_EAST_1);
            AwsConnectionStatus status = service.checkConnection();

            assertNotNull(status);
            assertEquals("us-east-1", status.getRegion());
            assertNotNull(status.getStatus());
            assertNotNull(status.getMessage());
            assertFalse(status.isConnected());
        }
    }

    @Test
    @DisplayName("AwsIntegrationException stores HTTP status code and service name cleanly")
    void testAwsIntegrationException() {
        AwsIntegrationException ex = new AwsIntegrationException("EC2", 502, "EC2 describe failed");
        assertEquals("EC2", ex.getServiceName());
        assertEquals(502, ex.getStatusCode());
        assertEquals("EC2 describe failed", ex.getMessage());
    }
}
