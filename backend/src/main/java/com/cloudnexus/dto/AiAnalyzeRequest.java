package com.cloudnexus.dto;

import jakarta.validation.constraints.NotBlank;

public class AiAnalyzeRequest {
    @NotBlank(message = "Prompt cannot be blank")
    private String prompt;

    public AiAnalyzeRequest() {}

    public AiAnalyzeRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}
