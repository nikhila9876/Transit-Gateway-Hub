package com.cloudnexus.aws.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.sts.StsClient;

/**
 * Spring configuration providing managed AWS SDK for Java v2 client beans.
 * Automatically utilizes the AWS DefaultCredentialsProvider chain (supporting
 * environment variables, IAM roles, Learner Lab temporary credentials, and AWS CLI profiles).
 */
@Configuration
public class AwsClientConfig {

    private static final Logger log = LoggerFactory.getLogger(AwsClientConfig.class);

    @Bean
    public AwsCredentialsProvider awsCredentialsProvider() {
        log.info("Initializing AWS SDK DefaultCredentialsProvider chain");
        return DefaultCredentialsProvider.builder().build();
    }

    @Bean(destroyMethod = "close")
    public Ec2Client ec2Client(Region awsRegion, AwsCredentialsProvider awsCredentialsProvider) {
        log.info("Configuring Spring-managed Ec2Client for AWS region: {}", awsRegion.id());
        return Ec2Client.builder()
                .region(awsRegion)
                .credentialsProvider(awsCredentialsProvider)
                .build();
    }

    @Bean(destroyMethod = "close")
    public CloudWatchClient cloudWatchClient(Region awsRegion, AwsCredentialsProvider awsCredentialsProvider) {
        log.info("Configuring Spring-managed CloudWatchClient for AWS region: {}", awsRegion.id());
        return CloudWatchClient.builder()
                .region(awsRegion)
                .credentialsProvider(awsCredentialsProvider)
                .build();
    }

    @Bean(destroyMethod = "close")
    public StsClient stsClient(Region awsRegion, AwsCredentialsProvider awsCredentialsProvider) {
        log.info("Configuring Spring-managed StsClient for AWS region: {}", awsRegion.id());
        return StsClient.builder()
                .region(awsRegion)
                .credentialsProvider(awsCredentialsProvider)
                .build();
    }
}
