package com.cloudnexus.dto;

import java.util.List;

public class ConnectivityTestResponse {
    private String source;
    private String destination;
    private String protocol;
    private int port;
    private String status;
    private int statusCode;
    private String message;
    private String diagnosticMessage;
    private Double latency;
    private Double latencyMs;
    private List<String> path;
    private String timestamp;
    private String diagnosticMethod;
    private String possibleCause;
    private List<String> recommendedChecks;

    public ConnectivityTestResponse() {}

    public ConnectivityTestResponse(String status, int statusCode, String message,
                                    Double latencyMs, List<String> path, String timestamp) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.diagnosticMessage = message;
        this.latency = latencyMs;
        this.latencyMs = latencyMs;
        this.path = path;
        this.timestamp = timestamp;
    }

    public ConnectivityTestResponse(String source, String destination, String protocol, int port,
                                    String status, int statusCode, String message,
                                    Double latencyMs, List<String> path, String timestamp) {
        this.source = source;
        this.destination = destination;
        this.protocol = protocol;
        this.port = port;
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.diagnosticMessage = message;
        this.latency = latencyMs;
        this.latencyMs = latencyMs;
        this.path = path;
        this.timestamp = timestamp;
    }

    public ConnectivityTestResponse(String source, String destination, String protocol, int port,
                                    String status, int statusCode, String message,
                                    Double latencyMs, List<String> path, String timestamp,
                                    String diagnosticMethod, String possibleCause,
                                    List<String> recommendedChecks) {
        this.source = source;
        this.destination = destination;
        this.protocol = protocol;
        this.port = port;
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.diagnosticMessage = message;
        this.latency = latencyMs;
        this.latencyMs = latencyMs;
        this.path = path;
        this.timestamp = timestamp;
        this.diagnosticMethod = diagnosticMethod;
        this.possibleCause = possibleCause;
        this.recommendedChecks = recommendedChecks;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) {
        this.message = message;
        if (this.diagnosticMessage == null) this.diagnosticMessage = message;
    }

    public String getDiagnosticMessage() {
        return diagnosticMessage != null ? diagnosticMessage : message;
    }
    public void setDiagnosticMessage(String diagnosticMessage) {
        this.diagnosticMessage = diagnosticMessage;
        if (this.message == null) this.message = diagnosticMessage;
    }

    public Double getLatency() {
        return latency != null ? latency : latencyMs;
    }
    public void setLatency(Double latency) {
        this.latency = latency;
        if (this.latencyMs == null) this.latencyMs = latency;
    }

    public Double getLatencyMs() {
        return latencyMs != null ? latencyMs : latency;
    }
    public void setLatencyMs(Double latencyMs) {
        this.latencyMs = latencyMs;
        if (this.latency == null) this.latency = latencyMs;
    }

    public List<String> getPath() { return path; }
    public void setPath(List<String> path) { this.path = path; }

    public List<String> getEvidence() { return path; }
    public void setEvidence(List<String> evidence) { this.path = evidence; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getDiagnosticMethod() { return diagnosticMethod; }
    public void setDiagnosticMethod(String diagnosticMethod) { this.diagnosticMethod = diagnosticMethod; }

    public String getPossibleCause() { return possibleCause; }
    public void setPossibleCause(String possibleCause) { this.possibleCause = possibleCause; }

    public List<String> getRecommendedChecks() { return recommendedChecks; }
    public void setRecommendedChecks(List<String> recommendedChecks) { this.recommendedChecks = recommendedChecks; }
}
