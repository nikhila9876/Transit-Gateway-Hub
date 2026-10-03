package com.cloudnexus.dto;

public class TransitGatewayRouteDto {
    private String destinationCidrBlock;
    private String transitGatewayAttachmentId;
    private String attachmentName;
    private String state;
    private String type;

    public TransitGatewayRouteDto() {}

    public TransitGatewayRouteDto(String destinationCidrBlock, String transitGatewayAttachmentId,
                                  String attachmentName, String state, String type) {
        this.destinationCidrBlock = destinationCidrBlock;
        this.transitGatewayAttachmentId = transitGatewayAttachmentId;
        this.attachmentName = attachmentName;
        this.state = state;
        this.type = type;
    }

    public String getDestinationCidrBlock() { return destinationCidrBlock; }
    public void setDestinationCidrBlock(String destinationCidrBlock) { this.destinationCidrBlock = destinationCidrBlock; }

    public String getTransitGatewayAttachmentId() { return transitGatewayAttachmentId; }
    public void setTransitGatewayAttachmentId(String transitGatewayAttachmentId) { this.transitGatewayAttachmentId = transitGatewayAttachmentId; }

    public String getAttachmentName() { return attachmentName; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
