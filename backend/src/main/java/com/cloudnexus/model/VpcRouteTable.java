package com.cloudnexus.model;

import java.util.List;

public class VpcRouteTable {
    private String id;
    private String name;
    private String vpcId;
    private String vpcName;
    private List<RouteEntry> routes;
    private List<String> associations;

    public VpcRouteTable() {}

    public VpcRouteTable(String id, String name, String vpcId, String vpcName, List<RouteEntry> routes, List<String> associations) {
        this.id = id;
        this.name = name;
        this.vpcId = vpcId;
        this.vpcName = vpcName;
        this.routes = routes;
        this.associations = associations;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVpcId() { return vpcId; }
    public void setVpcId(String vpcId) { this.vpcId = vpcId; }

    public String getVpcName() { return vpcName; }
    public void setVpcName(String vpcName) { this.vpcName = vpcName; }

    public List<RouteEntry> getRoutes() { return routes; }
    public void setRoutes(List<RouteEntry> routes) { this.routes = routes; }

    public List<String> getAssociations() { return associations; }
    public void setAssociations(List<String> associations) { this.associations = associations; }
}
