package com.cloudnexus.service;

import com.cloudnexus.model.TransitGateway;
import com.cloudnexus.model.TgwAttachment;
import com.cloudnexus.model.TgwRoute;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransitGatewayService {

    private final MockDataStore dataStore;

    public TransitGatewayService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public TransitGateway getTransitGateway() {
        return dataStore.getTransitGateway();
    }

    public List<TgwAttachment> getAttachments() {
        return dataStore.getTgwAttachments();
    }

    public List<TgwRoute> getRoutes() {
        return dataStore.getTgwRoutes();
    }
}
