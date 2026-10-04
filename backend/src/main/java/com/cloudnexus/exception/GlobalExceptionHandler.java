package com.cloudnexus.exception;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.security.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Enterprise global exception handler providing safe error responses and observability
 * via request correlation IDs, HTTP status tracking, and structured SLF4J logging.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private String getCorrelationId(HttpServletRequest request) {
        Object attr = request.getAttribute(CorrelationIdFilter.CORRELATION_ID_HEADER);
        if (attr != null && !attr.toString().isBlank()) {
            return attr.toString();
        }
        String header = request.getHeader(CorrelationIdFilter.CORRELATION_ID_HEADER);
        return (header != null && !header.isBlank()) ? header : UUID.randomUUID().toString();
    }

    private ResponseEntity<ApiResponse<Void>> buildErrorResponse(HttpStatus status, String message, HttpServletRequest request) {
        String correlationId = getCorrelationId(request);
        ApiResponse<Void> body = ApiResponse.error(message, request.getRequestURI(), correlationId, status.value(), request.getMethod());
        return ResponseEntity.status(status)
                .header(CorrelationIdFilter.CORRELATION_ID_HEADER, correlationId)
                .body(body);
    }

    // 404 - Not Found
    @ExceptionHandler({ResourceNotFoundException.class, NoResourceFoundException.class})
    public ResponseEntity<ApiResponse<Void>> handleNotFound(Exception ex, HttpServletRequest request) {
        log.warn("[cid={}] Resource not found at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    // 401 - Unauthorized
    @ExceptionHandler({BadCredentialsException.class, AuthenticationException.class, InsufficientAuthenticationException.class})
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(Exception ex, HttpServletRequest request) {
        log.warn("[cid={}] Authentication failed at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication failed: " + ex.getMessage(), request);
    }

    // 403 - Forbidden / Access Denied
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("[cid={}] Access denied at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Access denied: You do not have permission to access this resource", request);
    }

    // 400 - Validation & Bad Request
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining("; "));
        log.warn("[cid={}] Validation failed at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), errors);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed: " + errors, request);
    }

    @ExceptionHandler({IllegalArgumentException.class, HttpMessageNotReadableException.class, MissingServletRequestParameterException.class})
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(Exception ex, HttpServletRequest request) {
        log.warn("[cid={}] Bad request at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Invalid request: " + ex.getMessage(), request);
    }

    // AWS Service & Integration Errors (502 / 503)
    @ExceptionHandler(AwsIntegrationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAwsIntegration(AwsIntegrationException ex, HttpServletRequest request) {
        log.warn("[cid={}] AWS Integration error at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.BAD_GATEWAY, ex.getMessage(), request);
    }

    @ExceptionHandler(software.amazon.awssdk.awscore.exception.AwsServiceException.class)
    public ResponseEntity<ApiResponse<Void>> handleAwsService(software.amazon.awssdk.awscore.exception.AwsServiceException ex, HttpServletRequest request) {
        log.warn("[cid={}] AWS Service exception [status {}] at {} {}: {}", getCorrelationId(request), ex.statusCode(), request.getMethod(), request.getRequestURI(),
                ex.awsErrorDetails() != null ? ex.awsErrorDetails().errorMessage() : ex.getMessage());
        String userMessage = "AWS service encountered an error communicating with region resources.";
        if (ex.statusCode() == 403) {
            userMessage = "Access denied by AWS IAM policy. Please verify AWS credentials and least-privilege permissions.";
        } else if (ex.statusCode() == 404) {
            userMessage = "Requested AWS resource was not found in the configured region.";
        }
        return buildErrorResponse(HttpStatus.BAD_GATEWAY, userMessage, request);
    }

    @ExceptionHandler(software.amazon.awssdk.core.exception.SdkClientException.class)
    public ResponseEntity<ApiResponse<Void>> handleSdkClient(software.amazon.awssdk.core.exception.SdkClientException ex, HttpServletRequest request) {
        log.warn("[cid={}] AWS SDK client exception at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, "Unable to communicate with AWS SDK: credentials unavailable or network unreachable.", request);
    }

    // 500 - Internal Server Error (Never expose stack traces)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("[cid={}] Internal server error occurred at {} {}: {}", getCorrelationId(request), request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An internal server error occurred while processing the request", request);
    }
}
