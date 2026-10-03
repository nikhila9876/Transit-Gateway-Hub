package com.cloudnexus.service;

import com.cloudnexus.model.Ec2Instance;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Ec2Service {

    private final MockDataStore dataStore;

    public Ec2Service(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<Ec2Instance> getAllInstances() {
        return dataStore.getAllEc2Instances();
    }
}
