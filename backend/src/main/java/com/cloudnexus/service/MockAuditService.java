package com.cloudnexus.service;

import com.cloudnexus.audit.AuditEventPublisher;
import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.model.AuditLog;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link AuditService} and {@link AuditEventPublisher}.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockAuditService implements AuditService, AuditEventPublisher {

    private final MockDataStore dataStore;

    public MockAuditService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public List<AuditLogDto> getAllLogs() {
        return dataStore.getAuditLogs().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void recordLog(AuditLogDto auditLog) {
        dataStore.getAuditLogs().add(0, new AuditLog(
                auditLog.getId() != null ? auditLog.getId() : "aud-" + System.currentTimeMillis(),
                auditLog.getTimestamp() != null ? auditLog.getTimestamp() : Instant.now().toString(),
                auditLog.getUser() != null ? auditLog.getUser() : "system",
                auditLog.getAction(),
                auditLog.getResource(),
                auditLog.getStatus(),
                auditLog.getDetails()
        ));
    }

    @Override
    public void recordEvent(String user, String action, String resource, String status, String details) {
        AuditLogDto dto = new AuditLogDto();
        dto.setUser(user);
        dto.setAction(action);
        dto.setResource(resource);
        dto.setStatus(status);
        dto.setDetails(details);
        recordLog(dto);
    }

    private AuditLogDto toDto(AuditLog a) {
        return new AuditLogDto(
                a.getId(),
                a.getTimestamp(),
                a.getActor(),
                a.getAction(),
                a.getResource(),
                a.getStatus(),
                a.getDetails()
        );
    }
}
