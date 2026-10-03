package com.cloudnexus.model;

import java.util.List;

public class Vpc {
    private String id;
    private String name;
    private String displayName;
    private String cidr;
    private String region;
    private String state;
    private int subnetCount;
    private int ec2Count;
    private String attachmentStatus;
    private List<Subnet> subnets;
    private String igwId;
    private String securityGroup;
    private String color;

    public Vpc() {}

    public Vpc(String id, String name, String displayName, String cidr, String region,
               String state, int subnetCount, int ec2Count, String attachmentStatus,
               List<Subnet> subnets, String igwId, String securityGroup, String color) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.cidr = cidr;
        this.region = region;
        this.state = state;
        this.subnetCount = subnetCount;
        this.ec2Count = ec2Count;
        this.attachmentStatus = attachmentStatus;
        this.subnets = subnets;
        this.igwId = igwId;
        this.securityGroup = securityGroup;
        this.color = color;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getCidr() { return cidr; }
    public void setCidr(String cidr) { this.cidr = cidr; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public int getSubnetCount() { return subnetCount; }
    public void setSubnetCount(int subnetCount) { this.subnetCount = subnetCount; }

    public int getEc2Count() { return ec2Count; }
    public void setEc2Count(int ec2Count) { this.ec2Count = ec2Count; }

    public String getAttachmentStatus() { return attachmentStatus; }
    public void setAttachmentStatus(String attachmentStatus) { this.attachmentStatus = attachmentStatus; }

    public List<Subnet> getSubnets() { return subnets; }
    public void setSubnets(List<Subnet> subnets) { this.subnets = subnets; }

    public String getIgwId() { return igwId; }
    public void setIgwId(String igwId) { this.igwId = igwId; }

    public String getSecurityGroup() { return securityGroup; }
    public void setSecurityGroup(String securityGroup) { this.securityGroup = securityGroup; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
