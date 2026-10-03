package com.cloudnexus.service;

import com.cloudnexus.model.AuditLog;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final MockDataStore dataStore;

    public AuditService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<AuditLog> getAuditLogs() {
        return dataStore.getAuditLogs();
    }
}
