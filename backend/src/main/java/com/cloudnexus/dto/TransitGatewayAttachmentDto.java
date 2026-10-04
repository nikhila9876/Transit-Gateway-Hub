package com.cloudnexus.dto;

import java.util.List;

public class TransitGatewayAttachmentDto {
    private String id;
    private String name;
    private String vpcId;
    private String environment;
    private String resourceType;
    private String state;
    private String associationState;
    private List<String> subnetIds;

    public TransitGatewayAttachmentDto() {}

    public TransitGatewayAttachmentDto(String id, String name, String vpcId, String environment,
                                       String resourceType, String state, String associationState,
                                       List<String> subnetIds) {
        this.id = id;
        this.name = name;
        this.vpcId = vpcId;
        this.environment = environment;
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

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getAssociationState() { return associationState; }
    public void setAssociationState(String associationState) { this.associationState = associationState; }

    public List<String> getSubnetIds() { return subnetIds; }
    public void setSubnetIds(List<String> subnetIds) { this.subnetIds = subnetIds; }
}
