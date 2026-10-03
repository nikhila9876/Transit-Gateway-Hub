package com.cloudnexus.dto;

import java.util.List;

public class AiAnalysisResponse {
    private String query;
    private String summary;
    private String evidence;
    private String possibleCause;
    private List<String> recommendedChecks;
    private String recommendedAction;
    private String analysis;
    private String model;
    private double confidence;
    private String timestamp;

    public AiAnalysisResponse() {}

    public AiAnalysisResponse(String query, String summary, String evidence, String possibleCause,
                              List<String> recommendedChecks, String recommendedAction,
                              String analysis, String model, double confidence, String timestamp) {
        this.query = query;
        this.summary = summary;
        this.evidence = evidence;
        this.possibleCause = possibleCause;
        this.recommendedChecks = recommendedChecks;
        this.recommendedAction = recommendedAction;
        this.analysis = analysis;
        this.model = model;
        this.confidence = confidence;
        this.timestamp = timestamp;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }

    public String getPossibleCause() { return possibleCause; }
    public void setPossibleCause(String possibleCause) { this.possibleCause = possibleCause; }

    public List<String> getRecommendedChecks() { return recommendedChecks; }
    public void setRecommendedChecks(List<String> recommendedChecks) { this.recommendedChecks = recommendedChecks; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public String getAnalysis() { return analysis; }
    public void setAnalysis(String analysis) { this.analysis = analysis; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
