package com.cloudnexus.dto;

public class VpcDto {
    private String id;
    private String name;
    private String displayName;
    private String cidr;
    private String region;
    private String state;
    private int subnetCount;
    private int ec2Count;
    private String attachmentStatus;

    public VpcDto() {}

    public VpcDto(String id, String name, String displayName, String cidr, String region,
                  String state, int subnetCount, int ec2Count, String attachmentStatus) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.cidr = cidr;
        this.region = region;
        this.state = state;
        this.subnetCount = subnetCount;
        this.ec2Count = ec2Count;
        this.attachmentStatus = attachmentStatus;
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
}
