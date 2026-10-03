package com.cloudnexus.service;

import com.cloudnexus.model.Vpc;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VpcService {

    private final MockDataStore dataStore;

    public VpcService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<Vpc> getAllVpcs() {
        return dataStore.getAllVpcs();
    }

    public Optional<Vpc> getVpcById(String id) {
        return dataStore.getVpcById(id);
    }
}
