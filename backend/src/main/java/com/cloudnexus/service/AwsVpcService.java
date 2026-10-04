package com.cloudnexus.service;

import com.cloudnexus.dto.VpcDetailsDto;
import com.cloudnexus.dto.VpcDto;
import com.cloudnexus.exception.AwsIntegrationException;
import com.cloudnexus.model.Subnet;
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
 * Real AWS SDK v2 implementation of {@link VpcService}.
 * Queries live AWS EC2 endpoints for dynamic discovery of VPCs, Subnets,
 * Workloads, and Transit Gateway attachments.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsVpcService implements VpcService {

    private static final Logger log = LoggerFactory.getLogger(AwsVpcService.class);

    private final Ec2Client ec2Client;
    private final Region awsRegion;

    public AwsVpcService(Ec2Client ec2Client, Region awsRegion) {
        this.ec2Client = ec2Client;
        this.awsRegion = awsRegion;
    }

    @Override
    public List<VpcDto> getAllVpcs() {
        log.info("Discovering live AWS VPCs in region: {}", awsRegion.id());
        try {
            // 1. Discover all VPCs in the region
            DescribeVpcsResponse vpcResponse = ec2Client.describeVpcs(DescribeVpcsRequest.builder().build());
            List<Vpc> awsVpcs = vpcResponse.vpcs();

            if (awsVpcs == null || awsVpcs.isEmpty()) {
                log.info("No VPCs discovered in AWS region: {}", awsRegion.id());
                return Collections.emptyList();
            }

            // 2. Batch discover subnets grouped by VPC to avoid N+1 queries
            Map<String, List<software.amazon.awssdk.services.ec2.model.Subnet>> subnetsByVpc = fetchSubnetsGroupedByVpc();

            // 3. Batch discover EC2 workload counts grouped by VPC
            Map<String, Integer> ec2CountByVpc = fetchEc2CountsGroupedByVpc();

            // 4. Batch discover Transit Gateway VPC attachments
            Map<String, String> tgwStatusByVpc = fetchTgwAttachmentStatusesGroupedByVpc();

            // 5. Map into standard VpcDto
            return awsVpcs.stream()
                    .map(vpc -> toVpcDto(vpc, subnetsByVpc, ec2CountByVpc, tgwStatusByVpc))
                    .collect(Collectors.toList());

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed discovering VPCs from AWS region {}: {}", awsRegion.id(), e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to discover VPCs from AWS in region " + awsRegion.id() + ": " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<VpcDetailsDto> getVpcById(String id) {
        log.info("Retrieving detailed AWS VPC specifications for VPC ID: {}", id);
        try {
            DescribeVpcsResponse response = ec2Client.describeVpcs(
                    DescribeVpcsRequest.builder().vpcIds(id).build()
            );

            if (response.vpcs() == null || response.vpcs().isEmpty()) {
                return Optional.empty();
            }

            Vpc vpc = response.vpcs().get(0);

            // Fetch attached subnets
            DescribeSubnetsResponse subnetsResponse = ec2Client.describeSubnets(
                    DescribeSubnetsRequest.builder()
                            .filters(Filter.builder().name("vpc-id").values(id).build())
                            .build()
            );

            List<Subnet> subnets = (subnetsResponse.subnets() != null)
                    ? subnetsResponse.subnets().stream().map(this::toSubnetModel).collect(Collectors.toList())
                    : Collections.emptyList();

            // Discover Internet Gateway attachment
            String igwId = "None";
            try {
                DescribeInternetGatewaysResponse igwResponse = ec2Client.describeInternetGateways(
                        DescribeInternetGatewaysRequest.builder()
                                .filters(Filter.builder().name("attachment.vpc-id").values(id).build())
                                .build()
                );
                if (igwResponse.internetGateways() != null && !igwResponse.internetGateways().isEmpty()) {
                    igwId = igwResponse.internetGateways().get(0).internetGatewayId();
                }
            } catch (Exception igwEx) {
                log.debug("No IGW discovered for VPC {}: {}", id, igwEx.getMessage());
            }

            // Discover Security Group
            String securityGroup = "Default";
            try {
                DescribeSecurityGroupsResponse sgResponse = ec2Client.describeSecurityGroups(
                        DescribeSecurityGroupsRequest.builder()
                                .filters(Filter.builder().name("vpc-id").values(id).build())
                                .build()
                );
                if (sgResponse.securityGroups() != null && !sgResponse.securityGroups().isEmpty()) {
                    SecurityGroup sg = sgResponse.securityGroups().get(0);
                    securityGroup = sg.groupId() + " (" + sg.groupName() + ")";
                }
            } catch (Exception sgEx) {
                log.debug("No Security Group discovered for VPC {}: {}", id, sgEx.getMessage());
            }

            // Count EC2 instances in this VPC
            int ec2Count = 0;
            try {
                DescribeInstancesResponse instResponse = ec2Client.describeInstances(
                        DescribeInstancesRequest.builder()
                                .filters(Filter.builder().name("vpc-id").values(id).build())
                                .build()
                );
                ec2Count = (int) instResponse.reservations().stream()
                        .flatMap(r -> r.instances().stream())
                        .filter(inst -> !"terminated".equalsIgnoreCase(inst.state().nameAsString()))
                        .count();
            } catch (Exception instEx) {
                log.debug("Unable to count EC2 instances for VPC {}: {}", id, instEx.getMessage());
            }

            // Transit Gateway attachment status
            String tgwAttachment = "None";
            try {
                DescribeTransitGatewayVpcAttachmentsResponse tgwResponse = ec2Client.describeTransitGatewayVpcAttachments(
                        DescribeTransitGatewayVpcAttachmentsRequest.builder()
                                .filters(Filter.builder().name("vpc-id").values(id).build())
                                .build()
                );
                if (tgwResponse.transitGatewayVpcAttachments() != null && !tgwResponse.transitGatewayVpcAttachments().isEmpty()) {
                    tgwAttachment = tgwResponse.transitGatewayVpcAttachments().get(0).stateAsString();
                }
            } catch (Exception tgwEx) {
                log.debug("Unable to check TGW attachment for VPC {}: {}", id, tgwEx.getMessage());
            }

            String tagVal = getTagValue(vpc.tags(), "Name");
            String name = resolveVpcName(tagVal, vpc.vpcId());
            String displayName = resolveVpcDisplayName(tagVal, vpc.cidrBlock());
            String color = resolveColor(name);

            VpcDetailsDto details = new VpcDetailsDto(
                    vpc.vpcId(),
                    name,
                    displayName,
                    vpc.cidrBlock(),
                    awsRegion.id(),
                    vpc.stateAsString(),
                    subnets.size(),
                    ec2Count,
                    tgwAttachment,
                    subnets,
                    igwId,
                    securityGroup,
                    color
            );

            return Optional.of(details);

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed querying AWS VPC by ID {}: {}", id, e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to inspect AWS VPC " + id + ": " + e.getMessage(), e);
        }
    }

    private VpcDto toVpcDto(Vpc vpc,
                            Map<String, List<software.amazon.awssdk.services.ec2.model.Subnet>> subnetsByVpc,
                            Map<String, Integer> ec2CountByVpc,
                            Map<String, String> tgwStatusByVpc) {

        String tagVal = getTagValue(vpc.tags(), "Name");
        String name = resolveVpcName(tagVal, vpc.vpcId());
        String displayName = resolveVpcDisplayName(tagVal, vpc.cidrBlock());

        int subnetCount = subnetsByVpc.getOrDefault(vpc.vpcId(), Collections.emptyList()).size();
        int ec2Count = ec2CountByVpc.getOrDefault(vpc.vpcId(), 0);
        String attachmentStatus = tgwStatusByVpc.getOrDefault(vpc.vpcId(), "None");

        return new VpcDto(
                vpc.vpcId(),
                name,
                displayName,
                vpc.cidrBlock(),
                awsRegion.id(),
                vpc.stateAsString(),
                subnetCount,
                ec2Count,
                attachmentStatus
        );
    }

    private Subnet toSubnetModel(software.amazon.awssdk.services.ec2.model.Subnet s) {
        String name = getTagValue(s.tags(), "Name");
        if (name == null || name.isEmpty()) {
            name = s.subnetId();
        }
        boolean isPublic = (s.mapPublicIpOnLaunch() != null && s.mapPublicIpOnLaunch()) ||
                name.toLowerCase().contains("pub");

        return new Subnet(
                s.subnetId(),
                name,
                s.cidrBlock(),
                isPublic ? "Public" : "Private",
                s.availabilityZone()
        );
    }

    private Map<String, List<software.amazon.awssdk.services.ec2.model.Subnet>> fetchSubnetsGroupedByVpc() {
        try {
            DescribeSubnetsResponse res = ec2Client.describeSubnets(DescribeSubnetsRequest.builder().build());
            if (res.subnets() != null) {
                return res.subnets().stream()
                        .filter(s -> s.vpcId() != null)
                        .collect(Collectors.groupingBy(software.amazon.awssdk.services.ec2.model.Subnet::vpcId));
            }
        } catch (Exception e) {
            log.warn("Non-fatal: could not batch fetch subnets: {}", e.getMessage());
        }
        return Collections.emptyMap();
    }

    private Map<String, Integer> fetchEc2CountsGroupedByVpc() {
        try {
            DescribeInstancesResponse res = ec2Client.describeInstances(DescribeInstancesRequest.builder().build());
            if (res.reservations() != null) {
                return res.reservations().stream()
                        .flatMap(r -> r.instances().stream())
                        .filter(inst -> inst.vpcId() != null)
                        .filter(inst -> !"terminated".equalsIgnoreCase(inst.state().nameAsString()))
                        .collect(Collectors.groupingBy(Instance::vpcId, Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));
            }
        } catch (Exception e) {
            log.warn("Non-fatal: could not batch count EC2 instances: {}", e.getMessage());
        }
        return Collections.emptyMap();
    }

    private Map<String, String> fetchTgwAttachmentStatusesGroupedByVpc() {
        try {
            DescribeTransitGatewayVpcAttachmentsResponse res = ec2Client.describeTransitGatewayVpcAttachments(
                    DescribeTransitGatewayVpcAttachmentsRequest.builder().build()
            );
            if (res.transitGatewayVpcAttachments() != null) {
                Map<String, String> map = new HashMap<>();
                for (TransitGatewayVpcAttachment att : res.transitGatewayVpcAttachments()) {
                    if (att.vpcId() != null) {
                        map.put(att.vpcId(), att.stateAsString());
                    }
                }
                return map;
            }
        } catch (Exception e) {
            log.warn("Non-fatal: could not batch fetch TGW attachments: {}", e.getMessage());
        }
        return Collections.emptyMap();
    }

    private String getTagValue(List<Tag> tags, String key) {
        if (tags == null) return null;
        return tags.stream()
                .filter(t -> key.equalsIgnoreCase(t.key()))
                .map(Tag::value)
                .findFirst()
                .orElse(null);
    }

    private String resolveVpcName(String tagVal, String vpcId) {
        if (tagVal != null && !tagVal.trim().isEmpty()) {
            String lower = tagVal.toLowerCase();
            if (lower.contains("dev")) return "DEV";
            if (lower.contains("test")) return "TEST";
            if (lower.contains("prod")) return "PROD";
            return tagVal;
        }
        return "Unnamed-VPC-" + (vpcId.length() > 6 ? vpcId.substring(vpcId.length() - 6) : vpcId);
    }

    private String resolveVpcDisplayName(String tagVal, String cidr) {
        if (tagVal != null && !tagVal.trim().isEmpty()) {
            return tagVal;
        }
        return "AWS VPC (" + cidr + ")";
    }

    private String resolveColor(String name) {
        if ("DEV".equalsIgnoreCase(name)) return "#3b82f6";
        if ("TEST".equalsIgnoreCase(name)) return "#0ea5e9";
        if ("PROD".equalsIgnoreCase(name)) return "#6366f1";
        return "#64748b";
    }
}
