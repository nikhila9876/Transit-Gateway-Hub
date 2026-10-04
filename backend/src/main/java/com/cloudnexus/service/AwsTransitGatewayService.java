package com.cloudnexus.service;

import com.cloudnexus.dto.TransitGatewayAttachmentDto;
import com.cloudnexus.dto.TransitGatewayDto;
import com.cloudnexus.dto.TransitGatewayRouteDto;
import com.cloudnexus.exception.AwsIntegrationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Real AWS SDK v2 implementation of {@link TransitGatewayService}.
 * Discovers live AWS Transit Gateway, attachments, and route propagation tables.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsTransitGatewayService implements TransitGatewayService {

    private static final Logger log = LoggerFactory.getLogger(AwsTransitGatewayService.class);

    private final Ec2Client ec2Client;
    private final Region awsRegion;

    public AwsTransitGatewayService(Ec2Client ec2Client, Region awsRegion) {
        this.ec2Client = ec2Client;
        this.awsRegion = awsRegion;
    }

    @Override
    public TransitGatewayDto getTransitGateway() {
        log.info("Discovering live AWS Transit Gateway in region: {}", awsRegion.id());
        try {
            DescribeTransitGatewaysResponse response = ec2Client.describeTransitGateways(
                    DescribeTransitGatewaysRequest.builder().build()
            );

            List<TransitGateway> tgws = response.transitGateways();
            List<TransitGatewayAttachmentDto> attachments = getAttachments();
            List<TransitGatewayRouteDto> routes = getRoutes();

            if (tgws == null || tgws.isEmpty()) {
                log.info("No Transit Gateway found in AWS region: {}. Providing fallback representation.", awsRegion.id());
                return new TransitGatewayDto(
                        "tgw-none",
                        "Enterprise-TGW",
                        "available",
                        awsRegion.id(),
                        64512L,
                        "CloudNexus Enterprise Transit Gateway Hub in " + awsRegion.id(),
                        "enable",
                        "enable",
                        "enable",
                        "enable",
                        "enable",
                        "disable",
                        attachments,
                        routes
                );
            }

            TransitGateway tgw = tgws.get(0);
            String name = getTagValue(tgw.tags(), "Name");
            if (name == null || name.trim().isEmpty()) {
                name = "Enterprise-TGW";
            }

            TransitGatewayOptions opt = tgw.options();

            return new TransitGatewayDto(
                    tgw.transitGatewayId(),
                    name,
                    tgw.stateAsString(),
                    awsRegion.id(),
                    (opt != null && opt.amazonSideAsn() != null) ? opt.amazonSideAsn() : 64512L,
                    tgw.description() != null ? tgw.description() : "Enterprise Transit Gateway Hub in " + awsRegion.id(),
                    opt != null ? opt.autoAcceptSharedAttachmentsAsString() : "enable",
                    opt != null ? opt.defaultRouteTableAssociationAsString() : "enable",
                    opt != null ? opt.defaultRouteTablePropagationAsString() : "enable",
                    opt != null ? opt.dnsSupportAsString() : "enable",
                    opt != null ? opt.vpnEcmpSupportAsString() : "enable",
                    opt != null ? opt.multicastSupportAsString() : "disable",
                    attachments,
                    routes
            );

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed querying AWS Transit Gateway: {}", e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to inspect Transit Gateway from AWS: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TransitGatewayAttachmentDto> getAttachments() {
        log.info("Discovering live AWS Transit Gateway Attachments in region: {}", awsRegion.id());
        try {
            // First fetch VPC attachments to get subnet list details
            Map<String, List<String>> subnetsByAttachment = new HashMap<>();
            try {
                DescribeTransitGatewayVpcAttachmentsResponse vpcAttachRes = ec2Client.describeTransitGatewayVpcAttachments(
                        DescribeTransitGatewayVpcAttachmentsRequest.builder().build()
                );
                if (vpcAttachRes.transitGatewayVpcAttachments() != null) {
                    for (TransitGatewayVpcAttachment va : vpcAttachRes.transitGatewayVpcAttachments()) {
                        subnetsByAttachment.put(va.transitGatewayAttachmentId(), va.subnetIds() != null ? va.subnetIds() : Collections.emptyList());
                    }
                }
            } catch (Exception ex) {
                log.debug("Non-fatal: could not query VPC attachment subnets: {}", ex.getMessage());
            }

            // Fetch generic TGW attachments
            DescribeTransitGatewayAttachmentsResponse response = ec2Client.describeTransitGatewayAttachments(
                    DescribeTransitGatewayAttachmentsRequest.builder().build()
            );

            if (response.transitGatewayAttachments() == null || response.transitGatewayAttachments().isEmpty()) {
                return Collections.emptyList();
            }

            return response.transitGatewayAttachments().stream()
                    .map(att -> toAttachmentDto(att, subnetsByAttachment))
                    .collect(Collectors.toList());

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed discovering Transit Gateway attachments: {}", e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to discover Transit Gateway attachments: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TransitGatewayRouteDto> getRoutes() {
        log.info("Discovering live AWS Transit Gateway Routes in region: {}", awsRegion.id());
        try {
            // 1. Locate Transit Gateway Route Tables
            DescribeTransitGatewayRouteTablesResponse rtResponse = ec2Client.describeTransitGatewayRouteTables(
                    DescribeTransitGatewayRouteTablesRequest.builder().build()
            );

            if (rtResponse.transitGatewayRouteTables() == null || rtResponse.transitGatewayRouteTables().isEmpty()) {
                log.info("No Transit Gateway Route Tables found in AWS region: {}", awsRegion.id());
                return Collections.emptyList();
            }

            List<TransitGatewayRouteDto> allRoutes = new ArrayList<>();

            // 2. Query routes from route tables
            for (TransitGatewayRouteTable rt : rtResponse.transitGatewayRouteTables()) {
                try {
                    SearchTransitGatewayRoutesResponse routesRes = ec2Client.searchTransitGatewayRoutes(
                            SearchTransitGatewayRoutesRequest.builder()
                                    .transitGatewayRouteTableId(rt.transitGatewayRouteTableId())
                                    .filters(Filter.builder().name("state").values("active").build())
                                    .build()
                    );

                    if (routesRes.routes() != null) {
                        for (TransitGatewayRoute r : routesRes.routes()) {
                            String attId = "local";
                            String attName = "Local VPC CIDR";

                            if (r.transitGatewayAttachments() != null && !r.transitGatewayAttachments().isEmpty()) {
                                TransitGatewayRouteAttachment att = r.transitGatewayAttachments().get(0);
                                attId = att.transitGatewayAttachmentId();
                                attName = att.resourceId() != null ? att.resourceId() : att.transitGatewayAttachmentId();
                            }

                            allRoutes.add(new TransitGatewayRouteDto(
                                    r.destinationCidrBlock(),
                                    attId,
                                    attName,
                                    r.stateAsString(),
                                    r.typeAsString()
                            ));
                        }
                    }
                } catch (Exception rtEx) {
                    log.debug("Unable to search routes for TGW route table {}: {}", rt.transitGatewayRouteTableId(), rtEx.getMessage());
                }
            }

            return allRoutes;

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed searching Transit Gateway routes: {}", e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to inspect Transit Gateway routes: " + e.getMessage(), e);
        }
    }

    private TransitGatewayAttachmentDto toAttachmentDto(TransitGatewayAttachment att, Map<String, List<String>> subnetsByAttachment) {
        String tagVal = getTagValue(att.tags(), "Name");
        String name = tagVal != null && !tagVal.trim().isEmpty() ? tagVal : att.transitGatewayAttachmentId();
        String environment = resolveEnvironment(tagVal, att.resourceId());

        String associationState = (att.association() != null && att.association().stateAsString() != null)
                ? att.association().stateAsString()
                : "associated";

        List<String> subnets = subnetsByAttachment.getOrDefault(att.transitGatewayAttachmentId(), Collections.emptyList());

        return new TransitGatewayAttachmentDto(
                att.transitGatewayAttachmentId(),
                name,
                att.resourceId(),
                environment,
                att.resourceTypeAsString(),
                att.stateAsString(),
                associationState,
                subnets
        );
    }

    private String getTagValue(List<Tag> tags, String key) {
        if (tags == null) return null;
        return tags.stream()
                .filter(t -> key.equalsIgnoreCase(t.key()))
                .map(Tag::value)
                .findFirst()
                .orElse(null);
    }

    private String resolveEnvironment(String tagVal, String resourceId) {
        if (tagVal != null) {
            String lower = tagVal.toLowerCase();
            if (lower.contains("dev")) return "DEV";
            if (lower.contains("test")) return "TEST";
            if (lower.contains("prod")) return "PROD";
        }
        return resourceId != null ? resourceId : "Spoke VPC";
    }
}
