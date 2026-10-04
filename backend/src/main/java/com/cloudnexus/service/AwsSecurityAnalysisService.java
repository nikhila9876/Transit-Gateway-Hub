package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
import com.cloudnexus.dto.SecurityFindingDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;

import java.time.Instant;
import java.util.*;

/**
 * Real AWS SDK v2 implementation of {@link SecurityService}.
 * Inspects live AWS Security Groups and EC2 network interfaces to discover
 * actual security posture vulnerabilities and compliance findings.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsSecurityAnalysisService implements SecurityService {

    private static final Logger log = LoggerFactory.getLogger(AwsSecurityAnalysisService.class);

    private final Ec2Client ec2Client;
    private final Ec2Service ec2Service;
    private final Region awsRegion;

    public AwsSecurityAnalysisService(Ec2Client ec2Client,
                                      Ec2Service ec2Service,
                                      Region awsRegion) {
        this.ec2Client = ec2Client;
        this.ec2Service = ec2Service;
        this.awsRegion = awsRegion;
    }

    @Override
    public List<SecurityFindingDto> getAllFindings() {
        List<SecurityFindingDto> findings = new ArrayList<>();
        String now = Instant.now().toString();

        // 1. Inspect AWS Security Groups
        try {
            log.info("Analyzing AWS security groups in region: {}", awsRegion.id());
            DescribeSecurityGroupsResponse response = ec2Client.describeSecurityGroups(
                    DescribeSecurityGroupsRequest.builder().build()
            );

            if (response.securityGroups() != null) {
                for (SecurityGroup sg : response.securityGroups()) {
                    analyzeSecurityGroup(sg, findings, now);
                }
            }
        } catch (AwsServiceException | SdkClientException ex) {
            log.warn("Unable to inspect AWS Security Groups in region {}: {}", awsRegion.id(), ex.getMessage());
        } catch (Exception ex) {
            log.error("Unexpected error during Security Group analysis: {}", ex.getMessage(), ex);
        }

        // 2. Inspect EC2 Instance Public Exposure
        try {
            List<Ec2InstanceDto> instances = ec2Service.getAllEc2Instances();
            for (Ec2InstanceDto inst : instances) {
                if (inst.getPublicIp() != null && !inst.getPublicIp().isBlank()) {
                    findings.add(new SecurityFindingDto(
                            "sec-inst-" + inst.getId() + "-pubip",
                            "EC2 Instance Has Public IP Address",
                            "MEDIUM",
                            "Workload Security",
                            inst.getId(),
                            inst.getId(),
                            inst.getName() != null ? inst.getName() : inst.getId(),
                            "OPEN",
                            "EC2 instance is directly reachable from the public Internet with an assigned public IPv4 address.",
                            "Public IP: " + inst.getPublicIp() + " assigned to " + inst.getName() + " in subnet " + (inst.getSubnet() != null ? inst.getSubnet() : "default"),
                            "Migrate instance to a private subnet behind a NAT gateway or Application Load Balancer.",
                            now
                    ));
                }
            }
        } catch (Exception ex) {
            log.warn("Unable to inspect EC2 instance public exposure: {}", ex.getMessage());
        }

        log.info("Security intelligence analysis completed with {} real finding(s)", findings.size());
        return findings;
    }

    private void analyzeSecurityGroup(SecurityGroup sg, List<SecurityFindingDto> findings, String timestamp) {
        if (sg.ipPermissions() == null) return;

        for (IpPermission perm : sg.ipPermissions()) {
            boolean hasPublicIpv4 = perm.ipRanges() != null && perm.ipRanges().stream()
                    .anyMatch(r -> "0.0.0.0/0".equals(r.cidrIp()));
            boolean hasPublicIpv6 = perm.ipv6Ranges() != null && perm.ipv6Ranges().stream()
                    .anyMatch(r -> "::/0".equals(r.cidrIpv6()));

            if (!hasPublicIpv4 && !hasPublicIpv6) {
                continue;
            }

            String protocol = perm.ipProtocol();
            int fromPort = perm.fromPort() != null ? perm.fromPort() : -1;
            int toPort = perm.toPort() != null ? perm.toPort() : -1;

            // Check 1: Unrestricted Inbound Traffic (-1 all ports or 0-65535)
            if ("-1".equals(protocol) || (fromPort == 0 && toPort == 65535)) {
                findings.add(new SecurityFindingDto(
                        "sec-sg-" + sg.groupId() + "-alltraffic",
                        "Unrestricted Inbound Traffic",
                        "HIGH",
                        "Network Security",
                        sg.groupId(),
                        sg.groupId(),
                        sg.groupName(),
                        "OPEN",
                        "Security group permits unrestricted inbound traffic from all protocols and ports to 0.0.0.0/0.",
                        "Inbound rule: Protocol " + protocol + " ports [" + fromPort + "-" + toPort + "] open to 0.0.0.0/0",
                        "Remove unrestricted ingress rule and define specific least-privilege protocol and port rules.",
                        timestamp
                ));
            }

            // Check 2: Public SSH (port 22)
            if (fromPort <= 22 && toPort >= 22 && ("tcp".equalsIgnoreCase(protocol) || "-1".equals(protocol))) {
                findings.add(new SecurityFindingDto(
                        "sec-sg-" + sg.groupId() + "-ssh",
                        "Publicly Accessible SSH",
                        "HIGH",
                        "Network Security",
                        sg.groupId(),
                        sg.groupId(),
                        sg.groupName(),
                        "OPEN",
                        "Security group allows SSH (TCP port 22) inbound from anywhere on the public Internet (0.0.0.0/0).",
                        "Inbound rule: TCP port 22 open to 0.0.0.0/0 on " + sg.groupName() + " (" + sg.groupId() + ")",
                        "Restrict SSH access to trusted administration CIDRs or use AWS Systems Manager Session Manager.",
                        timestamp
                ));
            }

            // Check 3: Public RDP (port 3389)
            if (fromPort <= 3389 && toPort >= 3389 && ("tcp".equalsIgnoreCase(protocol) || "-1".equals(protocol))) {
                findings.add(new SecurityFindingDto(
                        "sec-sg-" + sg.groupId() + "-rdp",
                        "Publicly Accessible RDP",
                        "HIGH",
                        "Network Security",
                        sg.groupId(),
                        sg.groupId(),
                        sg.groupName(),
                        "OPEN",
                        "Security group allows RDP (TCP port 3389) inbound from anywhere on the public Internet (0.0.0.0/0).",
                        "Inbound rule: TCP port 3389 open to 0.0.0.0/0 on " + sg.groupName() + " (" + sg.groupId() + ")",
                        "Restrict RDP ingress to authorized management IP ranges or deploy a secure bastion.",
                        timestamp
                ));
            }

            // Check 4: Broad Application Port Access (port 8080)
            if (fromPort <= 8080 && toPort >= 8080 && ("tcp".equalsIgnoreCase(protocol) || "-1".equals(protocol))) {
                findings.add(new SecurityFindingDto(
                        "sec-sg-" + sg.groupId() + "-app8080",
                        "Application Port Broadly Accessible",
                        "MEDIUM",
                        "Network Security",
                        sg.groupId(),
                        sg.groupId(),
                        sg.groupName(),
                        "OPEN",
                        "Security group permits TCP port 8080 directly from 0.0.0.0/0 rather than restricting to VPC CIDR or load balancer.",
                        "Inbound rule: TCP port 8080 open to 0.0.0.0/0 on " + sg.groupName() + " (" + sg.groupId() + ")",
                        "Restrict port 8080 inbound to the Transit Gateway hub or specific peer VPC CIDRs.",
                        timestamp
                ));
            }
        }
    }
}
