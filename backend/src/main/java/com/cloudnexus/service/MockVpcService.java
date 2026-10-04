package com.cloudnexus.service;

import com.cloudnexus.dto.VpcDetailsDto;
import com.cloudnexus.dto.VpcDto;
import com.cloudnexus.model.Vpc;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link VpcService} backed by the simulated development datastore.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockVpcService implements VpcService {

    private final MockDataStore dataStore;

    public MockVpcService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public List<VpcDto> getAllVpcs() {
        return dataStore.getAllVpcs().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<VpcDetailsDto> getVpcById(String id) {
        return dataStore.getVpcById(id)
                .map(this::toDetailsDto);
    }

    private VpcDto toDto(Vpc v) {
        return new VpcDto(
                v.getId(),
                v.getName(),
                v.getDisplayName(),
                v.getCidr(),
                v.getRegion(),
                v.getState(),
                v.getSubnetCount(),
                v.getEc2Count(),
                v.getAttachmentStatus()
        );
    }

    private VpcDetailsDto toDetailsDto(Vpc v) {
        return new VpcDetailsDto(
                v.getId(),
                v.getName(),
                v.getDisplayName(),
                v.getCidr(),
                v.getRegion(),
                v.getState(),
                v.getSubnetCount(),
                v.getEc2Count(),
                v.getAttachmentStatus(),
                v.getSubnets(),
                v.getIgwId(),
                v.getSecurityGroup(),
                v.getColor()
        );
    }
}
