package com.cloudnexus.service;

import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.model.AuditLog;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link AuditService}.
 */
@Service
public class MockAuditService implements AuditService {

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
        // Appends to the in-memory log list in MockDataStore
        dataStore.getAuditLogs().add(0, new AuditLog(
                auditLog.getId() != null ? auditLog.getId() : "aud-" + System.currentTimeMillis(),
                auditLog.getTimestamp(),
                auditLog.getUser(),
                auditLog.getAction(),
                auditLog.getResource(),
                auditLog.getStatus(),
                auditLog.getDetails()
        ));
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
