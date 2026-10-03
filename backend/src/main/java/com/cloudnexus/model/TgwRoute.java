package com.cloudnexus.model;

public class TgwRoute {
    private String destinationCidr;
    private String targetAttachmentId;
    private String targetName;
    private String state;
    private String type;

    public TgwRoute() {}

    public TgwRoute(String destinationCidr, String targetAttachmentId, String targetName, String state, String type) {
        this.destinationCidr = destinationCidr;
        this.targetAttachmentId = targetAttachmentId;
        this.targetName = targetName;
        this.state = state;
        this.type = type;
    }

    public String getDestinationCidr() { return destinationCidr; }
    public void setDestinationCidr(String destinationCidr) { this.destinationCidr = destinationCidr; }

    public String getTargetAttachmentId() { return targetAttachmentId; }
    public void setTargetAttachmentId(String targetAttachmentId) { this.targetAttachmentId = targetAttachmentId; }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
