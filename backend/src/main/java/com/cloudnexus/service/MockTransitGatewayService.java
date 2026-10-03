package com.cloudnexus.service;

import com.cloudnexus.dto.TransitGatewayAttachmentDto;
import com.cloudnexus.dto.TransitGatewayDto;
import com.cloudnexus.dto.TransitGatewayRouteDto;
import com.cloudnexus.model.TgwAttachment;
import com.cloudnexus.model.TgwRoute;
import com.cloudnexus.model.TransitGateway;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mock implementation of {@link TransitGatewayService}.
 */
@Service
public class MockTransitGatewayService implements TransitGatewayService {

    private final MockDataStore dataStore;

    public MockTransitGatewayService(MockDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @Override
    public TransitGatewayDto getTransitGateway() {
        TransitGateway tgw = dataStore.getTransitGateway();
        return new TransitGatewayDto(
                tgw.getId(),
                tgw.getName(),
                tgw.getState(),
                tgw.getRegion(),
                tgw.getAsn(),
                tgw.getDescription(),
                tgw.getAutoAcceptSharedAttachments(),
                tgw.getDefaultRouteTableAssociation(),
                tgw.getDefaultRouteTablePropagation(),
                tgw.getDnsSupport(),
                tgw.getVpnEcmpSupport(),
                tgw.getMulticastSupport(),
                getAttachments(),
                getRoutes()
        );
    }

    @Override
    public List<TransitGatewayAttachmentDto> getAttachments() {
        return dataStore.getTgwAttachments().stream()
                .map(this::toAttachmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransitGatewayRouteDto> getRoutes() {
        return dataStore.getTgwRoutes().stream()
                .map(this::toRouteDto)
                .collect(Collectors.toList());
    }

    private TransitGatewayAttachmentDto toAttachmentDto(TgwAttachment a) {
        return new TransitGatewayAttachmentDto(
                a.getId(),
                a.getName(),
                a.getVpcId(),
                a.getVpcName(),
                a.getResourceType(),
                a.getState(),
                a.getAssociationState(),
                a.getSubnetIds()
        );
    }

    private TransitGatewayRouteDto toRouteDto(TgwRoute r) {
        return new TransitGatewayRouteDto(
                r.getDestinationCidr(),
                r.getTargetAttachmentId(),
                r.getTargetName(),
                r.getState(),
                r.getType()
        );
    }
}
