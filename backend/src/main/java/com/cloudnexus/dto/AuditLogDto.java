package com.cloudnexus.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditLogDto {
    private String id;
    private String timestamp;
    private String username;
    private String user;
    private String role;
    private String action;
    private String resource;
    private String resourceId;
    private String status;
    private String message;
    private String details;

    public AuditLogDto() {}

    public AuditLogDto(String id, String timestamp, String user, String action,
                       String resource, String status, String details) {
        this.id = id;
        this.timestamp = timestamp;
        this.user = user;
        this.username = user;
        this.action = action;
        this.resource = resource;
        this.status = status;
        this.details = details;
        this.message = details;
    }

    public AuditLogDto(String id, String timestamp, String username, String role,
                       String action, String resource, String resourceId,
                       String status, String message) {
        this.id = id;
        this.timestamp = timestamp;
        this.username = username;
        this.user = username;
        this.role = role;
        this.action = action;
        this.resource = resource;
        this.resourceId = resourceId;
        this.status = status;
        this.message = message;
        this.details = message;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getUsername() { return username != null ? username : user; }
    public void setUsername(String username) {
        this.username = username;
        if (this.user == null) {
            this.user = username;
        }
    }

    public String getUser() { return user != null ? user : username; }
    public void setUser(String user) {
        this.user = user;
        if (this.username == null) {
            this.username = user;
        }
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message != null ? message : details; }
    public void setMessage(String message) {
        this.message = message;
        if (this.details == null) {
            this.details = message;
        }
    }

    public String getDetails() { return details != null ? details : message; }
    public void setDetails(String details) {
        this.details = details;
        if (this.message == null) {
            this.message = details;
        }
    }
}
