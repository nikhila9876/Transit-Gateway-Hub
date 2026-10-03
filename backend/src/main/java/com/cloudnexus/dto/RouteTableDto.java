package com.cloudnexus.dto;

import com.cloudnexus.model.RouteEntry;
import java.util.List;

public class RouteTableDto {
    private String id;
    private String name;
    private String vpcId;
    private String vpc;
    private List<RouteEntry> routes;
    private List<String> associations;
    private String status;

    public RouteTableDto() {
        this.status = "Active";
    }

    public RouteTableDto(String id, String name, String vpcId, String vpc,
                         List<RouteEntry> routes, List<String> associations, String status) {
        this.id = id;
        this.name = name;
        this.vpcId = vpcId;
        this.vpc = vpc;
        this.routes = routes;
        this.associations = associations;
        this.status = status != null ? status : "Active";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVpcId() { return vpcId; }
    public void setVpcId(String vpcId) { this.vpcId = vpcId; }

    public String getVpc() { return vpc; }
    public void setVpc(String vpc) { this.vpc = vpc; }

    public List<RouteEntry> getRoutes() { return routes; }
    public void setRoutes(List<RouteEntry> routes) { this.routes = routes; }

    public List<String> getAssociations() { return associations; }
    public void setAssociations(List<String> associations) { this.associations = associations; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
