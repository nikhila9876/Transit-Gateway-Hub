package com.cloudnexus.exception;

/**
 * Exception thrown when an AWS API call fails or encounters service throttles / errors.
 * Sanitizes errors to prevent exposing raw credentials or internal SDK stack traces.
 */
public class AwsIntegrationException extends RuntimeException {

    private final String serviceName;
    private final Integer statusCode;

    public AwsIntegrationException(String message) {
        super(message);
        this.serviceName = "AWS";
        this.statusCode = 502;
    }

    public AwsIntegrationException(String serviceName, String message, Throwable cause) {
        super(message, cause);
        this.serviceName = serviceName;
        this.statusCode = 502;
    }

    public AwsIntegrationException(String serviceName, int statusCode, String message) {
        super(message);
        this.serviceName = serviceName;
        this.statusCode = statusCode;
    }

    public String getServiceName() {
        return serviceName;
    }

    public Integer getStatusCode() {
        return statusCode;
    }
}
