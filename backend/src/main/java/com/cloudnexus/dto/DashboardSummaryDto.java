package com.cloudnexus.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private int vpcCount;
    private int totalVpcs;
    private String transitGatewayStatus;
    private String transitGatewayName;
    private int attachmentCount;
    private int tgwAttachments;
    private int ec2Count;
    private int ec2Instances;
    private int networkHealth;
    private int securityFindings;
    private String crossVpcConnectivity;
    private int activeAlerts;
    private int totalSubnets;
    private String region;
    private List<Map<String, Object>> recentActivity;
    private List<Map<String, Object>> environmentBreakdown;

    public DashboardSummaryDto() {}

    public int getVpcCount() { return vpcCount; }
    public void setVpcCount(int vpcCount) {
        this.vpcCount = vpcCount;
        this.totalVpcs = vpcCount;
    }

    public int getTotalVpcs() { return totalVpcs; }
    public void setTotalVpcs(int totalVpcs) {
        this.totalVpcs = totalVpcs;
        this.vpcCount = totalVpcs;
    }

    public String getTransitGatewayStatus() { return transitGatewayStatus; }
    public void setTransitGatewayStatus(String transitGatewayStatus) { this.transitGatewayStatus = transitGatewayStatus; }

    public String getTransitGatewayName() { return transitGatewayName; }
    public void setTransitGatewayName(String transitGatewayName) { this.transitGatewayName = transitGatewayName; }

    public int getAttachmentCount() { return attachmentCount; }
    public void setAttachmentCount(int attachmentCount) {
        this.attachmentCount = attachmentCount;
        this.tgwAttachments = attachmentCount;
    }

    public int getTgwAttachments() { return tgwAttachments; }
    public void setTgwAttachments(int tgwAttachments) {
        this.tgwAttachments = tgwAttachments;
        this.attachmentCount = tgwAttachments;
    }

    public int getEc2Count() { return ec2Count; }
    public void setEc2Count(int ec2Count) {
        this.ec2Count = ec2Count;
        this.ec2Instances = ec2Count;
    }

    public int getEc2Instances() { return ec2Instances; }
    public void setEc2Instances(int ec2Instances) {
        this.ec2Instances = ec2Instances;
        this.ec2Count = ec2Instances;
    }

    public int getNetworkHealth() { return networkHealth; }
    public void setNetworkHealth(int networkHealth) { this.networkHealth = networkHealth; }

    public int getSecurityFindings() { return securityFindings; }
    public void setSecurityFindings(int securityFindings) { this.securityFindings = securityFindings; }

    public String getCrossVpcConnectivity() { return crossVpcConnectivity; }
    public void setCrossVpcConnectivity(String crossVpcConnectivity) { this.crossVpcConnectivity = crossVpcConnectivity; }

    public int getActiveAlerts() { return activeAlerts; }
    public void setActiveAlerts(int activeAlerts) { this.activeAlerts = activeAlerts; }

    public int getTotalSubnets() { return totalSubnets; }
    public void setTotalSubnets(int totalSubnets) { this.totalSubnets = totalSubnets; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public List<Map<String, Object>> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<Map<String, Object>> recentActivity) { this.recentActivity = recentActivity; }

    public List<Map<String, Object>> getEnvironmentBreakdown() { return environmentBreakdown; }
    public void setEnvironmentBreakdown(List<Map<String, Object>> environmentBreakdown) { this.environmentBreakdown = environmentBreakdown; }
}
