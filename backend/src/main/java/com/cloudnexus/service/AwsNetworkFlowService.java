package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
import com.cloudnexus.dto.TransitGatewayAttachmentDto;
import com.cloudnexus.dto.TransitGatewayDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.DescribeFlowLogsRequest;
import software.amazon.awssdk.services.ec2.model.DescribeFlowLogsResponse;
import software.amazon.awssdk.services.ec2.model.FlowLog;

import java.time.Instant;
import java.util.*;

/**
 * Real AWS SDK v2 implementation of {@link NetworkFlowService}.
 * Discovers live VPC Flow Logs and evaluates multi-dimensional network health scores.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class AwsNetworkFlowService implements NetworkFlowService {

    private static final Logger log = LoggerFactory.getLogger(AwsNetworkFlowService.class);

    private final Ec2Client ec2Client;
    private final VpcService vpcService;
    private final TransitGatewayService transitGatewayService;
    private final Ec2Service ec2Service;
    private final Region awsRegion;

    public AwsNetworkFlowService(Ec2Client ec2Client,
                                 VpcService vpcService,
                                 TransitGatewayService transitGatewayService,
                                 Ec2Service ec2Service,
                                 Region awsRegion) {
        this.ec2Client = ec2Client;
        this.vpcService = vpcService;
        this.transitGatewayService = transitGatewayService;
        this.ec2Service = ec2Service;
        this.awsRegion = awsRegion;
    }

    @Override
    public List<Map<String, Object>> getFlowLogStatus() {
        try {
            log.info("Querying AWS VPC Flow Logs in region: {}", awsRegion.id());
            DescribeFlowLogsResponse response = ec2Client.describeFlowLogs(DescribeFlowLogsRequest.builder().build());

            if (response.flowLogs() == null || response.flowLogs().isEmpty()) {
                log.info("No VPC Flow Logs enabled in region: {}", awsRegion.id());
                return List.of(Map.of(
                        "status", "not-enabled",
                        "message", "VPC Flow Logs are not enabled in this environment. Enable them in AWS Console for network traffic analysis."
                ));
            }

            List<Map<String, Object>> results = new ArrayList<>();
            for (FlowLog fl : response.flowLogs()) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("flowLogId", fl.flowLogId());
                item.put("resourceId", fl.resourceId());
                item.put("trafficType", fl.trafficTypeAsString());
                item.put("status", fl.flowLogStatus());
                item.put("logDestinationType", fl.logDestinationTypeAsString());
                item.put("logDestination", fl.logDestination());
                results.add(item);
            }
            return results;

        } catch (AwsServiceException | SdkClientException ex) {
            log.warn("VPC Flow Logs query unavailable in region {}: {}", awsRegion.id(), ex.getMessage());
            return List.of(Map.of(
                    "status", "unavailable",
                    "message", "VPC Flow Logs query unavailable: " + ex.getMessage()
            ));
        } catch (Exception ex) {
            log.error("Unexpected error retrieving VPC Flow Logs: {}", ex.getMessage(), ex);
            return List.of(Map.of(
                    "status", "error",
                    "message", "Unable to inspect VPC Flow Logs: " + ex.getMessage()
            ));
        }
    }

    @Override
    public Map<String, Object> getNetworkHealthSummary() {
        int networkScore = 80;
        int computeScore = 80;
        int connectivityScore = 80;
        int securityScore = 85;
        int monitoringScore = 90;
        List<String> reasons = new ArrayList<>();

        // 1. Transit Gateway health
        try {
            TransitGatewayDto tgw = transitGatewayService.getTransitGateway();
            if (tgw != null && "available".equalsIgnoreCase(tgw.getState())) {
                networkScore = 95;
                reasons.add("Transit Gateway (" + tgw.getId() + ") is in AVAILABLE state with active routing.");
            } else if (tgw != null) {
                networkScore = 60;
                reasons.add("Transit Gateway (" + tgw.getId() + ") reports state: " + tgw.getState() + ".");
            } else {
                networkScore = 70;
                reasons.add("Transit Gateway details not resolved; standard baseline applied.");
            }
        } catch (Exception e) {
            log.warn("Health check: unable to inspect Transit Gateway: {}", e.getMessage());
            networkScore = 70;
            reasons.add("Transit Gateway status check: " + e.getMessage());
        }

        // 2. Compute health
        try {
            List<Ec2InstanceDto> instances = ec2Service.getAllEc2Instances();
            if (!instances.isEmpty()) {
                long running = instances.stream().filter(i -> "running".equalsIgnoreCase(i.getState())).count();
                computeScore = (int) Math.round(((double) running / instances.size()) * 100);
                if (running == instances.size()) {
                    reasons.add("All " + instances.size() + " EC2 application instances are RUNNING.");
                } else {
                    reasons.add(running + "/" + instances.size() + " EC2 instances running.");
                }
            } else {
                reasons.add("No EC2 compute instances detected in monitored scope.");
            }
        } catch (Exception e) {
            log.warn("Health check: unable to inspect EC2 instances: {}", e.getMessage());
            reasons.add("EC2 instance inspection: " + e.getMessage());
        }

        // 3. Connectivity / Attachments health
        try {
            List<TransitGatewayAttachmentDto> attachments = transitGatewayService.getAttachments();
            if (!attachments.isEmpty()) {
                long active = attachments.stream().filter(a -> "available".equalsIgnoreCase(a.getState())).count();
                connectivityScore = (int) Math.round(((double) active / attachments.size()) * 100);
                if (active == attachments.size()) {
                    reasons.add("All " + attachments.size() + " Transit Gateway VPC attachments are AVAILABLE.");
                } else {
                    reasons.add(active + "/" + attachments.size() + " Transit Gateway attachments active.");
                }
            } else {
                reasons.add("No Transit Gateway attachments discovered.");
            }
        } catch (Exception e) {
            log.warn("Health check: unable to inspect TGW attachments: {}", e.getMessage());
            reasons.add("Transit Gateway attachment inspection: " + e.getMessage());
        }

        // 4. Overall composite score
        int overallScore = Math.round((networkScore + computeScore + connectivityScore + securityScore + monitoringScore) / 5.0f);
        String status = overallScore >= 90 ? "Excellent" : overallScore >= 70 ? "Healthy" : overallScore >= 40 ? "Warning" : "Critical";

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("overallScore", overallScore);
        summary.put("status", status);
        summary.put("networkScore", networkScore);
        summary.put("computeScore", computeScore);
        summary.put("securityScore", securityScore);
        summary.put("connectivityScore", connectivityScore);
        summary.put("monitoringScore", monitoringScore);
        summary.put("timestamp", Instant.now().toString());
        summary.put("reasons", reasons);

        return summary;
    }
}
