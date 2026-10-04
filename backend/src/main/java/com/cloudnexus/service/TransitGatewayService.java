package com.cloudnexus.service;

import com.cloudnexus.dto.TransitGatewayAttachmentDto;
import com.cloudnexus.dto.TransitGatewayDto;
import com.cloudnexus.dto.TransitGatewayRouteDto;
import java.util.List;

/**
 * Service contract for AWS Transit Gateway hub inspection.
 */
public interface TransitGatewayService {
    TransitGatewayDto getTransitGateway();
    List<TransitGatewayAttachmentDto> getAttachments();
    List<TransitGatewayRouteDto> getRoutes();
}
