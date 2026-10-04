package com.cloudnexus.aws.service;

import com.cloudnexus.aws.dto.AwsConnectionStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.GetCallerIdentityResponse;
import software.amazon.awssdk.services.sts.model.StsException;

/**
 * Service providing safe AWS connectivity health checks.
 * Determines whether the backend can communicate with AWS via DefaultCredentialsProvider
 * without exposing sensitive tokens, keys, or credentials.
 */
@Service
public class AwsConnectionService {

    private static final Logger log = LoggerFactory.getLogger(AwsConnectionService.class);

    private final StsClient stsClient;
    private final Region awsRegion;

    public AwsConnectionService(StsClient stsClient, Region awsRegion) {
        this.stsClient = stsClient;
        this.awsRegion = awsRegion;
    }

    /**
     * Checks AWS connection health safely.
     * @return AwsConnectionStatus with sanitized non-sensitive connection details.
     */
    public AwsConnectionStatus checkConnection() {
        long now = System.currentTimeMillis();
        try {
            GetCallerIdentityResponse identity = stsClient.getCallerIdentity();
            String rawAccount = identity.account();
            String maskedAccount = (rawAccount != null && rawAccount.length() > 4)
                    ? "******" + rawAccount.substring(rawAccount.length() - 4)
                    : "configured";

            log.info("AWS connectivity check succeeded for region: {}", awsRegion.id());
            return new AwsConnectionStatus(
                    true,
                    awsRegion.id(),
                    maskedAccount,
                    identity.arn(),
                    "CONNECTED",
                    "Successfully authenticated with AWS in region " + awsRegion.id(),
                    now
            );
        } catch (SdkClientException e) {
            log.warn("AWS client communication unavailable: {}", e.getMessage());
            return new AwsConnectionStatus(
                    false,
                    awsRegion.id(),
                    null,
                    null,
                    "CREDENTIALS_UNAVAILABLE",
                    "AWS credentials not detected in environment or IAM role. Running in safe mode.",
                    now
            );
        } catch (StsException e) {
            log.warn("AWS STS Service error: {} - {}", e.statusCode(), e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage());
            return new AwsConnectionStatus(
                    false,
                    awsRegion.id(),
                    null,
                    null,
                    "AUTHENTICATION_ERROR",
                    "AWS rejected caller identity verification: " + (e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage()),
                    now
            );
        } catch (Exception e) {
            log.warn("Unexpected error checking AWS connectivity: {}", e.getMessage());
            return new AwsConnectionStatus(
                    false,
                    awsRegion.id(),
                    null,
                    null,
                    "UNAVAILABLE",
                    "Unable to verify AWS connection: " + e.getMessage(),
                    now
            );
        }
    }
}
