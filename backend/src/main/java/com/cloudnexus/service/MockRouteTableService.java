package com.cloudnexus.service;

import com.cloudnexus.dto.RouteTableDto;
import com.cloudnexus.model.VpcRouteTable;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link RouteTableService}.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockRouteTableService implements RouteTableService {

    private final MockDataStore dataStore;

    public MockRouteTableService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public List<RouteTableDto> getAllRouteTables() {
        return dataStore.getAllRouteTables().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private RouteTableDto toDto(VpcRouteTable rt) {
        return new RouteTableDto(
                rt.getId(),
                rt.getName(),
                rt.getVpcId(),
                rt.getVpcName(),
                rt.getRoutes(),
                rt.getAssociations(),
                "Active"
        );
    }
}
