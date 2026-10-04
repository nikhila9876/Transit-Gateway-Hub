package com.cloudnexus.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private long timestamp;
    private String path;
    private String correlationId;
    private Integer status;
    private String method;

    public ApiResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public ApiResponse(boolean success, String message, T data, String path) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
        this.path = path;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "Operation successful", data);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public static <T> ApiResponse<T> error(String message, String path) {
        ApiResponse<T> resp = new ApiResponse<>(false, message, null);
        resp.setPath(path);
        return resp;
    }

    public static <T> ApiResponse<T> error(String message, String path, String correlationId) {
        ApiResponse<T> resp = new ApiResponse<>(false, message, null);
        resp.setPath(path);
        resp.setCorrelationId(correlationId);
        return resp;
    }

    public static <T> ApiResponse<T> error(String message, String path, String correlationId, Integer status, String method) {
        ApiResponse<T> resp = new ApiResponse<>(false, message, null);
        resp.setPath(path);
        resp.setCorrelationId(correlationId);
        resp.setStatus(status);
        resp.setMethod(method);
        return resp;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
}
