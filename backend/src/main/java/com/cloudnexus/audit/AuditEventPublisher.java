package com.cloudnexus.audit;

import com.cloudnexus.dto.AuditLogDto;

/**
 * Enterprise Audit Trail publisher interface for event auditing and compliance logging.
 */
public interface AuditEventPublisher {
    void recordEvent(String user, String action, String resource, String status, String details);
    void recordLog(AuditLogDto auditLog);
}
