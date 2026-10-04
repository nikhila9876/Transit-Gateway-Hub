package com.cloudnexus.service;

import com.cloudnexus.dto.RouteTableDto;
import com.cloudnexus.exception.AwsIntegrationException;
import com.cloudnexus.model.RouteEntry;
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
 * Real AWS SDK v2 implementation of {@link RouteTableService}.
 * Discovers live VPC Route Tables, subnet associations, and CIDR targets.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsRouteTableService implements RouteTableService {

    private static final Logger log = LoggerFactory.getLogger(AwsRouteTableService.class);

    private final Ec2Client ec2Client;
    private final Region awsRegion;

    public AwsRouteTableService(Ec2Client ec2Client, Region awsRegion) {
        this.ec2Client = ec2Client;
        this.awsRegion = awsRegion;
    }

    @Override
    public List<RouteTableDto> getAllRouteTables() {
        log.info("Discovering live AWS VPC Route Tables in region: {}", awsRegion.id());
        try {
            // 1. Fetch VPC names map for clean correlation
            Map<String, String> vpcNames = fetchVpcNamesMap();

            // 2. Fetch all VPC Route Tables
            DescribeRouteTablesResponse response = ec2Client.describeRouteTables(
                    DescribeRouteTablesRequest.builder().build()
            );

            if (response.routeTables() == null || response.routeTables().isEmpty()) {
                log.info("No VPC Route Tables found in AWS region: {}", awsRegion.id());
                return Collections.emptyList();
            }

            return response.routeTables().stream()
                    .map(rt -> toDto(rt, vpcNames))
                    .collect(Collectors.toList());

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed querying AWS VPC Route Tables: {}", e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to discover VPC route tables: " + e.getMessage(), e);
        }
    }

    private RouteTableDto toDto(RouteTable rt, Map<String, String> vpcNames) {
        String tagVal = getTagValue(rt.tags(), "Name");
        String name = (tagVal != null && !tagVal.trim().isEmpty()) ? tagVal : rt.routeTableId();

        String vpcFriendlyName = vpcNames.getOrDefault(rt.vpcId(), rt.vpcId());

        // Map routes
        List<RouteEntry> routes = new ArrayList<>();
        if (rt.routes() != null) {
            for (Route r : rt.routes()) {
                String destination = r.destinationCidrBlock();
                if (destination == null) destination = r.destinationIpv6CidrBlock();
                if (destination == null) destination = r.destinationPrefixListId();
                if (destination == null) destination = "0.0.0.0/0";

                String target = "local";
                if (r.transitGatewayId() != null) target = r.transitGatewayId();
                else if (r.gatewayId() != null) target = r.gatewayId();
                else if (r.natGatewayId() != null) target = r.natGatewayId();
                else if (r.networkInterfaceId() != null) target = r.networkInterfaceId();
                else if (r.vpcPeeringConnectionId() != null) target = r.vpcPeeringConnectionId();

                String status = (r.stateAsString() != null) ? r.stateAsString() : "active";
                String origin = (r.originAsString() != null) ? r.originAsString() : "CreateRoute";
                String propagated = origin.toLowerCase().contains("propagat") ? "Yes" : "No";

                routes.add(new RouteEntry(destination, target, status, propagated));
            }
        }

        // Map associations
        List<String> associations = new ArrayList<>();
        if (rt.associations() != null) {
            for (RouteTableAssociation assoc : rt.associations()) {
                if (assoc.subnetId() != null) {
                    associations.add(assoc.subnetId());
                } else if (assoc.main() != null && assoc.main()) {
                    associations.add("Main Association");
                }
            }
        }
        if (associations.isEmpty()) {
            associations.add("No explicit subnet associations");
        }

        return new RouteTableDto(
                rt.routeTableId(),
                name,
                rt.vpcId(),
                vpcFriendlyName,
                routes,
                associations,
                "Active"
        );
    }

    private Map<String, String> fetchVpcNamesMap() {
        Map<String, String> map = new HashMap<>();
        try {
            DescribeVpcsResponse res = ec2Client.describeVpcs(DescribeVpcsRequest.builder().build());
            if (res.vpcs() != null) {
                for (Vpc v : res.vpcs()) {
                    String tag = getTagValue(v.tags(), "Name");
                    String friendly = (tag != null && !tag.trim().isEmpty()) ? tag : v.vpcId();
                    if (friendly.toLowerCase().contains("dev")) friendly = "DEV";
                    else if (friendly.toLowerCase().contains("test")) friendly = "TEST";
                    else if (friendly.toLowerCase().contains("prod")) friendly = "PROD";
                    map.put(v.vpcId(), friendly);
                }
            }
        } catch (Exception e) {
            log.debug("Non-fatal: could not query VPC names for route tables: {}", e.getMessage());
        }
        return map;
    }

    private String getTagValue(List<Tag> tags, String key) {
        if (tags == null) return null;
        return tags.stream()
                .filter(t -> key.equalsIgnoreCase(t.key()))
                .map(Tag::value)
                .findFirst()
                .orElse(null);
    }
}
