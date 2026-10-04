package com.cloudnexus.model;

import java.util.List;

public class TgwAttachment {
    private String id;
    private String name;
    private String vpcId;
    private String vpcName;
    private String resourceType;
    private String state;
    private String associationState;
    private List<String> subnetIds;

    public TgwAttachment() {}

    public TgwAttachment(String id, String name, String vpcId, String vpcName,
                         String resourceType, String state, String associationState,
                         List<String> subnetIds) {
        this.id = id;
        this.name = name;
        this.vpcId = vpcId;
        this.vpcName = vpcName;
        this.resourceType = resourceType;
        this.state = state;
        this.associationState = associationState;
        this.subnetIds = subnetIds;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVpcId() { return vpcId; }
    public void setVpcId(String vpcId) { this.vpcId = vpcId; }

    public String getVpcName() { return vpcName; }
    public void setVpcName(String vpcName) { this.vpcName = vpcName; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getAssociationState() { return associationState; }
    public void setAssociationState(String associationState) { this.associationState = associationState; }

    public List<String> getSubnetIds() { return subnetIds; }
    public void setSubnetIds(List<String> subnetIds) { this.subnetIds = subnetIds; }
}
