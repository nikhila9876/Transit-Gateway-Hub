package com.cloudnexus.dto;

public class SecurityFindingDto {
    private String id;
    private String title;
    private String severity;
    private String category;
    private String resource;
    private String resourceName;
    private String status;
    private String description;
    private String evidence;
    private String recommendation;

    public SecurityFindingDto() {}

    public SecurityFindingDto(String id, String title, String severity, String category,
                              String resource, String resourceName, String status,
                              String description, String evidence, String recommendation) {
        this.id = id;
        this.title = title;
        this.severity = severity;
        this.category = category;
        this.resource = resource;
        this.resourceName = resourceName;
        this.status = status;
        this.description = description;
        this.evidence = evidence;
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

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}
