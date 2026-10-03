package com.cloudnexus.service;

import com.cloudnexus.model.VpcRouteTable;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteTableService {

    private final MockDataStore dataStore;

    public RouteTableService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<VpcRouteTable> getAllRouteTables() {
        return dataStore.getAllRouteTables();
    }
}
