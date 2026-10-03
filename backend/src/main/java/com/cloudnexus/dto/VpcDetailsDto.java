package com.cloudnexus.dto;

import com.cloudnexus.model.Subnet;
import java.util.List;

public class VpcDetailsDto extends VpcDto {
    private List<Subnet> subnets;
    private String igwId;
    private String securityGroup;
    private String color;

    public VpcDetailsDto() {
        super();
    }

    public VpcDetailsDto(String id, String name, String displayName, String cidr, String region,
                         String state, int subnetCount, int ec2Count, String attachmentStatus,
                         List<Subnet> subnets, String igwId, String securityGroup, String color) {
        super(id, name, displayName, cidr, region, state, subnetCount, ec2Count, attachmentStatus);
        this.subnets = subnets;
        this.igwId = igwId;
        this.securityGroup = securityGroup;
        this.color = color;
    }

    public List<Subnet> getSubnets() { return subnets; }
    public void setSubnets(List<Subnet> subnets) { this.subnets = subnets; }

    public String getIgwId() { return igwId; }
    public void setIgwId(String igwId) { this.igwId = igwId; }

    public String getSecurityGroup() { return securityGroup; }
    public void setSecurityGroup(String securityGroup) { this.securityGroup = securityGroup; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
