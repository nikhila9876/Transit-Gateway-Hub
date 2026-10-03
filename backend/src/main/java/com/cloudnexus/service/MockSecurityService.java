package com.cloudnexus.service;

import com.cloudnexus.dto.SecurityFindingDto;
import com.cloudnexus.model.SecurityFinding;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link SecurityService}.
 * Provides simulated security posture findings for the multi-VPC environment.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockSecurityService implements SecurityService {

    private final MockDataStore dataStore;

    public MockSecurityService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public List<SecurityFindingDto> getAllFindings() {
        return dataStore.getSecurityFindings().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private SecurityFindingDto toDto(SecurityFinding f) {
        return new SecurityFindingDto(
                f.getId(),
                f.getTitle(),
                f.getSeverity(),
                f.getCategory(),
                f.getResourceId(),
                f.getResourceName(),
                f.getStatus(),
                f.getDescription(),
                "Inbound TCP port isolation verified by SG rules",
                f.getRecommendation()
        );
    }
}
