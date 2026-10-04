package com.cloudnexus.model;

import java.util.List;

public class TransitGateway {
    private String id;
    private String name;
    private String state;
    private String region;
    private long asn;
    private String description;
    private String autoAcceptSharedAttachments;
    private String defaultRouteTableAssociation;
    private String defaultRouteTablePropagation;
    private String dnsSupport;
    private String vpnEcmpSupport;
    private String multicastSupport;
    private List<TgwAttachment> attachments;
    private List<TgwRoute> routes;

    public TransitGateway() {}

    public TransitGateway(String id, String name, String state, String region, long asn,
                          String description, String autoAcceptSharedAttachments,
                          String defaultRouteTableAssociation, String defaultRouteTablePropagation,
                          String dnsSupport, String vpnEcmpSupport, String multicastSupport,
                          List<TgwAttachment> attachments, List<TgwRoute> routes) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.region = region;
        this.asn = asn;
        this.description = description;
        this.autoAcceptSharedAttachments = autoAcceptSharedAttachments;
        this.defaultRouteTableAssociation = defaultRouteTableAssociation;
        this.defaultRouteTablePropagation = defaultRouteTablePropagation;
        this.dnsSupport = dnsSupport;
        this.vpnEcmpSupport = vpnEcmpSupport;
        this.multicastSupport = multicastSupport;
        this.attachments = attachments;
        this.routes = routes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public long getAsn() { return asn; }
    public void setAsn(long asn) { this.asn = asn; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAutoAcceptSharedAttachments() { return autoAcceptSharedAttachments; }
    public void setAutoAcceptSharedAttachments(String autoAcceptSharedAttachments) { this.autoAcceptSharedAttachments = autoAcceptSharedAttachments; }

    public String getDefaultRouteTableAssociation() { return defaultRouteTableAssociation; }
    public void setDefaultRouteTableAssociation(String defaultRouteTableAssociation) { this.defaultRouteTableAssociation = defaultRouteTableAssociation; }

    public String getDefaultRouteTablePropagation() { return defaultRouteTablePropagation; }
    public void setDefaultRouteTablePropagation(String defaultRouteTablePropagation) { this.defaultRouteTablePropagation = defaultRouteTablePropagation; }

    public String getDnsSupport() { return dnsSupport; }
    public void setDnsSupport(String dnsSupport) { this.dnsSupport = dnsSupport; }

    public String getVpnEcmpSupport() { return vpnEcmpSupport; }
    public void setVpnEcmpSupport(String vpnEcmpSupport) { this.vpnEcmpSupport = vpnEcmpSupport; }

    public String getMulticastSupport() { return multicastSupport; }
    public void setMulticastSupport(String multicastSupport) { this.multicastSupport = multicastSupport; }

    public List<TgwAttachment> getAttachments() { return attachments; }
    public void setAttachments(List<TgwAttachment> attachments) { this.attachments = attachments; }

    public List<TgwRoute> getRoutes() { return routes; }
    public void setRoutes(List<TgwRoute> routes) { this.routes = routes; }
}
