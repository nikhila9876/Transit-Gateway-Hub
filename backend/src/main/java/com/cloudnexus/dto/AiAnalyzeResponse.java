package com.cloudnexus.dto;

public class AiAnalyzeResponse {
    private String query;
    private String analysis;
    private String model;
    private double confidence;
    private String timestamp;

    public AiAnalyzeResponse() {}

    public AiAnalyzeResponse(String query, String analysis, String model, double confidence, String timestamp) {
        this.query = query;
        this.analysis = analysis;
        this.model = model;
        this.confidence = confidence;
        this.timestamp = timestamp;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getAnalysis() { return analysis; }
    public void setAnalysis(String analysis) { this.analysis = analysis; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
