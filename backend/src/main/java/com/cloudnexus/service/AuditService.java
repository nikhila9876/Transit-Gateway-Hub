package com.cloudnexus.service;

import com.cloudnexus.dto.AuditLogDto;
import java.util.List;

/**
 * Service contract for system and security event audit logs.
 */
public interface AuditService {
    List<AuditLogDto> getAllLogs();
    void recordLog(AuditLogDto auditLog);
}
