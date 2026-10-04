package com.cloudnexus.dto;

import java.util.Map;

public class AiAnalysisRequest {
    private String question;
    private String prompt;
    private Map<String, Object> context;

    public AiAnalysisRequest() {}

    public AiAnalysisRequest(String question, Map<String, Object> context) {
        this.question = question;
        this.prompt = question;
        this.context = context;
    }

    public String getQuestion() {
        return question != null ? question : prompt;
    }

    public void setQuestion(String question) {
        this.question = question;
        if (this.prompt == null) {
            this.prompt = question;
        }
    }

    public String getPrompt() {
        return prompt != null ? prompt : question;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
        if (this.question == null) {
            this.question = prompt;
        }
    }

    public Map<String, Object> getContext() { return context; }
    public void setContext(Map<String, Object> context) { this.context = context; }
}
