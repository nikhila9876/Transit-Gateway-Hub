package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
import com.cloudnexus.model.Ec2Instance;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link Ec2Service}.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockEc2Service implements Ec2Service {

    private final MockDataStore dataStore;

    public MockEc2Service(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public List<Ec2InstanceDto> getAllEc2Instances() {
        return dataStore.getAllEc2Instances().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Ec2InstanceDto> getInstanceById(String id) {
        return dataStore.getAllEc2Instances().stream()
                .filter(i -> i.getId().equalsIgnoreCase(id) || i.getName().equalsIgnoreCase(id))
                .findFirst()
                .map(this::toDto);
    }

    private Ec2InstanceDto toDto(Ec2Instance i) {
        return new Ec2InstanceDto(
                i.getId(),
                i.getName(),
                i.getState(),
                i.getPrivateIp(),
                i.getPublicIp(),
                i.getEnvironment(),
                i.getVpcId(),
                i.getSubnetId(),
                i.getSubnetId(),
                i.getInstanceType(),
                "running".equalsIgnoreCase(i.getState()) ? "Healthy" : "Attention",
                i.getSecurityGroupId(),
                i.getSecurityGroupName(),
                i.getIamRole(),
                i.getAppPort(),
                i.isSessionManagerEnabled()
        );
    }
}
