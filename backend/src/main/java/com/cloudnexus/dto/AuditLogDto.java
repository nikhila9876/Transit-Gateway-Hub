package com.cloudnexus.dto;

public class AuditLogDto {
    private String id;
    private String timestamp;
    private String user;
    private String action;
    private String resource;
    private String status;
    private String details;

    public AuditLogDto() {}

    public AuditLogDto(String id, String timestamp, String user, String action,
                       String resource, String status, String details) {
        this.id = id;
        this.timestamp = timestamp;
        this.user = user;
        this.action = action;
        this.resource = resource;
        this.status = status;
        this.details = details;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
