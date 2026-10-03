package com.cloudnexus.model;

public class SecurityFinding {
    private String id;
    private String title;
    private String severity;
    private String category;
    private String resourceId;
    private String resourceName;
    private String status;
    private String description;
    private String recommendation;

    public SecurityFinding() {}

    public SecurityFinding(String id, String title, String severity, String category,
                           String resourceId, String resourceName, String status,
                           String description, String recommendation) {
        this.id = id;
        this.title = title;
        this.severity = severity;
        this.category = category;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.status = status;
        this.description = description;
        this.recommendation = recommendation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}
