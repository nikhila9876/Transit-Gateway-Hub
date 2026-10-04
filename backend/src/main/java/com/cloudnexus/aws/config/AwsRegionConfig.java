package com.cloudnexus.aws.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;

/**
 * Configures the AWS Region dynamically using application properties or environment variables.
 * Defaults to us-east-1 as specified in CloudNexus architecture.
 */
@Configuration
public class AwsRegionConfig {

    @Value("${cloudnexus.aws.region:us-east-1}")
    private String configuredRegion;

    @Bean
    public Region awsRegion() {
        String regionStr = (configuredRegion != null && !configuredRegion.trim().isEmpty())
                ? configuredRegion.trim()
                : "us-east-1";
        return Region.of(regionStr);
    }

    public String getConfiguredRegionName() {
        return configuredRegion != null && !configuredRegion.trim().isEmpty()
                ? configuredRegion.trim()
                : "us-east-1";
    }
}
