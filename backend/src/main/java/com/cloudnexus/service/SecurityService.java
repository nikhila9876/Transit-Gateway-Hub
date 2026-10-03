package com.cloudnexus.service;

import com.cloudnexus.model.SecurityFinding;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityService {

    private final MockDataStore dataStore;

    public SecurityService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<SecurityFinding> getFindings() {
        return dataStore.getSecurityFindings();
    }
}
