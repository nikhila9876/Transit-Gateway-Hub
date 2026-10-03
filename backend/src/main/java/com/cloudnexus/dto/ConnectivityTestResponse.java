package com.cloudnexus.dto;

import java.util.List;

public class ConnectivityTestResponse {
    private String status;
    private int statusCode;
    private String message;
    private Double latencyMs;
    private List<String> path;
    private String timestamp;

    public ConnectivityTestResponse() {}

    public ConnectivityTestResponse(String status, int statusCode, String message, Double latencyMs, List<String> path, String timestamp) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.latencyMs = latencyMs;
        this.path = path;
        this.timestamp = timestamp;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Double latencyMs) { this.latencyMs = latencyMs; }

    public List<String> getPath() { return path; }
    public void setPath(List<String> path) { this.path = path; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
