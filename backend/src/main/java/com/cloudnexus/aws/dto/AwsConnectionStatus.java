package com.cloudnexus.aws.dto;

public class AwsConnectionStatus {
    private boolean connected;
    private String region;
    private String accountId;
    private String arn;
    private String status;
    private String message;
    private long timestamp;

    public AwsConnectionStatus() {}

    public AwsConnectionStatus(boolean connected, String region, String accountId, String arn, String status, String message, long timestamp) {
        this.connected = connected;
        this.region = region;
        this.accountId = accountId;
        this.arn = arn;
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public boolean isConnected() { return connected; }
    public void setConnected(boolean connected) { this.connected = connected; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getArn() { return arn; }
    public void setArn(String arn) { this.arn = arn; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
