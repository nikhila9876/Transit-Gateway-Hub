package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
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
 * Real AWS SDK v2 implementation of {@link Ec2Service}.
 * Discovers live AWS EC2 workload instances, states, private/public IPs, and subnet placements.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsEc2Service implements Ec2Service {

    private static final Logger log = LoggerFactory.getLogger(AwsEc2Service.class);

    private final Ec2Client ec2Client;
    private final Region awsRegion;

    public AwsEc2Service(Ec2Client ec2Client, Region awsRegion) {
        this.ec2Client = ec2Client;
        this.awsRegion = awsRegion;
    }

    @Override
    public List<Ec2InstanceDto> getAllEc2Instances() {
        log.info("Discovering live AWS EC2 instances in region: {}", awsRegion.id());
        try {
            // 1. Fetch VPC and Subnet Name lookup maps for clean correlation
            Map<String, String> vpcNames = fetchVpcNamesMap();
            Map<String, String> subnetNames = fetchSubnetNamesMap();

            // 2. Fetch all EC2 instances
            DescribeInstancesResponse response = ec2Client.describeInstances(
                    DescribeInstancesRequest.builder().build()
            );

            if (response.reservations() == null || response.reservations().isEmpty()) {
                log.info("No EC2 reservations found in AWS region: {}", awsRegion.id());
                return Collections.emptyList();
            }

            return response.reservations().stream()
                    .flatMap(r -> r.instances().stream())
                    .filter(inst -> !"terminated".equalsIgnoreCase(inst.state().nameAsString()))
                    .map(inst -> toDto(inst, vpcNames, subnetNames))
                    .collect(Collectors.toList());

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed querying AWS EC2 instances: {}", e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to discover EC2 instances from AWS: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Ec2InstanceDto> getInstanceById(String id) {
        log.info("Inspecting live AWS EC2 instance: {}", id);
        try {
            Map<String, String> vpcNames = fetchVpcNamesMap();
            Map<String, String> subnetNames = fetchSubnetNamesMap();

            DescribeInstancesResponse response = ec2Client.describeInstances(
                    DescribeInstancesRequest.builder()
                            .instanceIds(id)
                            .build()
            );

            if (response.reservations() == null || response.reservations().isEmpty()) {
                return Optional.empty();
            }

            return response.reservations().stream()
                    .flatMap(r -> r.instances().stream())
                    .findFirst()
                    .map(inst -> toDto(inst, vpcNames, subnetNames));

        } catch (AwsServiceException | SdkClientException e) {
            log.error("Failed querying AWS EC2 instance by ID {}: {}", id, e.getMessage());
            throw new AwsIntegrationException("EC2", "Unable to inspect EC2 instance " + id + ": " + e.getMessage(), e);
        }
    }

    private Ec2InstanceDto toDto(Instance inst, Map<String, String> vpcNames, Map<String, String> subnetNames) {
        String tagVal = getTagValue(inst.tags(), "Name");
        String name = (tagVal != null && !tagVal.trim().isEmpty()) ? tagVal : "Unnamed Instance (" + inst.instanceId() + ")";

        String state = inst.state() != null ? inst.state().nameAsString() : "unknown";
        String privateIp = inst.privateIpAddress() != null ? inst.privateIpAddress() : "None";
        String publicIp = inst.publicIpAddress() != null ? inst.publicIpAddress() : "None (Private)";

        String vpcId = inst.vpcId() != null ? inst.vpcId() : "None";
        String vpc = vpcNames.getOrDefault(vpcId, vpcId);

        String subnetId = inst.subnetId() != null ? inst.subnetId() : "None";
        String subnet = subnetNames.getOrDefault(subnetId, subnetId);

        String instanceType = inst.instanceType() != null ? inst.instanceType().toString() : "t3.micro";
        String health = "running".equalsIgnoreCase(state) ? "Healthy" : "Attention";

        String sgId = "sg-none";
        String sgName = "default";
        if (inst.securityGroups() != null && !inst.securityGroups().isEmpty()) {
            GroupIdentifier gi = inst.securityGroups().get(0);
            sgId = gi.groupId();
            sgName = gi.groupName();
        }

        String iamRole = "LabRole";
        if (inst.iamInstanceProfile() != null && inst.iamInstanceProfile().arn() != null) {
            String arn = inst.iamInstanceProfile().arn();
            iamRole = arn.substring(arn.lastIndexOf('/') + 1);
        }

        return new Ec2InstanceDto(
                inst.instanceId(),
                name,
                state,
                privateIp,
                publicIp,
                vpc,
                vpcId,
                subnet,
                subnetId,
                instanceType,
                health,
                sgId,
                sgName,
                iamRole,
                8080,
                true
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
            log.debug("Non-fatal: could not query VPC names: {}", e.getMessage());
        }
        return map;
    }

    private Map<String, String> fetchSubnetNamesMap() {
        Map<String, String> map = new HashMap<>();
        try {
            DescribeSubnetsResponse res = ec2Client.describeSubnets(DescribeSubnetsRequest.builder().build());
            if (res.subnets() != null) {
                for (software.amazon.awssdk.services.ec2.model.Subnet s : res.subnets()) {
                    String tag = getTagValue(s.tags(), "Name");
                    map.put(s.subnetId(), (tag != null && !tag.trim().isEmpty()) ? tag : s.subnetId());
                }
            }
        } catch (Exception e) {
            log.debug("Non-fatal: could not query Subnet names: {}", e.getMessage());
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
